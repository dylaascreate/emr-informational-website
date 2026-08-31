import express from "express";
import path from "path";
import cors from "cors";
import { createClient } from "@libsql/client";
import { createServer as createViteServer } from "vite";

// Initialize SQLite database
const db = createClient({
  url: "file:content.db",
});

async function initDB() {
  // Admins table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT,
      avatar TEXT
    )
  `);

  // Services table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      title TEXT,
      description TEXT,
      icon TEXT,
      content TEXT,
      image TEXT
    )
  `);

  // Packages / Menus table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_slug TEXT,
      name TEXT,
      description TEXT,
      image TEXT
    )
  `);

  // Team / Org Chart table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS team (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id TEXT UNIQUE,
      role TEXT,
      name TEXT,
      image TEXT,
      bio TEXT,
      level INTEGER
    )
  `);

  // Certifications table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      title TEXT,
      body TEXT,
      icon TEXT,
      category TEXT
    )
  `);

  // Testimonials table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      role TEXT,
      company TEXT,
      quote TEXT,
      image TEXT,
      rating INTEGER,
      vessel_type TEXT
    )
  `);

  // Partners table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      logo TEXT
    )
  `);

  // Branches table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      location TEXT,
      contact_number TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact Submissions table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Quotation Requests table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotation_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      company TEXT,
      vessel_type TEXT,
      service_required TEXT,
      details TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed Admins if empty
  const { rows: adminRows } = await db.execute("SELECT count(*) as count FROM admins");
  if (adminRows[0].count === 0) {
    await db.execute({
      sql: "INSERT INTO admins (username, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)",
      args: ["superadmin", "admin123", "Jonathan Sterling (Super Admin)", "superadmin", "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"]
    });
    await db.execute({
      sql: "INSERT INTO admins (username, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)",
      args: ["marketing", "marketing123", "Sarah Chen (Marketing Manager)", "marketing", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"]
    });
    console.log("Admin accounts seeded.");
  }

  const { rows: salesRows } = await db.execute("SELECT count(*) as count FROM admins WHERE role = 'sales'");
  if (salesRows[0].count === 0) {
    await db.execute({
      sql: "INSERT INTO admins (username, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)",
      args: ["sales", "sales123", "David Sales (Sales Lead)", "sales", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300"]
    });
    console.log("Sales account seeded.");
  }

  // Seed Services if empty
  const { rows: serviceRows } = await db.execute("SELECT count(*) as count FROM services");
  if (serviceRows[0].count === 0) {
    const services = [
      { 
        slug: "yacht-catering",
        icon: "Utensils", 
        title: "Yacht & Passenger Catering", 
        description: "Premium dining experiences for luxury yachts and passenger vessels. We provide bespoke menus curated by world-class chefs, accommodating all dietary preferences with the finest global ingredients.",
        content: "Our yacht catering services represent the pinnacle of maritime hospitality. We understand that luxury vessels demand exceptional culinary standards. Our world-class chefs are trained in diverse international cuisines and are adept at creating bespoke menus that cater to the exacting preferences of your guests.\n\nWhether you need a formal fine-dining experience or casual alfresco meals, our team ensures every dish is crafted with the freshest, highest-quality ingredients sourced globally. We handle everything from menu planning and provisioning to onboard execution, allowing you and your guests to enjoy an unforgettable culinary journey at sea.",
        image: "https://images.unsplash.com/photo-1544377192-339241c6d868?auto=format&fit=crop&q=80&w=1200"
      },
      { 
        slug: "cargo-merchant-vessels",
        icon: "Ship", 
        title: "Cargo & Merchant Vessels", 
        description: "Robust, high-energy nutritional meal planning designed specifically for the demanding, long-haul needs of cargo vessel crews. We ensure morale remains high across extended oceanic journeys.",
        content: "Sustaining a crew on a long-haul cargo voyage requires more than just food; it requires proper nutrition to maintain energy, focus, and morale. Our cargo vessel catering services are designed with the demanding nature of merchant marine work in mind.\n\nWe provide robust, high-energy meal plans that are nutritionally balanced and culturally appropriate for multinational crews. Our logistics team ensures that your vessel is fully provisioned with high-quality dry, chilled, and frozen goods, carefully managed to last the duration of the voyage without compromising on taste or quality.",
        image: "https://images.unsplash.com/photo-1572097364417-6490ed4b2d10?auto=format&fit=crop&q=80&w=1200"
      },
      { 
        slug: "offshore-platform",
        icon: "Anchor", 
        title: "Offshore Platform Support", 
        description: "Specialized catering and hospitality solutions for oil rigs and offshore platforms. Our teams are trained in extreme-environment logistics and strict safety protocols.",
        content: "Offshore platforms present unique logistical and environmental challenges. Our offshore catering and hospitality support services are built on a foundation of strict safety compliance, operational efficiency, and exceptional service quality.\n\nWe provide comprehensive galley management, ensuring that rig personnel receive nutritious, high-quality meals 24/7. Our staff are fully certified in offshore safety protocols and are experienced in managing provisions in extreme environments. Beyond catering, we also offer complete housekeeping and laundry services to maintain a comfortable and hygienic living environment on the platform.",
        image: "https://images.unsplash.com/photo-1588612543419-4a92c474d2eb?auto=format&fit=crop&q=80&w=1200"
      },
      { 
        slug: "crew-management",
        icon: "Users", 
        title: "Galley Crew Management", 
        description: "End-to-end professional staffing. We recruit, train, and manage highly skilled galley personnel, ensuring seamless kitchen operations and strict adherence to maritime standards.",
        content: "A successful maritime catering operation relies on the skill and dedication of the galley crew. We provide comprehensive end-to-end crew management services, from recruitment and vetting to continuous training and deployment.\n\nOur extensive network allows us to source experienced Chief Cooks, Messmen, and Stewards who are fully certified in accordance with MLC 2006 and international hygiene standards (HACCP). We manage all aspects of crew administration, payroll, and welfare, ensuring your vessel is staffed with a motivated, compliant, and highly skilled hospitality team.",
        image: "https://images.unsplash.com/photo-1543360565-dcbac7e6403d?auto=format&fit=crop&q=80&w=1200"
      },
      { 
        slug: "supply-chain",
        icon: "Truck", 
        title: "Provisions & Supply Chain", 
        description: "Efficient global sourcing and delivery of dry, chilled, and frozen provisions. Our advanced logistics network ensures fresh, high-quality supplies reach the most remote ports on time.",
        content: "Reliable provisioning is the lifeline of any vessel. Our global supply chain network is engineered to deliver high-quality provisions to vessels across the world's major and remote ports.\n\nWe leverage strategic partnerships with international suppliers to ensure competitive pricing and guaranteed freshness. Our logistics experts coordinate complex deliveries, managing cold chain integrity for chilled and frozen goods, and ensuring compliance with local customs and import regulations. With our advanced tracking systems, you can rely on on-time, in-full deliveries every time.",
        image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1200"
      },
      { 
        slug: "quality-control",
        icon: "Award", 
        title: "Quality Control & Compliance", 
        description: "Unwavering commitment to the highest standards of food safety, HACCP compliance, and hygiene certifications specific to the maritime and offshore industries.",
        content: "Safety and quality are at the core of everything we do. Our comprehensive quality control programs ensure that every aspect of our catering and provisioning services meets the most rigorous international standards.\n\nWe strictly adhere to HACCP (Hazard Analysis Critical Control Point) principles and MLC 2006 regulations. Our dedicated Quality Assurance team conducts regular supplier audits, rigorous product inspections, and continuous monitoring of our supply chain to guarantee food safety and hygiene from source to ship.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=1200"
      }
    ];

    for (const s of services) {
      await db.execute({
        sql: "INSERT INTO services (slug, title, description, icon, content, image) VALUES (?, ?, ?, ?, ?, ?)",
        args: [s.slug, s.title, s.description, s.icon, s.content, s.image]
      });
    }
    console.log("Services seeded.");
  }

  // Seed Packages if empty
  const { rows: packageRows } = await db.execute("SELECT count(*) as count FROM packages");
  if (packageRows[0].count === 0) {
    const packages = [
      {
        service_slug: "yacht-catering",
        name: "Captain's Table (Fine Dining)",
        description: "A 5-course gourmet dining experience featuring fresh seafood, premium cuts, and exquisite wine pairings tailored to luxury guests.",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800"
      },
      {
        service_slug: "yacht-catering",
        name: "Alfresco Ocean Buffet",
        description: "A premium open-air buffet featuring Mediterranean salads, grilled seafood, and artisanal desserts, perfect for deck parties.",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800"
      },
      {
        service_slug: "cargo-merchant-vessels",
        name: "Long-Haul Energy Plan",
        description: "High-protein, calorie-dense meals designed for heavy labor. Includes hot breakfasts, hearty stews, and 24/7 snack stations.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800"
      },
      {
        service_slug: "cargo-merchant-vessels",
        name: "International Crew Menu",
        description: "A diverse rotating menu designed to satisfy multinational crews, offering authentic Asian, Mediterranean, and Western hot meals.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
      },
      {
        service_slug: "offshore-platform",
        name: "24/7 Rig Operations Menu",
        description: "Continuous galley service accommodating diverse shifts. Features hearty main courses, fresh salads, and grab-and-go options for busy rig workers.",
        image: "https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&q=80&w=800"
      }
    ];

    for (const p of packages) {
      await db.execute({
        sql: "INSERT INTO packages (service_slug, name, description, image) VALUES (?, ?, ?, ?)",
        args: [p.service_slug, p.name, p.description, p.image]
      });
    }
    console.log("Packages seeded.");
  }

  // Seed Branches if empty
  const { rows: branchRows } = await db.execute("SELECT count(*) as count FROM branches");
  if (branchRows[0].count === 0) {
    const branches = [
      {
        name: "Kuala Lumpur Headquarters",
        location: "KL Sentral, 50470 Kuala Lumpur, Malaysia",
        contact_number: "+60 3 1234 5678",
        email: "kl.hq@eastmanresource.com"
      },
      {
        name: "Singapore Port Office",
        location: "Marina South Pier, Singapore 018988",
        contact_number: "+65 6123 4567",
        email: "sg.ops@eastmanresource.com"
      }
    ];
    for (const b of branches) {
      await db.execute({
        sql: "INSERT INTO branches (name, location, contact_number, email) VALUES (?, ?, ?, ?)",
        args: [b.name, b.location, b.contact_number, b.email]
      });
    }
    console.log("Branches seeded.");
  }

  // Seed Team if empty
  const { rows: teamRows } = await db.execute("SELECT count(*) as count FROM team");
  if (teamRows[0].count === 0) {
    const teamMembers = [
      { 
        member_id: 'ceo', 
        level: 1,
        role: 'Chief Executive Officer', 
        name: 'Jonathan Sterling', 
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', 
        bio: 'Jonathan brings over 30 years of maritime logistics and hospitality experience. He founded East Man Resource with a vision to elevate offshore living standards globally.' 
      },
      { 
        id: 'coo', 
        member_id: 'coo',
        level: 2,
        role: 'Chief Operating Officer', 
        name: 'Sarah Chen', 
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', 
        bio: 'Sarah oversees global supply chain operations, ensuring that provisions reach remote vessels safely and on time, maintaining strict HACCP compliance across all hubs.' 
      },
      { 
        member_id: 'cfo', 
        level: 2,
        role: 'Chief Financial Officer', 
        name: 'Marcus Thorne', 
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', 
        bio: 'Marcus directs financial strategy and international procurement budgets, forging strong partnerships with global food suppliers to ensure premium quality at scale.' 
      },
      { 
        member_id: 'vp_culinary', 
        level: 3,
        role: 'VP of Culinary Excellence', 
        name: 'Elena Rossi', 
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800', 
        bio: 'Elena is a former Michelin-star chef who now designs tailored menus for multinational crews, focusing on nutrition, morale, and cultural authenticity.' 
      },
      { 
        member_id: 'vp_hr', 
        level: 3,
        role: 'Head of Crew Management', 
        name: 'David Okafor', 
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', 
        bio: 'David manages the recruitment, training, and deployment of over 500 galley personnel, ensuring all staff meet MLC 2006 and maritime safety standards.' 
      },
    ];

    for (const m of teamMembers) {
      await db.execute({
        sql: "INSERT INTO team (member_id, role, name, image, bio, level) VALUES (?, ?, ?, ?, ?, ?)",
        args: [m.member_id, m.role, m.name, m.image, m.bio, m.level]
      });
    }
    console.log("Team members seeded.");
  }

  // Seed Certifications if empty
  const { rows: certRows } = await db.execute("SELECT count(*) as count FROM certifications");
  if (certRows[0].count === 0) {
    const certs = [
      {
        code: "MLC 2006",
        title: "Maritime Labour Convention Title 3.2",
        body: "Full compliance with ILO standards for onboard accommodation, food catering, crew dietary wellness, and galley hygiene.",
        icon: "Anchor",
        category: "Maritime Law"
      },
      {
        code: "HACCP",
        title: "Hazard Analysis Critical Control Point",
        body: "Systematic preventive approach to food safety biological, chemical, and physical hazards across our entire maritime supply chain.",
        icon: "ShieldCheck",
        category: "Food Safety"
      },
      {
        code: "ISO 22000:2018",
        title: "Food Safety Management System",
        body: "Internationally audited standard demonstrating our capability to control food safety hazards from supplier port to offshore galley.",
        icon: "FileCheck2",
        category: "Global Standards"
      },
      {
        code: "ISO 9001:2015",
        title: "Quality Management Accreditation",
        body: "Certified quality management across procurement, cold-chain storage logistics, and galley crew deployment workflows.",
        icon: "BadgeCheck",
        category: "Operations"
      },
      {
        code: "HALAL ASSURED",
        title: "Certified Halal Supply & Segregation",
        body: "Dedicated Halal storage, handling, and prep protocols compliant with international Islamic dietary authorities for Muslim seafarers.",
        icon: "Sparkles",
        category: "Dietary Standard"
      },
      {
        code: "BOSIET & OPITO",
        title: "Offshore Safety Training Certified",
        body: "All offshore galley staff and supervisors are fully certified in emergency response, sea survival, and helicopter safety.",
        icon: "Shield",
        category: "Offshore Safety"
      }
    ];

    for (const c of certs) {
      await db.execute({
        sql: "INSERT INTO certifications (code, title, body, icon, category) VALUES (?, ?, ?, ?, ?)",
        args: [c.code, c.title, c.body, c.icon, c.category]
      });
    }
    console.log("Certifications seeded.");
  }

  // Seed Testimonials if empty
  const { rows: testimonialRows } = await db.execute("SELECT count(*) as count FROM testimonials");
  if (testimonialRows[0].count === 0) {
    const testimonials = [
      {
        name: "Capt. Henrik Visser",
        role: "Master Mariner",
        company: "Nordic Bulk Carrier Line",
        quote: "East Man Resource transformed our crew's morale during a 45-day trans-Pacific voyage. The nutritional balance and diversity of meals kept everyone healthy, energized, and satisfied.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        rating: 5,
        vessel_type: "Merchant Cargo"
      },
      {
        name: "Claire Beaumont",
        role: "Chief Stewardess",
        company: "Aura Luxury Charters (Monaco)",
        quote: "The culinary standards for our private charter were nothing short of world-class. From bespoke dietary accommodations to presentation, every meal exceeded our high-profile guests' expectations.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
        rating: 5,
        vessel_type: "Superyacht"
      },
      {
        name: "Tariq Al-Mansoor",
        role: "Logistics Superintendent",
        company: "Apex Deepwater Platforms",
        quote: "Operating on an offshore platform requires strict safety compliance and reliable 24/7 galley service. East Man delivers flawless logistics, HACCP standards, and great food without fail.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        rating: 5,
        vessel_type: "Offshore Rig"
      }
    ];

    for (const t of testimonials) {
      await db.execute({
        sql: "INSERT INTO testimonials (name, role, company, quote, image, rating, vessel_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [t.name, t.role, t.company, t.quote, t.image, t.rating, t.vessel_type]
      });
    }
    console.log("Testimonials seeded.");
  }

  // Seed Partners if empty
  const { rows: partnerRows } = await db.execute("SELECT count(*) as count FROM partners");
  if (partnerRows[0].count === 0) {
    const partners = [
      { name: "Oceanic Lines", logo: "🌊" },
      { name: "Global Freight Co.", logo: "🚢" },
      { name: "SeaWays Logistics", logo: "⚓" },
      { name: "Marina Holdings", logo: "🛥️" },
      { name: "Equator Shipping", logo: "🧭" },
      { name: "Nordic Marine", logo: "❄️" },
      { name: "Pacific Charters", logo: "🌴" },
      { name: "Atlantic Supply", logo: "📦" },
    ];

    for (const pr of partners) {
      await db.execute({
        sql: "INSERT INTO partners (name, logo) VALUES (?, ?)",
        args: [pr.name, pr.logo]
      });
    }
    console.log("Partners seeded.");
  }

  // Seed Contacts if empty
  const { rows: contactRows } = await db.execute("SELECT count(*) as count FROM contact_submissions");
  if (contactRows[0].count === 0) {
    const contactsData = [
      { name: "John Doe", email: "john@example.com", subject: "Catering Inquiry", message: "Interested in offshore catering.", status: "Pending" },
      { name: "Jane Smith", email: "jane@example.com", subject: "Logistics", message: "Need supply chain assistance.", status: "In Progress" },
      { name: "Mark Wilson", email: "mark@example.com", subject: "Port Management", message: "Looking for port agency services.", status: "Completed" }
    ];
    for (const c of contactsData) {
      await db.execute({
        sql: "INSERT INTO contact_submissions (name, email, subject, message, status) VALUES (?, ?, ?, ?, ?)",
        args: [c.name, c.email, c.subject, c.message, c.status]
      });
    }
    console.log("Contacts seeded.");
  }

  // Seed Quotations if empty
  const { rows: quotationRows } = await db.execute("SELECT count(*) as count FROM quotation_requests");
  if (quotationRows[0].count === 0) {
    const quotationsData = [
      { name: "Alice Brown", email: "alice@alphamarine.com", company: "Alpha Marine", vessel_type: "Bulk Carrier", service_required: "Catering", details: "Standard catering package for 25 crew members over 3 months.", status: "Pending" },
      { name: "Bob Green", email: "bob@betalogistics.com", company: "Beta Logistics", vessel_type: "Oil Tanker", service_required: "Logistics", details: "Fresh provision delivery for 15 crew over 1 month.", status: "In Progress" },
      { name: "Charlie White", email: "charlie@gammaoffshore.com", company: "Gamma Offshore", vessel_type: "Offshore Platform", service_required: "Offshore Support", details: "Full offshore support for 100 crew over 1 year.", status: "Completed" },
      { name: "Diana Black", email: "diana@deltashipping.com", company: "Delta Shipping", vessel_type: "Container Ship", service_required: "Catering", details: "Premium meals requested for 30 crew over 6 months.", status: "Pending" }
    ];
    for (const q of quotationsData) {
      await db.execute({
        sql: "INSERT INTO quotation_requests (name, email, company, vessel_type, service_required, details, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [q.name, q.email, q.company, q.vessel_type, q.service_required, q.details, q.status]
      });
    }
    console.log("Quotations seeded.");
  }
}

async function startServer() {
  await initDB();

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // ==========================================
  // PUBLIC API ENDPOINTS
  // ==========================================

  // Services
  app.get("/api/services", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT id, slug, title, description, icon, content, image FROM services ORDER BY id ASC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const { rows } = await db.execute({
        sql: "SELECT * FROM services WHERE slug = ?",
        args: [slug]
      });
      if (rows.length === 0) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      const service: Record<string, any> = { ...rows[0] };
      
      const { rows: packageRows } = await db.execute({
        sql: "SELECT id, service_slug, name, description, image FROM packages WHERE service_slug = ?",
        args: [slug]
      });
      
      service.packages = packageRows;
      res.json(service);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch service details" });
    }
  });

  // Packages / Menus
  app.get("/api/packages", async (req, res) => {
    try {
      const serviceSlug = req.query.service;
      let sql = "SELECT id, service_slug, name, description, image FROM packages";
      const args: any[] = [];
      if (serviceSlug) {
        sql += " WHERE service_slug = ?";
        args.push(serviceSlug);
      }
      sql += " ORDER BY id ASC";
      const { rows } = await db.execute({ sql, args });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  // Team / Org Chart
  app.get("/api/team", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT id, member_id, role, name, image, bio, level FROM team ORDER BY level ASC, id ASC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  // Certifications
  app.get("/api/certifications", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT id, code, title, body, icon, category FROM certifications ORDER BY id ASC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  // Testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT id, name, role, company, quote, image, rating, vessel_type FROM testimonials ORDER BY id ASC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Partners
  app.get("/api/partners", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT id, name, logo FROM partners ORDER BY id ASC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  // Branches
  app.get("/api/branches", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT id, name, location, contact_number, email FROM branches ORDER BY id ASC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch branches" });
    }
  });

  // Contact Submissions
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }
    try {
      await db.execute({
        sql: "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
        args: [name, email, subject || "", message]
      });
      res.json({ success: true, message: "Message sent successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Quotation Requests
  app.post("/api/quotations", async (req, res) => {
    const { name, email, company, vessel_type, service_required, details } = req.body;
    if (!name || !email || !company || !service_required) {
      return res.status(400).json({ error: "Name, email, company, and service required are required" });
    }
    try {
      await db.execute({
        sql: "INSERT INTO quotation_requests (name, email, company, vessel_type, service_required, details) VALUES (?, ?, ?, ?, ?, ?)",
        args: [name, email, company, vessel_type || "", service_required, details || ""]
      });
      res.json({ success: true, message: "Quotation request sent successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to submit quotation request" });
    }
  });

  // ==========================================
  // AUTHENTICATION & ADMIN ENDPOINTS
  // ==========================================

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      const { rows } = await db.execute({
        sql: "SELECT id, username, name, role, avatar FROM admins WHERE username = ? AND password = ?",
        args: [username.trim(), password.trim()]
      });

      if (rows.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const admin = rows[0];
      const token = `emr-auth-token-${admin.username}-${Date.now()}`;
      res.json({
        success: true,
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          role: admin.role,
          avatar: admin.avatar,
          token
        }
      });
    } catch (err) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // ==========================================
  // ADMIN CRUD: USERS
  // ==========================================
  app.get("/api/admin/users", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT id, username, name, role, avatar FROM admins ORDER BY id ASC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    const { username, password, name, role, avatar } = req.body;
    if (!username || !password || !name || !role) {
      return res.status(400).json({ error: "Username, password, name, and role are required" });
    }
    try {
      const result = await db.execute({
        sql: "INSERT INTO admins (username, password, name, role, avatar) VALUES (?, ?, ?, ?, ?)",
        args: [username, password, name, role, avatar || ""]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err: any) {
      if (err.message && err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "Username already exists" });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    const id = req.params.id;
    const { username, password, name, role, avatar } = req.body;
    if (!username || !name || !role) {
      return res.status(400).json({ error: "Username, name, and role are required" });
    }
    try {
      if (password) {
        await db.execute({
          sql: "UPDATE admins SET username = ?, password = ?, name = ?, role = ?, avatar = ? WHERE id = ?",
          args: [username, password, name, role, avatar || "", id]
        });
      } else {
        await db.execute({
          sql: "UPDATE admins SET username = ?, name = ?, role = ?, avatar = ? WHERE id = ?",
          args: [username, name, role, avatar || "", id]
        });
      }
      res.json({ success: true, message: "User updated successfully" });
    } catch (err: any) {
      if (err.message && err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "Username already exists" });
      }
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM admins WHERE id = ?", args: [id] });
      res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ==========================================
  // ADMIN CRUD: SERVICES
  // ==========================================
  app.post("/api/admin/services", async (req, res) => {
    const { slug, title, description, icon, content, image } = req.body;
    if (!slug || !title || !description) {
      return res.status(400).json({ error: "Slug, title and description are required" });
    }

    try {
      const generatedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      const result = await db.execute({
        sql: "INSERT INTO services (slug, title, description, icon, content, image) VALUES (?, ?, ?, ?, ?, ?)",
        args: [generatedSlug, title, description, icon || "Ship", content || "", image || ""]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid), slug: generatedSlug });
    } catch (err: any) {
      if (err.message && err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "A service with this slug already exists" });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", async (req, res) => {
    const id = req.params.id;
    const { slug, title, description, icon, content, image } = req.body;
    if (!slug || !title || !description) {
      return res.status(400).json({ error: "Slug, title and description are required" });
    }

    try {
      await db.execute({
        sql: "UPDATE services SET slug = ?, title = ?, description = ?, icon = ?, content = ?, image = ? WHERE id = ?",
        args: [slug, title, description, icon, content, image, id]
      });
      res.json({ success: true, message: "Service updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Find service slug first to delete related packages if needed
      const { rows } = await db.execute({
        sql: "SELECT slug FROM services WHERE id = ?",
        args: [id]
      });
      if (rows.length > 0) {
        const slug = rows[0].slug;
        await db.execute({ sql: "DELETE FROM packages WHERE service_slug = ?", args: [slug] });
      }
      await db.execute({ sql: "DELETE FROM services WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Service deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // ==========================================
  // ADMIN CRUD: PACKAGES / MENUS
  // ==========================================
  app.post("/api/admin/packages", async (req, res) => {
    const { service_slug, name, description, image } = req.body;
    if (!service_slug || !name || !description) {
      return res.status(400).json({ error: "Service, package name and description are required" });
    }

    try {
      const result = await db.execute({
        sql: "INSERT INTO packages (service_slug, name, description, image) VALUES (?, ?, ?, ?)",
        args: [service_slug, name, description, image || ""]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      res.status(500).json({ error: "Failed to create package" });
    }
  });

  app.put("/api/admin/packages/:id", async (req, res) => {
    const id = req.params.id;
    const { service_slug, name, description, image } = req.body;
    if (!service_slug || !name || !description) {
      return res.status(400).json({ error: "Service, package name and description are required" });
    }

    try {
      await db.execute({
        sql: "UPDATE packages SET service_slug = ?, name = ?, description = ?, image = ? WHERE id = ?",
        args: [service_slug, name, description, image, id]
      });
      res.json({ success: true, message: "Package updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update package" });
    }
  });

  app.delete("/api/admin/packages/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM packages WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Package deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete package" });
    }
  });

  // ==========================================
  // ADMIN CRUD: TEAM / ORG CHART
  // ==========================================
  app.post("/api/admin/team", async (req, res) => {
    const { role, name, image, bio, level } = req.body;
    if (!role || !name || !bio) {
      return res.status(400).json({ error: "Role, name, and bio are required" });
    }

    try {
      const member_id = `member-${Date.now()}`;
      const result = await db.execute({
        sql: "INSERT INTO team (member_id, role, name, image, bio, level) VALUES (?, ?, ?, ?, ?, ?)",
        args: [member_id, role, name, image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400", bio, level || 2]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      res.status(500).json({ error: "Failed to add team member" });
    }
  });

  app.put("/api/admin/team/:id", async (req, res) => {
    const id = req.params.id;
    const { role, name, image, bio, level } = req.body;
    if (!role || !name || !bio) {
      return res.status(400).json({ error: "Role, name, and bio are required" });
    }

    try {
      await db.execute({
        sql: "UPDATE team SET role = ?, name = ?, image = ?, bio = ?, level = ? WHERE id = ?",
        args: [role, name, image, bio, level || 2, id]
      });
      res.json({ success: true, message: "Team member updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/admin/team/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM team WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Team member deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });

  // ==========================================
  // ADMIN CRUD: CERTIFICATIONS
  // ==========================================
  app.post("/api/admin/certifications", async (req, res) => {
    const { code, title, body, icon, category } = req.body;
    if (!code || !title || !body) {
      return res.status(400).json({ error: "Code, title, and body are required" });
    }

    try {
      const result = await db.execute({
        sql: "INSERT INTO certifications (code, title, body, icon, category) VALUES (?, ?, ?, ?, ?)",
        args: [code, title, body, icon || "ShieldCheck", category || "Compliance"]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      res.status(500).json({ error: "Failed to add certification" });
    }
  });

  app.put("/api/admin/certifications/:id", async (req, res) => {
    const id = req.params.id;
    const { code, title, body, icon, category } = req.body;
    if (!code || !title || !body) {
      return res.status(400).json({ error: "Code, title, and body are required" });
    }

    try {
      await db.execute({
        sql: "UPDATE certifications SET code = ?, title = ?, body = ?, icon = ?, category = ? WHERE id = ?",
        args: [code, title, body, icon, category, id]
      });
      res.json({ success: true, message: "Certification updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update certification" });
    }
  });

  app.delete("/api/admin/certifications/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM certifications WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Certification deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete certification" });
    }
  });

  // ==========================================
  // ADMIN CRUD: TESTIMONIALS
  // ==========================================
  app.post("/api/admin/testimonials", async (req, res) => {
    const { name, role, company, quote, image, rating, vessel_type } = req.body;
    if (!name || !quote || !company) {
      return res.status(400).json({ error: "Name, company, and quote are required" });
    }

    try {
      const result = await db.execute({
        sql: "INSERT INTO testimonials (name, role, company, quote, image, rating, vessel_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [name, role || "Mariner", company, quote, image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400", rating || 5, vessel_type || "Commercial Fleet"]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      res.status(500).json({ error: "Failed to add testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", async (req, res) => {
    const id = req.params.id;
    const { name, role, company, quote, image, rating, vessel_type } = req.body;
    if (!name || !quote || !company) {
      return res.status(400).json({ error: "Name, company, and quote are required" });
    }

    try {
      await db.execute({
        sql: "UPDATE testimonials SET name = ?, role = ?, company = ?, quote = ?, image = ?, rating = ?, vessel_type = ? WHERE id = ?",
        args: [name, role, company, quote, image, rating || 5, vessel_type, id]
      });
      res.json({ success: true, message: "Testimonial updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM testimonials WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Testimonial deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // ==========================================
  // ADMIN CRUD: PARTNERS
  // ==========================================
  app.post("/api/admin/partners", async (req, res) => {
    const { name, logo } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Partner name is required" });
    }

    try {
      const result = await db.execute({
        sql: "INSERT INTO partners (name, logo) VALUES (?, ?)",
        args: [name, logo || "⚓"]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      res.status(500).json({ error: "Failed to add partner" });
    }
  });

  app.put("/api/admin/partners/:id", async (req, res) => {
    const id = req.params.id;
    const { name, logo } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Partner name is required" });
    }

    try {
      await db.execute({
        sql: "UPDATE partners SET name = ?, logo = ? WHERE id = ?",
        args: [name, logo || "⚓", id]
      });
      res.json({ success: true, message: "Partner updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update partner" });
    }
  });

  app.delete("/api/admin/partners/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM partners WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Partner deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete partner" });
    }
  });

  // ==========================================
  // ADMIN CRUD: BRANCHES
  // ==========================================
  app.post("/api/admin/branches", async (req, res) => {
    const { name, location, contact_number, email } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: "Branch name and location are required" });
    }
    try {
      const result = await db.execute({
        sql: "INSERT INTO branches (name, location, contact_number, email) VALUES (?, ?, ?, ?)",
        args: [name, location, contact_number || "", email || ""]
      });
      res.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
      res.status(500).json({ error: "Failed to create branch" });
    }
  });

  app.put("/api/admin/branches/:id", async (req, res) => {
    const id = req.params.id;
    const { name, location, contact_number, email } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: "Branch name and location are required" });
    }
    try {
      await db.execute({
        sql: "UPDATE branches SET name = ?, location = ?, contact_number = ?, email = ? WHERE id = ?",
        args: [name, location, contact_number || "", email || "", id]
      });
      res.json({ success: true, message: "Branch updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update branch" });
    }
  });

  app.delete("/api/admin/branches/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM branches WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Branch deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete branch" });
    }
  });

  // ==========================================
  // ADMIN CRUD: CONTACT SUBMISSIONS
  // ==========================================
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT * FROM contact_submissions ORDER BY created_at DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  app.put("/api/admin/contacts/:id", async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    try {
      await db.execute({
        sql: "UPDATE contact_submissions SET status = ? WHERE id = ?",
        args: [status, id]
      });
      res.json({ success: true, message: "Status updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.delete("/api/admin/contacts/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM contact_submissions WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Submission deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete submission" });
    }
  });

  // ==========================================
  // ADMIN CRUD: QUOTATION REQUESTS
  // ==========================================
  app.get("/api/admin/quotations", async (req, res) => {
    try {
      const { rows } = await db.execute("SELECT * FROM quotation_requests ORDER BY created_at DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch quotation requests" });
    }
  });

  app.put("/api/admin/quotations/:id", async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    try {
      await db.execute({
        sql: "UPDATE quotation_requests SET status = ? WHERE id = ?",
        args: [status, id]
      });
      res.json({ success: true, message: "Status updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.delete("/api/admin/quotations/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await db.execute({ sql: "DELETE FROM quotation_requests WHERE id = ?", args: [id] });
      res.json({ success: true, message: "Request deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete request" });
    }
  });

  // Reset database to initial seed data
  app.post("/api/admin/reset-data", async (req, res) => {
    try {
      await db.execute("DROP TABLE IF EXISTS services");
      await db.execute("DROP TABLE IF EXISTS packages");
      await db.execute("DROP TABLE IF EXISTS team");
      await db.execute("DROP TABLE IF EXISTS certifications");
      await db.execute("DROP TABLE IF EXISTS testimonials");
      await db.execute("DROP TABLE IF EXISTS partners");
      await db.execute("DROP TABLE IF EXISTS branches");
      await db.execute("DROP TABLE IF EXISTS contact_submissions");
      await db.execute("DROP TABLE IF EXISTS quotation_requests");
      await db.execute("DROP TABLE IF EXISTS admins");
      await initDB();
      res.json({ success: true, message: "Database reset to factory defaults successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to reset database" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

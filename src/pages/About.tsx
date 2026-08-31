import { useState, useEffect } from 'react';
import { Shield, Globe, Award, CheckCircle, ShieldCheck, FileCheck2, BadgeCheck, Anchor, Sparkles } from 'lucide-react';
import PartnerCarousel from '../components/PartnerCarousel';
import OrgChart from '../components/OrgChart';
import { CertificationItem } from '../types';

const CertIconMap: Record<string, any> = {
  Anchor,
  ShieldCheck,
  FileCheck2,
  BadgeCheck,
  Sparkles,
  Shield,
  Award
};

const DEFAULT_CERTS = [
  {
    code: "MLC 2006",
    title: "Maritime Labour Convention Title 3.2",
    body: "Full compliance with ILO standards for onboard accommodation, food catering, crew dietary wellness, and galley hygiene.",
    icon: 'Anchor',
    category: "Maritime Law"
  },
  {
    code: "HACCP",
    title: "Hazard Analysis Critical Control Point",
    body: "Systematic preventive approach to food safety biological, chemical, and physical hazards across our entire maritime supply chain.",
    icon: 'ShieldCheck',
    category: "Food Safety"
  },
  {
    code: "ISO 22000:2018",
    title: "Food Safety Management System",
    body: "Internationally audited standard demonstrating our capability to control food safety hazards from supplier port to offshore galley.",
    icon: 'FileCheck2',
    category: "Global Standards"
  },
  {
    code: "ISO 9001:2015",
    title: "Quality Management Accreditation",
    body: "Certified quality management across procurement, cold-chain storage logistics, and galley crew deployment workflows.",
    icon: 'BadgeCheck',
    category: "Operations"
  },
  {
    code: "HALAL ASSURED",
    title: "Certified Halal Supply & Segregation",
    body: "Dedicated Halal storage, handling, and prep protocols compliant with international Islamic dietary authorities for Muslim seafarers.",
    icon: 'Sparkles',
    category: "Dietary Standard"
  },
  {
    code: "BOSIET & OPITO",
    title: "Offshore Safety Training Certified",
    body: "All offshore galley staff and supervisors are fully certified in emergency response, sea survival, and helicopter safety.",
    icon: 'Shield',
    category: "Offshore Safety"
  }
];

export default function About() {
  const [certifications, setCertifications] = useState<CertificationItem[]>(DEFAULT_CERTS);

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCertifications(data);
        }
      })
      .catch(err => {
        console.error("Failed to load certifications", err);
      });
  }, []);

  return (
    <div className="pt-12 pb-24">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-5 mb-20 text-center">
        <span className="inline-block bg-[#07A5C9]/10 text-[#07A5C9] border border-[#07A5C9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6">Who We Are</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Pioneers in Maritime Catering</h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
          East Man Resource Sdn Bhd was founded with a singular vision: to revolutionize the standard of living and dining across the global maritime and offshore sectors.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 flex flex-col lg:flex-row items-center gap-16 mb-24">
        <div className="flex-1 w-full lg:w-1/2 relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(7,165,201,0.2)]">
            <img 
              src="https://images.unsplash.com/photo-1543360565-dcbac7e6403d?auto=format&fit=crop&q=80&w=1200" 
              alt="Professional Chef on Ship" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-[#00081E] p-4 rounded-2xl border border-white/10 hidden md:block">
            <div className="bg-[#07A5C9] p-8 rounded-xl text-center">
              <p className="text-5xl font-bold text-white mb-2">25+</p>
              <p className="text-sm font-bold text-white/90 uppercase tracking-wider">Years Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Delivering Comfort <br/>Across The Oceans</h2>
          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
            For over two decades, we have been the silent engine behind successful voyages. We understand that out at sea, food is more than sustenance—it is morale, health, and a reminder of home.
          </p>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Our expert teams manage complex supply chains to ensure fresh ingredients reach the most isolated offshore rigs, while our chefs craft diverse, culturally appropriate menus for multinational crews.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-[#07A5C9] shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Global Sourcing</h4>
                <p className="text-sm text-gray-400">Strategic procurement networks spanning key international ports.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-[#07A5C9] shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Certified Safety</h4>
                <p className="text-sm text-gray-400">Strict adherence to MLC 2006 and HACCP hygiene protocols.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-[#07A5C9] shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Tailored Menus</h4>
                <p className="text-sm text-gray-400">Dietary-specific and culturally diverse meal planning.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-[#07A5C9] shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">Expert Training</h4>
                <p className="text-sm text-gray-400">Continuous culinary and safety training for all galley personnel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-[1200px] mx-auto px-5 bg-white/5 rounded-3xl p-12 border border-white/10 mb-24">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold">Our Core Values</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#07A5C9] to-[#066F8B] flex items-center justify-center mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-4">Integrity & Safety</h4>
            <p className="text-gray-400 text-sm leading-relaxed">We compromise on nothing when it comes to the safety of our food and the well-being of the crews we serve.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#07A5C9] to-[#066F8B] flex items-center justify-center mb-6 shadow-lg">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-4">Global Resilience</h4>
            <p className="text-gray-400 text-sm leading-relaxed">Our supply chains and personnel are adaptable, ensuring consistent quality regardless of remote locations or harsh conditions.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#07A5C9] to-[#066F8B] flex items-center justify-center mb-6 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-4">Culinary Excellence</h4>
            <p className="text-gray-400 text-sm leading-relaxed">We believe every meal matters. We strive for restaurant-quality dining experiences, even in the middle of the ocean.</p>
          </div>
        </div>
      </div>

      {/* Qualifications & Certifications Section */}
      <div className="max-w-[1200px] mx-auto px-5 mb-24">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#07A5C9]/10 text-[#07A5C9] border border-[#07A5C9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
            Compliance & Standards
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Qualifications & Certifications</h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
            Our operations adhere to the most stringent international maritime, food safety, and offshore workplace accreditations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => {
            const IconComponent = typeof cert.icon === 'string' ? (CertIconMap[cert.icon] || ShieldCheck) : (cert.icon || ShieldCheck);
            return (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#07A5C9]/50 hover:bg-white/[0.08] transition-all duration-300 group flex flex-col justify-between shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#07A5C9]/5 rounded-bl-full pointer-events-none group-hover:bg-[#07A5C9]/15 transition-colors"></div>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#07A5C9]/10 flex items-center justify-center group-hover:bg-[#07A5C9] transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-[#07A5C9] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#07A5C9] bg-[#07A5C9]/10 px-3 py-1 rounded-full border border-[#07A5C9]/20">
                      {cert.code}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#07A5C9] transition-colors">{cert.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{cert.body}</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                  <span>Category: <strong className="text-gray-300">{cert.category}</strong></span>
                  <span className="text-[#07A5C9] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OrgChart />
      
      <PartnerCarousel />
    </div>
  );
}

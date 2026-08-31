import { useEffect, useState } from 'react';
import { Utensils, Ship, Users, Truck, Anchor, Award, ShieldCheck, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceItem, TestimonialItem } from '../types';

const IconMap: Record<string, any> = {
  Utensils,
  Ship,
  Users,
  Truck,
  Anchor,
  Award,
  ShieldCheck,
  HeartPulse
};

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(r => r.json()),
      fetch('/api/testimonials').then(r => r.json())
    ])
      .then(([servicesData, testimonialsData]) => {
        if (Array.isArray(servicesData)) setServices(servicesData);
        if (Array.isArray(testimonialsData)) setTestimonials(testimonialsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load services or testimonials", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-12 pb-24">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-5 mb-20 text-center">
        <span className="inline-block bg-[#07A5C9]/10 text-[#07A5C9] border border-[#07A5C9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6">Our Services</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Comprehensive Solutions</h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
          From luxury dining to robust crew nutrition, East Man Resource delivers unmatched catering and logistics support to fleets worldwide.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto px-5">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07A5C9]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const IconComponent = IconMap[service.icon] || Award;
              return (
                <Link to={`/services/${service.slug}`} key={i} className="block no-underline">
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(7,165,201,0.15)] flex flex-col h-full cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-[#07A5C9]/10 flex items-center justify-center mb-6 group-hover:bg-[#07A5C9] transition-colors duration-300">
                      <IconComponent className="w-7 h-7 text-[#07A5C9] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#07A5C9] transition-colors">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed flex-1">{service.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="max-w-[1200px] mx-auto px-5 mt-28">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#07A5C9]/10 text-[#07A5C9] border border-[#07A5C9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
            Client Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Trusted Across the Seven Seas</h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
            Hear from fleet managers, captains, and offshore superintendents who rely on our catering and provisioning operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(testimonials.length > 0 ? testimonials : [
            {
              quote: "East Man Resource transformed our crew's morale during a 45-day trans-Pacific voyage. The nutritional balance and diversity of meals kept everyone healthy, energized, and satisfied.",
              name: "Capt. Henrik Visser",
              role: "Master Mariner",
              company: "Nordic Bulk Carrier Line",
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
              rating: 5,
              vessel_type: "Merchant Cargo"
            },
            {
              quote: "The culinary standards for our private charter were nothing short of world-class. From bespoke dietary accommodations to presentation, every meal exceeded our high-profile guests' expectations.",
              name: "Claire Beaumont",
              role: "Chief Stewardess",
              company: "Aura Luxury Charters (Monaco)",
              image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
              rating: 5,
              vessel_type: "Superyacht"
            },
            {
              quote: "Operating on an offshore platform requires strict safety compliance and reliable 24/7 galley service. East Man delivers flawless logistics, HACCP standards, and great food without fail.",
              name: "Tariq Al-Mansoor",
              role: "Logistics Superintendent",
              company: "Apex Deepwater Platforms",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
              rating: 5,
              vessel_type: "Offshore Rig"
            }
          ]).map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-[#07A5C9]/40 hover:bg-white/[0.07] transition-all duration-300 shadow-lg group relative"
            >
              <div className="absolute top-6 right-6 text-4xl text-[#07A5C9]/20 font-serif leading-none select-none group-hover:text-[#07A5C9]/40 transition-colors">
                “
              </div>
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating || 5)].map((_, r) => (
                    <span key={r} className="text-[#07A5C9] text-base">★</span>
                  ))}
                  <span className="text-xs font-semibold text-gray-400 ml-2 bg-[#07A5C9]/10 px-2.5 py-0.5 rounded-full border border-[#07A5C9]/20">
                    {t.vessel_type}
                  </span>
                </div>
                <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-8 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full object-cover border border-[#07A5C9]/30"
                />
                <div>
                  <h4 className="text-white font-bold text-sm group-hover:text-[#07A5C9] transition-colors">{t.name}</h4>
                  <p className="text-gray-400 text-xs">{t.role} • <span className="text-[#07A5C9]">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[1200px] mx-auto px-5 mt-24">
        <div className="bg-gradient-to-r from-[#07A5C9] to-[#066F8B] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-[0_0_50px_rgba(7,165,201,0.3)]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544377192-339241c6d868?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center pointer-events-none"></div>
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Require a Custom Solution?</h2>
            <p className="text-white/90 text-lg">Every vessel has unique needs. Contact our logistics specialists for a tailored provisioning and management plan.</p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link 
              to="/book" 
              className="bg-white text-[#00081E] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 shadow-xl inline-block"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

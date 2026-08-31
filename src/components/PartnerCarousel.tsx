import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PartnerItem } from '../types';

const DEFAULT_PARTNERS: PartnerItem[] = [
  { name: "Oceanic Lines", logo: "🌊" },
  { name: "Global Freight Co.", logo: "🚢" },
  { name: "SeaWays Logistics", logo: "⚓" },
  { name: "Marina Holdings", logo: "🛥️" },
  { name: "Equator Shipping", logo: "🧭" },
  { name: "Nordic Marine", logo: "❄️" },
  { name: "Pacific Charters", logo: "🌴" },
  { name: "Atlantic Supply", logo: "📦" },
];

export default function PartnerCarousel() {
  const [partnerList, setPartnerList] = useState<PartnerItem[]>(DEFAULT_PARTNERS);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPartnerList(data);
        }
      })
      .catch(err => {
        console.error("Failed to load partner list", err);
      });
  }, []);

  // Duplicate the array to create a seamless infinite scroll loop
  const duplicatedPartners = [...partnerList, ...partnerList];

  return (
    <div className="py-16 bg-[#00081E] border-t border-white/5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 mb-10 text-center">
        <p className="text-sm font-bold text-[#07A5C9] uppercase tracking-widest">Trusted By Global Maritime Leaders</p>
      </div>
      
      <div className="relative w-full flex overflow-hidden">
        {/* Left and right fade gradients for smooth edge transition */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#00081E] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#00081E] to-transparent z-10 pointer-events-none"></div>

        <motion.div 
          className="flex gap-12 items-center whitespace-nowrap pl-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 30 
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div key={index} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer">
              <span className="text-3xl">{partner.logo}</span>
              <span className="text-xl font-bold text-white tracking-wide">{partner.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}


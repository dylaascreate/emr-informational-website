import { useState, useEffect } from 'react';
import { Clock, Ship, Utensils, Anchor, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import PartnerCarousel from '../components/PartnerCarousel';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1572097364417-6490ed4b2d10?auto=format&fit=crop&q=80&w=2000", // Cargo
  "https://images.unsplash.com/photo-1544377192-339241c6d868?auto=format&fit=crop&q=80&w=2000", // Yacht/Ocean
  "https://images.unsplash.com/photo-1588612543419-4a92c474d2eb?auto=format&fit=crop&q=80&w=2000", // Offshore/Rig
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center px-6 md:px-[5%] py-12 md:py-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00081E] via-[#00081E]/90 to-transparent z-10 pointer-events-none"></div>
        
        <div className="relative z-20 flex-1 max-w-2xl">
          <span className="inline-block bg-[#07A5C9]/20 text-[#07A5C9] border border-[#07A5C9]/30 px-4 py-1.5 rounded-full text-[12px] uppercase font-bold mb-6 tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(7,165,201,0.2)]">
            Maritime Catering & Logistics
          </span>
          <h1 className="text-5xl md:text-[72px] font-bold mb-6 leading-[1.05] tracking-tight">
            Fueling Voyages <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">With Excellence</span>
          </h1>
          <p className="max-w-[540px] text-gray-300 mb-10 text-lg leading-relaxed font-light">
            Providing world-class maritime catering, fresh provisions, and comprehensive crew management for offshore operations, cargo vessels, and luxury yachts globally.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/book" className="bg-[#07A5C9] text-white px-8 py-4 rounded font-bold hover:bg-[#066F8B] transition-all duration-300 shadow-[0_0_20px_rgba(7,165,201,0.3)] hover:shadow-[0_0_30px_rgba(7,165,201,0.5)] flex items-center gap-2">
              Book a Session <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/services" className="border border-white/20 text-white px-8 py-4 rounded hover:bg-white/10 transition-colors duration-300 font-bold backdrop-blur-sm">
              Discover Services
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 inline-flex px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            <Clock className="w-4 h-4 text-[#FFB800]" /> 
            <span className="font-medium">Operational 24/7 for Global Fleet Support</span>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 w-full md:w-3/5 h-full z-0 opacity-40 md:opacity-100 overflow-hidden" style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={HERO_IMAGES[currentImageIndex]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              alt="Maritime Excellence"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
      </section>

      <PartnerCarousel />

      {/* Stats Section */}
      <section className="py-24 text-center border-t border-white/5" style={{ background: 'radial-gradient(circle at center, rgba(6, 111, 139, 0.08) 0%, #00081E 70%)' }}>
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="max-w-[800px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">The Standard of Excellence at Sea</h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed">Where every meal becomes a revitalizing experience, every service exceeds expectations, and every voyage is powered by our unwavering commitment to quality and safety.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-white/5 to-transparent p-10 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-5xl md:text-6xl font-bold text-[#FFB800] mb-3 tracking-tighter">25<span className="text-3xl">+</span></h3>
              <p className="text-sm tracking-[0.2em] uppercase text-gray-400 font-bold">Years of Excellence</p>
            </div>
            <div className="bg-gradient-to-b from-white/5 to-transparent p-10 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#07A5C9] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tighter">500<span className="text-3xl text-[#07A5C9]">+</span></h3>
              <p className="text-sm tracking-[0.2em] uppercase text-gray-400 font-bold">Vessels Served</p>
            </div>
            <div className="bg-gradient-to-b from-white/5 to-transparent p-10 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-5xl md:text-6xl font-bold text-[#FFB800] mb-3 tracking-tighter">100<span className="text-3xl">%</span></h3>
              <p className="text-sm tracking-[0.2em] uppercase text-gray-400 font-bold">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Teaser */}
      <section className="py-24 bg-gradient-to-b from-[#00081E] to-[#010c29] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-[600px]">
              <span className="text-[#07A5C9] font-bold tracking-widest uppercase text-sm mb-3 block">What We Do</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Comprehensive Maritime Solutions</h2>
            </div>
            <Link to="/services" className="text-white border-b border-[#07A5C9] pb-1 hover:text-[#07A5C9] transition-colors flex items-center gap-2 font-medium">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square">
              <img src="https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800" alt="Catering" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00081E] via-[#00081E]/40 to-transparent p-8 flex flex-col justify-end">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-4 shrink-0 border border-white/10">
                  <Utensils className="w-6 h-6 text-[#07A5C9]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Maritime Catering</h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">Nutritional meal planning and world-class chefs for long-haul crews and luxury yachts.</p>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square">
              <img src="https://images.unsplash.com/photo-1588612543419-4a92c474d2eb?auto=format&fit=crop&q=80&w=800" alt="Supply Chain" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00081E] via-[#00081E]/40 to-transparent p-8 flex flex-col justify-end">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-4 shrink-0 border border-white/10">
                  <Ship className="w-6 h-6 text-[#07A5C9]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Provisions & Logistics</h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">Efficient sourcing and reliable delivery of fresh, high-quality supplies to remote maritime locations.</p>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square">
              <img src="https://images.unsplash.com/photo-1544377192-339241c6d868?auto=format&fit=crop&q=80&w=800" alt="Offshore" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00081E] via-[#00081E]/40 to-transparent p-8 flex flex-col justify-end">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-4 shrink-0 border border-white/10">
                  <Anchor className="w-6 h-6 text-[#07A5C9]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Offshore Support</h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">Specialized galley management and catering solutions tailored for offshore oil rigs and platforms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

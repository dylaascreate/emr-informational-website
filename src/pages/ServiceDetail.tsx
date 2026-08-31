import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, Utensils, Ship, Users, Truck, Anchor, ShieldCheck, HeartPulse } from 'lucide-react';
import { ServiceItem } from '../types';

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

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch service detail", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-24 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07A5C9]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-24 pb-24 text-center min-h-[50vh]">
        <h1 className="text-3xl font-bold mb-4">Service not found</h1>
        <Link to="/services" className="text-[#07A5C9] hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>
    );
  }

  const IconComponent = IconMap[service.icon] || Award;

  return (
    <div className="pt-8 pb-24">
      <div className="max-w-[1000px] mx-auto px-5 mb-10">
        <Link to="/services" className="text-gray-400 hover:text-[#07A5C9] transition-colors flex items-center gap-2 mb-8 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <div className="w-16 h-16 rounded-full bg-[#07A5C9]/10 flex items-center justify-center mb-6">
            <IconComponent className="w-8 h-8 text-[#07A5C9]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{service.title}</h1>
          <p className="text-xl text-[#07A5C9] mb-8 font-light leading-relaxed">{service.description}</p>
          <Link to="/book" className="bg-[#07A5C9] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#066F8B] transition-all duration-300 shadow-[0_0_20px_rgba(7,165,201,0.3)] inline-block">
            Request Quote
          </Link>
        </div>
        
        {service.image && (
          <div className="rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(7,165,201,0.15)] aspect-square md:aspect-[4/3]">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="max-w-[800px] mx-auto px-5 mb-16">
        <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-p:leading-relaxed whitespace-pre-wrap">
            {service.content}
          </div>
        </div>
      </div>

      {/* Menus & Packages Section */}
      {service.packages && service.packages.length > 0 && (
        <div className="max-w-[1000px] mx-auto px-5 pt-8 border-t border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Available Menus & Packages</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our curated selections tailored specifically for this service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.packages.map(pkg => (
              <div key={pkg.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg group flex flex-col h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white z-10">{pkg.name}</h3>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-1">{pkg.description}</p>
                  <Link 
                    to={`/book?service=${service.slug}&package=${encodeURIComponent(pkg.name)}`} 
                    className="block w-full text-center bg-transparent border border-[#07A5C9] text-[#07A5C9] hover:bg-[#07A5C9] hover:text-white px-4 py-2.5 rounded-full font-bold transition-colors"
                  >
                    Select Package
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

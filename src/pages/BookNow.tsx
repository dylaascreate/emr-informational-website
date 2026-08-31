import { useState, FormEvent } from 'react';
import { Ship, Calendar, Map, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function BookNow() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedPackage = searchParams.get('package');
  const selectedService = searchParams.get('service');

  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    vesselType: selectedService === 'yacht-catering' ? 'yacht' : 
                selectedService === 'cargo-merchant-vessels' ? 'cargo' : 
                selectedService === 'offshore-platform' ? 'offshore' : '',
    crewSize: '',
    location: '',
    startDate: '',
    details: '',
    services: {
      catering: false,
      provisions: false,
      crew: false,
      hygiene: false
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredServices = Object.entries(formData.services)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key)
      .join(', ');

    const payload = {
      name: formData.contactName,
      email: formData.email,
      company: formData.company,
      vessel_type: formData.vesselType,
      service_required: requiredServices || 'Not specified',
      details: `Phone: ${formData.phone}\nLocation: ${formData.location}\nCrew Size: ${formData.crewSize}\nStart Date: ${formData.startDate}\n\nNotes:\n${formData.details}`
    };

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-12 pb-24">
      {/* Header */}
      <div className="max-w-[800px] mx-auto px-5 mb-16 text-center">
        <span className="inline-block bg-[#07A5C9]/10 text-[#07A5C9] border border-[#07A5C9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6">Service Request</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Book a Session or Request a Quote</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Provide us with details about your vessel, crew size, and operational requirements. Our logistics team will review your query and draft a tailored catering plan.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto px-5">
        {selectedPackage && !submitted && (
          <div className="mb-8 p-6 bg-[#07A5C9]/10 border border-[#07A5C9]/30 rounded-2xl flex items-center justify-between">
            <div>
               <p className="text-sm text-[#07A5C9] font-bold uppercase tracking-wider mb-2">Selected Package</p>
               <p className="text-white font-bold text-xl">{selectedPackage}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#07A5C9]/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#07A5C9]" />
            </div>
          </div>
        )}

        {submitted ? (
          <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center backdrop-blur-sm shadow-[0_0_50px_rgba(7,165,201,0.1)]">
            <div className="w-24 h-24 bg-[#07A5C9]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#07A5C9]" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Request Successfully Submitted</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Our maritime logistics team has received your details. We will contact you within 24 hours with a tailored consultation.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="border border-[#07A5C9] text-[#07A5C9] px-8 py-3 rounded-full font-bold hover:bg-[#07A5C9] hover:text-white transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm space-y-8">
            
            {/* Step 1: Company Details */}
            <div>
              <h3 className="text-xl font-bold text-[#FFB800] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FFB800]/20 flex items-center justify-center text-sm">1</span> 
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Company Name *</label>
                  <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} type="text" className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="e.g. OceanLine Corp" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Contact Person *</label>
                  <input required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} type="text" className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Email Address *</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="email@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Phone Number *</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 my-8"></div>

            {/* Step 2: Vessel & Operational Details */}
            <div>
              <h3 className="text-xl font-bold text-[#07A5C9] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#07A5C9]/20 flex items-center justify-center text-sm">2</span> 
                Vessel & Operational Needs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <Ship className="w-4 h-4 text-gray-500" /> Vessel Type
                  </label>
                  <select 
                    required 
                    value={formData.vesselType}
                    onChange={e => setFormData({...formData, vesselType: e.target.value})}
                    className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select vessel type...</option>
                    <option value="cargo">Cargo / Merchant Vessel</option>
                    <option value="yacht">Luxury Yacht</option>
                    <option value="offshore">Offshore Rig / Platform</option>
                    <option value="passenger">Passenger Ship</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Estimated Crew Size</label>
                  <input required type="number" min="1" value={formData.crewSize} onChange={e => setFormData({...formData, crewSize: e.target.value})} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="e.g. 25" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <Map className="w-4 h-4 text-gray-500" /> Port of Operation / Location
                  </label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="e.g. Port of Singapore" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" /> Estimated Start Date
                  </label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 my-8"></div>

            {/* Step 3: Service Selection */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">3</span> 
                Services Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" checked={formData.services.catering} onChange={e => setFormData({...formData, services: {...formData.services, catering: e.target.checked}})} className="w-5 h-5 accent-[#07A5C9] rounded" />
                  <span className="font-medium text-sm">Full Catering Management</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" checked={formData.services.provisions} onChange={e => setFormData({...formData, services: {...formData.services, provisions: e.target.checked}})} className="w-5 h-5 accent-[#07A5C9] rounded" />
                  <span className="font-medium text-sm">Provisions & Supply Chain</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" checked={formData.services.crew} onChange={e => setFormData({...formData, services: {...formData.services, crew: e.target.checked}})} className="w-5 h-5 accent-[#07A5C9] rounded" />
                  <span className="font-medium text-sm">Galley Crew Recruitment</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" checked={formData.services.hygiene} onChange={e => setFormData({...formData, services: {...formData.services, hygiene: e.target.checked}})} className="w-5 h-5 accent-[#07A5C9] rounded" />
                  <span className="font-medium text-sm">Hygiene & Safety Audit</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Additional Details or Specific Requirements</label>
                <textarea rows={4} value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors resize-none" placeholder="Tell us more about dietary constraints, voyage duration, or specialized requests..."></textarea>
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-r from-[#07A5C9] to-[#066F8B] text-white font-bold py-4 rounded-lg hover:shadow-[0_0_20px_rgba(7,165,201,0.4)] transition-all duration-300 text-lg mt-8 disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}

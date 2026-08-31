import { useState, useEffect, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Building2 } from 'lucide-react';
import { BranchItem } from '../types';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/branches')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBranches(data);
        }
      })
      .catch(err => console.error("Failed to load branches:", err));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          subject,
          message
        })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setTimeout(() => setSubmitted(false), 5000);
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
      <div className="max-w-[1200px] mx-auto px-5 mb-20 text-center">
        <span className="inline-block bg-[#07A5C9]/10 text-[#07A5C9] border border-[#07A5C9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6">Get In Touch</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Contact Our Team</h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
          Have a general inquiry or need support? Reach out to our offices and our maritime specialists will assist you promptly.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Our Branches</h2>
          
          <div className="space-y-10">
            {branches.length > 0 ? branches.map((branch) => (
              <div key={branch.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#07A5C9]/5 rounded-bl-full pointer-events-none" />
                <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#07A5C9]" /> {branch.name}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{branch.location}</p>
                    </div>
                  </div>
                  
                  {branch.contact_number && (
                    <div className="flex items-start gap-4">
                      <Phone className="w-5 h-5 text-gray-500 shrink-0 mt-1" />
                      <p className="text-gray-300 text-sm">{branch.contact_number}</p>
                    </div>
                  )}
                  
                  {branch.email && (
                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 text-gray-500 shrink-0 mt-1" />
                      <p className="text-gray-300 text-sm">{branch.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-gray-500 italic">No branch information available.</div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm h-fit">
          <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
          <p className="text-gray-400 mb-8 text-sm">For service quotes, please use our <a href="/book" className="text-[#07A5C9] hover:underline">Book a Session</a> page.</p>

          {submitted ? (
            <div className="bg-[#07A5C9]/20 border border-[#07A5C9] p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-[#07A5C9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <p className="text-gray-300">Thank you for reaching out. Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">First Name</label>
                  <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Last Name</label>
                  <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="john@company.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Subject</label>
                <input required type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors" placeholder="How can we help?" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Message</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full bg-[#00081E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#07A5C9] transition-colors resize-none" placeholder="Enter your message here..."></textarea>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#07A5C9] text-white font-bold py-4 rounded-lg hover:bg-[#066F8B] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

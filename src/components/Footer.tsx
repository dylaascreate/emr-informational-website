import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pt-[80px] pb-[30px] border-t border-white/10 bg-[#00081E]/50 mt-auto">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-[40px] mb-[50px]">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src="/emr-logo-1.png" alt="East Man Resource" className="h-8 w-auto" />
              <h4 className="text-xl font-bold text-white">East Man Resource Sdn Bhd</h4>
            </div>
            <p className="text-[#b0b0b0] mb-5 leading-relaxed text-sm pr-4">Leading maritime catering services provider with over 25 years of experience serving vessels worldwide with unmatched culinary excellence.</p>
            <div className="flex gap-[15px] mt-5">
              <a href="#" className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#07A5C9] transition-colors duration-300"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#07A5C9] transition-colors duration-300"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-[40px] h-[40px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#07A5C9] transition-colors duration-300"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h5 className="text-[#FFB800] font-bold mb-5 uppercase tracking-wider text-sm">Services</h5>
            <ul className="space-y-[12px] m-0 p-0 list-none">
              <li><Link to="/services" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">Yacht Catering</Link></li>
              <li><Link to="/services" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">Cargo Ship Services</Link></li>
              <li><Link to="/services" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">Crew Management</Link></li>
              <li><Link to="/services" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">Supply Chain</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h5 className="text-[#FFB800] font-bold mb-5 uppercase tracking-wider text-sm">Company</h5>
            <ul className="space-y-[12px] m-0 p-0 list-none">
              <li><Link to="/about" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">About Us</Link></li>
              <li><Link to="/about" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">Our History</Link></li>
              <li><Link to="/contact" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">Contact</Link></li>
              <li><Link to="/book" className="text-[#b0b0b0] text-sm no-underline hover:text-[#07A5C9] transition-colors">Book Session</Link></li>
              <li><Link to="/admin/login" className="text-[#07A5C9] text-sm no-underline hover:underline font-semibold flex items-center gap-1">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-[#FFB800] font-bold mb-5 uppercase tracking-wider text-sm">Contact Info</h5>
            <div className="space-y-[15px] text-[#b0b0b0] text-[14px] leading-relaxed">
              <p className="flex items-start gap-3 m-0">
                <MapPin className="w-5 h-5 text-[#07A5C9] shrink-0 mt-0.5" />
                <span>HQ - Sabah Office<br/>Block A, Level 10, Office Unit A-10-13B, Sutera Avenue, Lorong Lebuh Sutera, Kota Kinabalu, Sabah</span>
              </p>
              <p className="flex items-center gap-3 m-0">
                <Phone className="w-5 h-5 text-[#07A5C9] shrink-0" />
                <span>+608-8251 854</span>
              </p>
              <p className="flex items-center gap-3 m-0">
                <Mail className="w-5 h-5 text-[#07A5C9] shrink-0" />
                <span>support@emr.net.my</span>
              </p>
            </div>
          </div>

        </div>
        <div className="text-center text-[#b0b0b0] text-sm pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} East Man Resource Sdn Bhd. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

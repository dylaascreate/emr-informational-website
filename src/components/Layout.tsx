import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import CursorGlow from './CursorGlow';

export default function Layout() {
  return (
    <div className="bg-[#00081E] text-white min-h-screen font-sans flex flex-col selection:bg-[#07A5C9] selection:text-white relative overflow-x-hidden">
      <CursorGlow />
      <Navbar />
      <main className="flex-1 flex flex-col pt-[72px] relative z-10">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}


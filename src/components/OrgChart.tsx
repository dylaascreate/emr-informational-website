import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TeamMember } from '../types';

const DEFAULT_ORG_DATA: TeamMember[] = [
  { 
    id: 1, 
    member_id: 'ceo',
    level: 1,
    role: 'Chief Executive Officer', 
    name: 'Jonathan Sterling', 
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', 
    bio: 'Jonathan brings over 30 years of maritime logistics and hospitality experience. He founded East Man Resource with a vision to elevate offshore living standards globally.' 
  },
  { 
    id: 2, 
    member_id: 'coo',
    level: 2,
    role: 'Chief Operating Officer', 
    name: 'Sarah Chen', 
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', 
    bio: 'Sarah oversees global supply chain operations, ensuring that provisions reach remote vessels safely and on time, maintaining strict HACCP compliance across all hubs.' 
  },
  { 
    id: 3, 
    member_id: 'cfo',
    level: 2,
    role: 'Chief Financial Officer', 
    name: 'Marcus Thorne', 
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', 
    bio: 'Marcus directs financial strategy and international procurement budgets, forging strong partnerships with global food suppliers to ensure premium quality at scale.' 
  },
  { 
    id: 4, 
    member_id: 'vp_culinary',
    level: 3,
    role: 'VP of Culinary Excellence', 
    name: 'Elena Rossi', 
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800', 
    bio: 'Elena is a former Michelin-star chef who now designs tailored menus for multinational crews, focusing on nutrition, morale, and cultural authenticity.' 
  },
  { 
    id: 5, 
    member_id: 'vp_hr',
    level: 3,
    role: 'Head of Crew Management', 
    name: 'David Okafor', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', 
    bio: 'David manages the recruitment, training, and deployment of over 500 galley personnel, ensuring all staff meet MLC 2006 and maritime safety standards.' 
  },
];

export default function OrgChart() {
  const [teamData, setTeamData] = useState<TeamMember[]>(DEFAULT_ORG_DATA);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTeamData(data);
        }
      })
      .catch(err => {
        console.error("Failed to load team data", err);
      });
  }, []);

  const selectedPerson = teamData.find(p => p.id === selectedPersonId);

  const renderNode = (person: TeamMember) => {
    const isSelected = selectedPersonId === person.id;
    return (
      <div 
        key={person.id}
        onClick={() => setSelectedPersonId(person.id!)}
        className={`relative z-10 cursor-pointer group flex flex-col items-center justify-center p-6 w-[240px] rounded-2xl border transition-all duration-300 backdrop-blur-sm
          ${isSelected 
            ? 'bg-[#07A5C9]/20 border-[#07A5C9] shadow-[0_0_30px_rgba(7,165,201,0.3)]' 
            : 'bg-[#00081E] border-white/10 hover:border-[#07A5C9]/50 hover:bg-white/5'
          }
        `}
      >
        <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#07A5C9] transition-colors">
          <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
        </div>
        <h4 className="text-white font-bold text-lg text-center leading-tight mb-1">{person.name}</h4>
        <p className="text-[#07A5C9] text-sm text-center font-medium">{person.role}</p>
      </div>
    );
  };

  const level1 = teamData.filter(p => p.level === 1);
  const level2 = teamData.filter(p => p.level === 2);
  const level3 = teamData.filter(p => p.level >= 3);

  return (
    <div className="py-24 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-5 mb-16 text-center">
        <span className="inline-block bg-[#07A5C9]/10 text-[#07A5C9] border border-[#07A5C9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4">Leadership</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Organization</h2>
      </div>

      <div className="max-w-[1000px] mx-auto px-5 relative">

        <div className="flex flex-col gap-10 md:gap-16 items-center">
          {/* Level 1 */}
          <div className="flex justify-center w-full relative">
            {level1.map(renderNode)}
            <div className="absolute -bottom-10 left-1/2 w-px h-10 bg-[#07A5C9]/30 -translate-x-1/2 hidden md:block"></div>
          </div>

          {/* Level 2 */}
          <div className="flex flex-col md:flex-row justify-center md:justify-between w-full md:w-3/4 gap-10 relative">
             <div className="absolute -top-10 left-[15%] right-[15%] h-px bg-[#07A5C9]/30 hidden md:block"></div>
             <div className="absolute -top-10 left-[15%] w-px h-10 bg-[#07A5C9]/30 hidden md:block"></div>
             <div className="absolute -top-10 right-[15%] w-px h-10 bg-[#07A5C9]/30 hidden md:block"></div>
            {level2.map(renderNode)}
          </div>

          {/* Level 3 */}
          <div className="flex flex-col md:flex-row justify-center w-full gap-10">
            {level3.map(renderNode)}
          </div>
        </div>

        {/* Selected Person Details Section (No Popup) */}
        <div className="mt-16 min-h-[200px]">
          <AnimatePresence mode="wait">
            {selectedPerson ? (
              <motion.div
                key={selectedPerson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-[#07A5C9]/30 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-[0_0_40px_rgba(7,165,201,0.1)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-[#07A5C9]"></div>
                
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-xl">
                  <img src={selectedPerson.image} alt={selectedPerson.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-2 text-white">{selectedPerson.name}</h3>
                  <p className="text-xl text-[#07A5C9] font-medium mb-6">{selectedPerson.role}</p>
                  <p className="text-gray-300 text-lg leading-relaxed">{selectedPerson.bio}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-[200px] border border-dashed border-white/20 rounded-3xl bg-white/5"
              >
                <p className="text-gray-400 font-medium">Select a team member above to view their details.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const mouseX = useSpring(-500, springConfig);
  const mouseY = useSpring(-500, springConfig);

  useEffect(() => {
    setMounted(true);
    // Check if device supports fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsPointerDevice(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isHovering) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isHovering]);

  if (!mounted || !isPointerDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Primary fuzzy glowing core */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isHovering ? 0.65 : 0,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.4 }}
        className="absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,_rgba(7,165,201,0.22)_0%,_rgba(6,111,139,0.12)_40%,_transparent_70%)] blur-[80px] will-change-transform"
      />

      {/* Secondary subtle ambient outer glow */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isHovering ? 0.4 : 0,
        }}
        transition={{ duration: 0.6 }}
        className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,_rgba(7,165,201,0.1)_0%,_transparent_65%)] blur-[120px] will-change-transform"
      />
    </div>
  );
}

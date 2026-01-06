"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { coreValueIconMap, serviceIconMap, iconIdMap } from "./components/LandingIcons";

// Enhanced Particle Component with Click Effect
const Particle = ({ 
  delay, 
  duration, 
  size, 
  left, 
  color, 
  type,
  top,
  onClick
}: { 
  delay: number; 
  duration: number; 
  size: number; 
  left: number; 
  color: string; 
  type: string;
  top?: number;
  onClick?: () => void;
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [burstParticles, setBurstParticles] = useState<Array<{
    id: number;
    angle: number;
    distance: number;
  }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    
    // Create burst effect with multiple particles
    const burstCount = 12;
    const newBurstParticles = Array.from({ length: burstCount }, (_, i) => ({
      id: i,
      angle: (360 / burstCount) * i,
      distance: 50 + Math.random() * 30,
    }));
    setBurstParticles(newBurstParticles);
    
    // Reset after animation
    setTimeout(() => {
      setIsClicked(false);
      setBurstParticles([]);
    }, 600);
    
    if (onClick) onClick();
  };

  const particleTypes = {
    node: (
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 ${size * 4}px ${color}, 0 0 ${size * 8}px ${color}`,
            animation: isClicked ? 'none' : 'pulse-glow 2s ease-in-out infinite',
            transform: isClicked ? 'scale(1.5)' : 'scale(1)',
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>
    ),
    line: (
      <div 
        className="absolute"
        style={{
          width: `${size * 3}px`,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          borderRadius: '2px',
          transform: isClicked ? 'scale(1.5)' : 'scale(1)',
          transition: 'transform 0.2s ease-out',
        }}
      />
    ),
    circuit: (
      <svg width={size * 4} height={size * 4} className="absolute" style={{ filter: `drop-shadow(0 0 ${size}px ${color})`, transform: isClicked ? 'scale(1.5)' : 'scale(1)', transition: 'transform 0.2s ease-out' }}>
        <line
          x1="0"
          y1={size * 2}
          x2={size * 4}
          y2={size * 2}
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
        />
        <line
          x1={size * 2}
          y1="0"
          x2={size * 2}
          y2={size * 4}
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
        />
        <circle
          cx={size * 2}
          cy={size * 2}
          r={size * 0.5}
          fill={color}
          opacity="0.9"
        />
      </svg>
    ),
    data: (
      <div className="relative" style={{ width: `${size * 2.5}px`, height: `${size * 2.5}px`, transform: isClicked ? 'scale(1.5)' : 'scale(1)', transition: 'transform 0.2s ease-out' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              width: `${size * (0.4 + i * 0.25)}px`,
              height: `${size * (0.4 + i * 0.25)}px`,
              border: `2px solid ${color}`,
              top: `${i * size * 0.35}px`,
              left: `${i * size * 0.35}px`,
              opacity: 0.7 - i * 0.2,
              boxShadow: `0 0 ${size}px ${color}`,
            }}
          />
        ))}
      </div>
    ),
    sparkle: (
      <div className="relative" style={{ width: `${size * 2}px`, height: `${size * 2}px` }}>
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 3}px ${color}`,
            animation: isClicked ? 'none' : 'sparkle 1.5s ease-in-out infinite',
            transform: isClicked ? 'scale(2)' : 'scale(1)',
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>
    ),
    dot: (
      <div 
        className="absolute rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: color,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          transform: isClicked ? 'scale(1.5)' : 'scale(1)',
          transition: 'transform 0.2s ease-out',
        }}
      />
    ),
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${left}%`,
        top: top !== undefined ? `${top}%` : 'auto',
        animation: isClicked ? 'none' : `particleFloat ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: isClicked ? 0 : 0.6,
        willChange: 'transform, opacity',
        transition: 'opacity 0.3s ease-out',
        zIndex: isClicked ? 10 : 1,
      }}
      onClick={handleClick}
    >
      {particleTypes[type as keyof typeof particleTypes] || particleTypes.dot}
      
      {/* Burst effect particles */}
      {isClicked && burstParticles.map((burst, index) => {
        const angleRad = (burst.angle * Math.PI) / 180;
        const endX = Math.cos(angleRad) * burst.distance;
        const endY = Math.sin(angleRad) * burst.distance;
        
        return (
          <div
            key={burst.id}
            className="absolute rounded-full particle-burst"
            style={{
              width: `${size * 0.6}px`,
              height: `${size * 0.6}px`,
              background: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(0, 0)`,
              animation: `particleBurst${index} 0.6s ease-out forwards`,
            }}
          />
        );
      })}
      
      {/* Inject dynamic keyframes for burst animation */}
      {isClicked && (
        <style>
          {burstParticles.map((burst, index) => {
            const angleRad = (burst.angle * Math.PI) / 180;
            const endX = Math.cos(angleRad) * burst.distance;
            const endY = Math.sin(angleRad) * burst.distance;
            return `
              @keyframes particleBurst${index} {
                0% {
                  opacity: 1;
                  transform: translate(-50%, -50%) translate(0, 0) scale(1);
                }
                100% {
                  opacity: 0;
                  transform: translate(-50%, -50%) translate(${endX}px, ${endY}px) scale(0);
                }
              }
            `;
          }).join('')}
        </style>
      )}
      
      {/* Ripple effect */}
      {isClicked && (
        <div
          className="absolute rounded-full"
          style={{
            width: `${size * 2}px`,
            height: `${size * 2}px`,
            border: `2px solid ${color}`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out forwards',
            boxShadow: `0 0 ${size * 4}px ${color}`,
          }}
        />
      )}
    </div>
  );
};

const ParticleField = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    delay: number;
    duration: number;
    size: number;
    left: number;
    top: number;
    color: string;
    type: string;
  }>>([]);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const colors = [
      'rgba(147, 51, 234, 0.8)', // purple - brighter
      'rgba(59, 130, 246, 0.8)', // blue - brighter
      'rgba(236, 72, 153, 0.8)', // pink - brighter
      'rgba(34, 211, 238, 0.8)', // cyan - brighter
      'rgba(168, 85, 247, 0.8)', // violet - brighter
      'rgba(139, 92, 246, 0.8)', // indigo
      'rgba(236, 72, 153, 0.8)', // rose
    ];

    const types = ['node', 'line', 'circuit', 'data', 'sparkle', 'dot'];

    // Create more particles with varied properties
    const generatedParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: Math.random() * 20 + 20, // Slower, more graceful
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
    }));

    setParticles(generatedParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
          left={particle.left}
          top={particle.top}
          color={particle.color}
          type={particle.type}
        />
      ))}
    </div>
  );
};

// Hero Particle Component - particles move toward center
const HeroParticle = ({ 
  delay, 
  duration, 
  size, 
  startX, 
  startY, 
  color, 
  type 
}: { 
  delay: number; 
  duration: number; 
  size: number; 
  startX: number; 
  startY: number; 
  color: string; 
  type: string;
}) => {
  const particleTypes = {
    dot: (
      <div 
        className="absolute rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: color,
          boxShadow: `0 0 ${size * 2}px ${color}`,
        }}
      />
    ),
    star: (
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 3}px ${color}`,
          }}
        />
      </div>
    ),
    line: (
      <div 
        className="absolute"
        style={{
          width: `${size * 2}px`,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 ${size}px ${color}`,
          borderRadius: '2px',
        }}
      />
    ),
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animation: `heroParticleToCenter ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.7,
        willChange: 'transform, opacity',
      }}
    >
      {particleTypes[type as keyof typeof particleTypes] || particleTypes.dot}
    </div>
  );
};

const HeroParticleField = () => {
  const [heroParticles, setHeroParticles] = useState<Array<{
    id: number;
    delay: number;
    duration: number;
    size: number;
    startX: number;
    startY: number;
    color: string;
    type: string;
  }>>([]);

  useEffect(() => {
    // Generate hero particles that move toward center
    const colors = [
      'rgba(147, 51, 234, 0.8)', // purple
      'rgba(59, 130, 246, 0.8)', // blue
      'rgba(236, 72, 153, 0.8)', // pink
      'rgba(34, 211, 238, 0.8)', // cyan
      'rgba(168, 85, 247, 0.8)', // violet
    ];

    const types = ['dot', 'star', 'line'];

    // Create particles from edges moving toward center
    const generatedParticles = Array.from({ length: 15 }, (_, i) => {
      // Generate particles from edges of screen
      let startX, startY;
      const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      
      switch (edge) {
        case 0: // top edge
          startX = Math.random() * 100;
          startY = 0;
          break;
        case 1: // right edge
          startX = 100;
          startY = Math.random() * 100;
          break;
        case 2: // bottom edge
          startX = Math.random() * 100;
          startY = 100;
          break;
        case 3: // left edge
          startX = 0;
          startY = Math.random() * 100;
          break;
        default:
          startX = Math.random() * 100;
          startY = Math.random() * 100;
      }

      return {
        id: i,
        delay: Math.random() * 5,
        duration: Math.random() * 8 + 6, // 6-14 seconds
        size: Math.random() * 4 + 2,
        startX,
        startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
      };
    });

    setHeroParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {heroParticles.map((particle) => (
        <HeroParticle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
          startX={particle.startX}
          startY={particle.startY}
          color={particle.color}
          type={particle.type}
        />
      ))}
    </div>
  );
};

interface TeamMember {
  name: string;
  role: string;
  icon: string;
  bio: string;
  skills: string[];
  experience: string;
  email: string;
  projects: string[];
  photo: string;
}

const normalizeHeadline = (headline: string) => {
  if (!headline) return "";
  // If it already has spaces, return as is
  if (headline.includes(" ")) return headline;
  // Insert spaces before capital letters/numbers to split camel/pascal case strings
  // First, handle lowercase followed by uppercase (camelCase)
  let normalized = headline.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  // Then, handle uppercase followed by uppercase+lowercase (PascalCase like "WeBuild")
  normalized = normalized.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
  // Special handling for common words that might be concatenated
  normalized = normalized.replace(/We Build/g, "We Build");
  normalized = normalized.replace(/Solutions That/g, "Solutions That");
  normalized = normalized.replace(/That Drive/g, "That Drive");
  return normalized.trim();
};

export default function Home() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [heroCursor, setHeroCursor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const [scrollY, setScrollY] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    desc: string;
    icon: string;
    features: string[];
  } | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [teamCarouselIndex, setTeamCarouselIndex] = useState(0);
  const [teamCarouselPulse, setTeamCarouselPulse] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroParticlesBurst, setHeroParticlesBurst] = useState(false);

  // Hero section entrance animation
  useEffect(() => {
    // Trigger hero animation on mount
    const timer = setTimeout(() => {
      setHeroLoaded(true);
      // Trigger particle burst after a short delay
      setTimeout(() => {
        setHeroParticlesBurst(true);
      }, 300);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for section animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set(prev).add(entry.target.id));
        }
      });
    }, observerOptions);

    // Observe all sections (and footer) that have an id for reveal animations
    const sections = document.querySelectorAll("section[id], footer[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Content - Header and Hero are hardcoded (not from database)
  const HERO_HEADLINE = "We Build Solutions That Drive Results";
  const [headerData] = useState({
    companyName: "United4ContactSolutions",
    tagline: "Unity • Focus • Commitment • Stewardship",
    logo: "",
  });
  const [heroData] = useState({
    headline: HERO_HEADLINE,
    subheadline: "Connecting Every Step",
    description:
      "United4ContactSolutions delivers comprehensive virtual assistance and customer support services that empower businesses to operate efficiently, scale confidently, and achieve sustainable growth through professional, reliable, and innovative solutions.",
    ctaPrimary: "Schedule Consultation",
    ctaSecondary: "View Services",
  });
  // Force headline to always have spaces - hardcoded value
  const formattedHeadline = HERO_HEADLINE;
  const [coreValues, setCoreValues] = useState([
    {
      icon: "🤝",
      title: "Unity",
      desc: "One cohesive team working together with shared goals and clear communication.",
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: "🎯",
      title: "Precision",
      desc: "Meticulous attention to detail and accuracy in every task and interaction.",
      color: "from-purple-600 to-purple-800",
    },
    {
      icon: "💎",
      title: "Integrity",
      desc: "Honest, ethical practices and transparent communication in all we do.",
      color: "from-blue-600 to-cyan-700",
    },
    {
      icon: "🚀",
      title: "Impact",
      desc: "Delivering measurable results that drive meaningful business transformation.",
      color: "from-slate-600 to-blue-700",
    },
  ]);
  const [aboutData, setAboutData] = useState({
    description:
      "United4ContactSolutions delivers modern virtual assistance and customer support that keeps teams focused on what matters most. We blend reliable talent, proven processes, and smart tools to handle customer communications, admin tasks, and operational follow through so every client interaction feels seamless and on brand.",
    mission:
      "At United for Contact Solutions, our mission is to deliver exceptional virtual assistance and customer support services that empower businesses to operate efficiently and grow confidently. We are committed to providing reliable, high-quality solutions through teamwork, professionalism and a client-focused approach that ensures seamless communication and outstanding results.",
    vision:
      "Our vision is to become a trusted global partner in virtual assistance by setting the standard for excellence, innovation, and dependability. We aspire to build a future where businesses of all sizes can rely on our expertise to simplify their operations, elevate customer experiences, and achieve long-term success.",
  });
  const [services, setServices] = useState([
    {
      title: "General Virtual Assistance",
      desc: "Comprehensive virtual support services to streamline your daily operations",
      icon: "🤝",
      features: ["Administrative tasks", "Email management", "Calendar scheduling", "Data entry"],
    },
    {
      title: "Marketing and Content",
      desc: "Strategic marketing solutions and engaging content creation services",
      icon: "📈",
      features: ["Content creation", "Social media management", "SEO optimization", "Brand strategy"],
    },
    {
      title: "E-Commerce and Retail",
      desc: "End-to-end e-commerce support and retail management solutions",
      icon: "🛒",
      features: ["Product listings", "Inventory management", "Order processing", "Customer service"],
    },
    {
      title: "Administrative and Support",
      desc: "Professional administrative services to keep your business running smoothly",
      icon: "📋",
      features: ["Document management", "Report generation", "Meeting coordination", "Project tracking"],
    },
    {
      title: "Automotive Sales & Aftersales Support",
      desc: "Specialized support for automotive businesses and dealerships",
      icon: "🚗",
      features: ["Sales support", "Customer follow-up", "Service scheduling", "Inventory tracking"],
    },
    {
      title: "Web Development",
      desc: "Custom web solutions and digital platform development",
      icon: "💻",
      features: ["Website design", "Frontend development", "Backend integration", "Maintenance"],
    },
  ]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [insightIndex, setInsightIndex] = useState(0);
  const visibleTeamMembers = useMemo(() => {
    if (!teamMembers.length) return [];
    const visibleCount = Math.min(5, teamMembers.length);
    return Array.from({ length: visibleCount }, (_, i) => teamMembers[(teamCarouselIndex + i) % teamMembers.length]);
  }, [teamMembers, teamCarouselIndex]);
  const [isLoading, setIsLoading] = useState(true);

  // Header and Hero are now hardcoded - no database loading needed
  // Both are set in initial state above

  // Load data from Supabase
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Header and Hero are hardcoded - no loading needed

        // Load Core Values
        const coreValuesRes = await fetch("/api/content/core-values");
        if (coreValuesRes.ok) {
          const values = await coreValuesRes.json();
          if (values && values.length > 0) {
            setCoreValues(
              values.map((v: any) => ({
                // Preserve icon ids or data URLs; fall back to empty string when null/undefined
                icon: typeof v.icon === "string" ? v.icon : "",
                title: v.title,
                desc: v.description,
                color: v.color,
              }))
            );
          }
        }

        // Load About
        const aboutRes = await fetch("/api/content/about");
        if (aboutRes.ok) {
          const about = await aboutRes.json();
          if (about) {
            setAboutData({
              description: about.description || "",
              mission: about.mission || "",
              vision: about.vision || "",
            });
          }
        }

        // Load Services
        const servicesRes = await fetch("/api/content/services");
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          if (servicesData && servicesData.length > 0) {
            setServices(
              servicesData.map((s: any) => ({
                title: s.title,
                desc: s.description,
                // Keep icon ID if it's not a data URL (uploaded image), otherwise use empty
                icon: s.icon && s.icon.startsWith("data:image") ? s.icon : (s.icon || ""),
                features: s.features || [],
              }))
            );
          }
        }

        // Load Team
        const teamRes = await fetch("/api/content/team");
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          if (teamData && teamData.length > 0) {
            setTeamMembers(
              teamData.map((t: any) => ({
                name: t.name,
                role: t.role,
                icon: t.icon,
                bio: t.bio,
                skills: t.skills || [],
                experience: t.experience,
                email: t.email,
                projects: t.projects || [],
                photo: "",
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Header and Hero are hardcoded - no polling or reloading needed

  // Debug: Log state changes
  useEffect(() => {
    console.log("Header state changed:", headerData);
  }, [headerData]);

  useEffect(() => {
    console.log("Hero state changed:", heroData);
  }, [heroData]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "team", "projects", "contacts"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Check if at top of page
      if (window.scrollY < 100) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (section: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setClickedButton(section);
    
    // Remove click animation after animation completes
    setTimeout(() => setClickedButton(null), 300);

    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(section);
      if (element) {
        const offset = 80; // Offset for fixed nav
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  // Services and team are now loaded from state (set above)

  useEffect(() => {
    // Handle body overflow when modal opens/closes
    if (isModalOpen || isServiceModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isServiceModalOpen]);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedMember(null);
    }, 300); // Wait for animation to complete
  };

  const handleServiceClick = (service: (typeof services)[number]) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleTeamCarousel = (direction: "next" | "prev") => {
    setTeamCarouselIndex((prev) =>
      direction === "next"
        ? (prev + 1) % (teamMembers.length || 1)
        : (prev - 1 + (teamMembers.length || 1)) % (teamMembers.length || 1)
    );
    setTeamCarouselPulse((p) => p + 1);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
    }, 300);
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Particle Field */}
      <ParticleField />
      
      {/* Abstract Glowing Shapes */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>
      <div className="fixed bottom-40 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000 pointer-events-none"></div>

      {/* Main Hero Section */}
      <main
        id="home"
        className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-300px)] px-6 py-16 pb-32 overflow-hidden"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setHeroCursor({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
            visible: true,
          });
        }}
        onMouseLeave={() => setHeroCursor((prev) => ({ ...prev, visible: false }))}
      >
        {/* Hero Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/office-typing-placeholder.jpg"
          style={{ transform: `translateY(${scrollY * 0.15}px) scale(1.05)` }}
        >
          <source src="/videos/office-typing.mp4" type="video/mp4" />
        </video>

        {/* Hero Particle Field */}
        <div className={`hero-particle-field ${heroParticlesBurst ? "particles-burst" : ""}`} style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
          <HeroParticleField />
        </div>
        
        {/* Burst Particles Effect */}
        {heroParticlesBurst && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (360 / 30) * i;
              const distance = 200 + Math.random() * 100;
              const radians = (angle * Math.PI) / 180;
              return (
                <div
                  key={i}
                  className="absolute hero-burst-particle"
                  style={{
                    left: '50%',
                    top: '50%',
                    animationDelay: `${i * 0.05}s`,
                    '--x': `${Math.cos(radians) * distance}px`,
                    '--y': `${Math.sin(radians) * distance}px`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        )}
        {/* Integrated Header */}
        <div className={`absolute top-0 left-0 w-full px-6 pt-6 z-30 hero-header ${heroLoaded ? "hero-header-visible" : ""}`}>
          <div className="max-w-7xl mx-auto bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-4 flex flex-col items-center gap-3">
            {headerData.logo && (headerData.logo.startsWith("data:image") || headerData.logo.startsWith("http") || headerData.logo.startsWith("/")) ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={headerData.logo}
                  alt={headerData.companyName}
                  className="h-16 md:h-20 w-auto object-contain"
                />
                <p className="text-gray-300 text-xs md:text-sm text-center uppercase tracking-[0.2em]">
                  {headerData.tagline}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
                  {headerData.companyName}
                </h2>
                <p className="text-gray-300 text-xs md:text-sm text-center uppercase tracking-[0.2em]">
                  {headerData.tagline}
                </p>
              </>
            )}
          </div>
        </div>
        <div
          className="hero-cursor-glow"
          style={{
            left: `${heroCursor.x}%`,
            top: `${heroCursor.y}%`,
            opacity: heroCursor.visible ? 0.35 : 0,
          }}
        ></div>
        
        <div
          className="max-w-6xl mx-auto text-center relative z-20 pt-24"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          {/* Logo Graphic - Replaceable via Dashboard */}
          <div className={`flex justify-center mb-8 hero-logo ${heroLoaded ? "hero-logo-visible" : ""}`}>
            {headerData.logo && (headerData.logo.startsWith("data:image") || headerData.logo.startsWith("http") || headerData.logo.startsWith("/")) ? (
              <div className="relative">
                <img
                  src={headerData.logo}
                  alt={headerData.companyName}
                  className="h-32 md:h-40 w-auto object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                {/* Central orb - purple to blue gradient */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-purple-500 via-purple-400 to-blue-500 shadow-2xl shadow-purple-500/50 animate-pulse" style={{
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(59, 130, 246, 0.4)'
                }}></div>
                
                {/* Four cyan orbs at cardinal positions with lines */}
                {[
                  { angle: 0, lineDir: 'up' },    // Top - line up
                  { angle: 90, lineDir: 'right' }, // Right - line right
                  { angle: 180, lineDir: 'down' }, // Bottom - line down
                  { angle: 270, lineDir: 'left' }  // Left - line left
                ].map((pos, i) => (
                  <div key={i} className="absolute top-1/2 left-1/2" style={{
                    transform: `translate(-50%, -50%) rotate(${pos.angle}deg) translateY(-60px)`,
                  }}>
                    {/* Cyan orb */}
                    <div 
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse" 
                      style={{ 
                        animationDelay: `${i * 0.3}s`,
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)'
                      }}
                    ></div>
                    
                    {/* Line extending outward */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-12 h-0.5 md:w-16 md:h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-transparent transform -translate-y-1/2 origin-left"
                      style={{
                        transform: `translate(-50%, -50%) ${pos.lineDir === 'up' ? 'rotate(180deg)' : pos.lineDir === 'right' ? 'rotate(-90deg)' : pos.lineDir === 'down' ? 'rotate(0deg)' : 'rotate(90deg)'}`,
                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h1 className={`text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 tracking-tight hero-headline ${heroLoaded ? "hero-headline-visible" : ""}`}>
            {formattedHeadline.split(" ").map((word, i, arr) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                {i === arr.length - 1 ? (
                  <span className="text-blue-400 italic">{word}</span>
                ) : (
                  word
                )}
                {i !== arr.length - 1 && "\u00a0"}
              </span>
            ))}
          </h1>
          
          <div className={`flex flex-col items-center mb-12 hero-subheadline ${heroLoaded ? "hero-subheadline-visible" : ""}`}>
            <div className="hero-walk-track">
              {[0, 1, 2, 3, 4, 5, 6].map((step) => (
                <span
                  key={step}
                  className="hero-walk-dot"
                  style={{ animationDelay: `${1.5 + step * 0.15}s` }}
                ></span>
              ))}
            </div>
            <p className="text-gray-400 text-xs md:text-sm mt-4 tracking-[0.4em] uppercase hero-tagline">
              {heroData.subheadline}
            </p>
          </div>

        </div>
      </main>

      {/* About Us Section */}
      <section id="about" className={`relative z-10 py-20 px-6 section-fade-up ${visibleSections.has("about") ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-sm text-blue-400 uppercase tracking-[0.4em] text-center mb-6">
              Core Values
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value) => (
                <div
                  key={value.title}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center group hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-300 relative`}
                  >
                    {value.icon && value.icon.startsWith("data:image") ? (
                      <img src={value.icon} alt={value.title} className="w-full h-full object-cover" />
                    ) : (() => {
                      // First try to get icon by ID (from dashboard selection), then by title (default)
                      const IconComponent = (value.icon && iconIdMap[value.icon]) || coreValueIconMap[value.title] || (() => <span className="text-2xl">{value.icon}</span>);
                      return (
                        <div className="text-white/90 group-hover:text-white transition-colors">
                          <IconComponent className="w-10 h-10" />
                        </div>
                      );
                    })()}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-4">About Us</h2>
          <p className="text-white/70 text-justify mb-16 max-w-3xl mx-auto text-lg leading-relaxed">
            {aboutData.description}
          </p>
          
          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-10">
                {/* Icon Container */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300 relative">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/30 to-purple-600/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h3 className="text-white text-3xl font-bold mb-1">Our Mission</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-white/90 leading-relaxed text-lg relative z-10 text-justify">
                  {aboutData.mission}
                </p>
                
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full opacity-50"></div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-transparent backdrop-blur-sm hover:border-blue-500/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-10">
                {/* Icon Container */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 relative">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/30 to-cyan-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h3 className="text-white text-3xl font-bold mb-1">Our Vision</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-white/90 leading-relaxed text-lg relative z-10 text-justify">
                  {aboutData.vision}
                </p>
                
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`relative z-10 py-20 px-6 section-fade-up ${visibleSections.has("services") ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">Our Contact Solutions</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Connecting your business to success through comprehensive virtual assistance and customer support
            </p>
            
            {/* Service Connection Visual */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-semibold">Your Business</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-4 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                  <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-700"></div>
                </div>
                <span className="text-cyan-400 font-semibold">Your Success</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <button
                key={i}
                onClick={() => handleServiceClick(service)}
                className="text-left bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              >
                <div className="mb-4 flex items-center justify-start">
                  {service.icon && service.icon.startsWith("data:image") ? (
                    <img src={service.icon} alt={service.title} className="w-16 h-16 object-cover rounded-lg" />
                  ) : (() => {
                    // First try icon ID, then service name, then fallback to emoji
                    const IconComponent = (service.icon && iconIdMap[service.icon]) || serviceIconMap[service.title] || (() => <span className="text-5xl">{service.icon}</span>);
                    return (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-300 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110 relative">
                        <IconComponent className="w-10 h-10" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
                      </div>
                    );
                  })()}
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-white/70">{service.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-purple-300 text-sm font-semibold">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Modal */}
      {isServiceModalOpen && selectedService && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          onClick={closeServiceModal}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm backdrop-enter" />
          <div
            className="relative bg-black border border-white/20 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeServiceModal}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110 z-10"
              aria-label="Close service details"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                {selectedService.icon && selectedService.icon.startsWith("data:image") ? (
                  <img src={selectedService.icon} alt={selectedService.title} className="w-16 h-16 object-cover rounded-lg" />
                ) : (() => {
                  const IconComponent = (selectedService.icon && iconIdMap[selectedService.icon]) || serviceIconMap[selectedService.title] || (() => <div className="text-6xl">{selectedService.icon}</div>);
                  return (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-blue-300 flex-shrink-0 relative">
                      <IconComponent className="w-12 h-12" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-lg"></div>
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-white text-3xl font-bold mb-2">{selectedService.title}</h3>
                  <p className="text-white/70">{selectedService.desc}</p>
                </div>
              </div>

              <div>
                <h4 className="text-white text-xl font-semibold mb-3">What’s included</h4>
                <ul className="space-y-3">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/80">
                      <span className="w-2 h-2 mt-2 bg-purple-500 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/70 mb-4">
                  Ready to explore how this service fits your roadmap? Let’s talk through scope, timeline, and next steps.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60"
                    onClick={() => {
                      closeServiceModal();
                      const contactSection = document.getElementById("contacts");
                      if (contactSection) {
                        const offset = 80;
                        const elementPosition = contactSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                      }
                    }}
                  >
                    Talk to us
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meet our Team Section */}
      <section id="team" className={`relative z-10 py-24 px-6 md:px-10 bg-black/40 overflow-hidden section-fade-up ${visibleSections.has("team") ? "visible" : ""}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,102,255,0.35),_rgba(12,15,35,0.1)_45%,_transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0,_rgba(255,255,255,0)_55%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative pt-6 md:pt-10">
          <div className="text-center mb-14 md:mb-16 px-4">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-white/80 max-w-3xl mx-auto">
              Behind every great innovation is a team of visionary leaders, creative minds, and strategic thinkers.
              Get to know the brilliant minds shaping our future.
            </p>
            <div className="mt-8 flex justify-center">

            </div>
          </div>

          <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0d1024] via-[#0f1230] to-[#070910] p-8 md:p-12 lg:p-16 shadow-[0_32px_110px_-34px_rgba(0,0,0,0.88)] overflow-hidden min-h-[540px] md:min-h-[640px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(88,102,255,0.15),_rgba(12,15,35,0.4)_60%,_rgba(5,7,15,0.9))] pointer-events-none" />
            <div className="relative flex flex-col gap-10">
              <div className="relative px-2 md:px-6 lg:px-10 pt-2 pb-6">
                <div
                  key={teamCarouselPulse}
                  className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 carousel-click-anim"
                >
                  {visibleTeamMembers.map((member, idx, arr) => {
                    const centerIndex = Math.floor(arr.length / 2);
                    const isCenter = idx === centerIndex;
                    const isSide = Math.abs(idx - centerIndex) === 1;
                    return (
                    <div
                      key={(member.email || member.name) + idx}
                      onClick={() => handleMemberClick(member)}
                        className={`relative cursor-pointer rounded-[30px] overflow-hidden bg-white/5 border border-white/10 transition-all duration-500 ease-out
                        ${isCenter ? "w-[300px] md:w-[360px] lg:w-[420px] scale-110 md:scale-120 shadow-2xl shadow-purple-900/40 z-20" : ""}
                        ${isSide ? "w-[260px] md:w-[300px] lg:w-[340px] opacity-100 scale-[1.02] z-10" : ""}
                        ${!isCenter && !isSide ? "w-[230px] md:w-[260px] lg:w-[300px] opacity-80 scale-95 z-0" : ""}
                      `}
                    >
                        <div className="relative aspect-[3/4] w-full">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/70 z-10" />
                          {member.icon && member.icon.startsWith("data:image") ? (
                            <img src={member.icon} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center text-7xl text-white/80">
                              {member.icon || "👤"}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-lg shadow-black/50">
                              <h3 className="text-white font-semibold text-base leading-tight">{member.name}</h3>
                              <p className="text-white/70 text-xs mt-1">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {teamMembers.length > 1 && (
                  <div className="mt-16 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleTeamCarousel("prev")}
                        className="arrow-cta group flex w-11 h-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white hover:bg-white/15 hover:border-white/50 transition-all duration-500 ease-out shadow-lg shadow-black/50 hover:shadow-[0_0_22px_rgba(139,92,246,0.35)] active:scale-90 backdrop-blur-sm"
                        aria-label="Previous team member"
                      >
                        <svg className="w-6 h-6 transition-transform duration-500 ease-out group-hover:-translate-x-0.5 group-active:-translate-x-1" viewBox="0 0 24 24" aria-hidden="true">
                          <defs>
                            <linearGradient id="arrow-prev" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M14.5 5.5 8 12l6.5 6.5"
                            fill="none"
                            stroke="url(#arrow-prev)"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11 12h7"
                            fill="none"
                            stroke="url(#arrow-prev)"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>

                      <div className="flex items-center gap-2">
                        {teamMembers.slice(0, 8).map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setTeamCarouselIndex(idx);
                              setTeamCarouselPulse((p) => p + 1);
                            }}
                            className={`h-2 rounded-full transition-all ${
                              idx === teamCarouselIndex ? "w-6 bg-purple-400" : "w-2 bg-white/25 hover:bg-white/40"
                            }`}
                            aria-label={`Go to team member ${idx + 1}`}
                          >
                            <span className="sr-only">Go to team member {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTeamCarousel("next")}
                        className="arrow-cta group flex w-11 h-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white hover:bg-white/15 hover:border-white/50 transition-all duration-500 ease-out shadow-lg shadow-black/50 hover:shadow-[0_0_22px_rgba(139,92,246,0.35)] active:scale-90 backdrop-blur-sm"
                        aria-label="Next team member"
                      >
                        <svg className="w-6 h-6 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-active:translate-x-1" viewBox="0 0 24 24" aria-hidden="true">
                          <defs>
                            <linearGradient id="arrow-next" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#22d3ee" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M9.5 5.5 16 12l-6.5 6.5"
                            fill="none"
                            stroke="url(#arrow-next)"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13 12H6"
                            fill="none"
                            stroke="url(#arrow-next)"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative max-w-4xl mx-auto mt-2 md:mt-4">
                {visibleTeamMembers.length > 0 ? (
                  (() => {
                    const featured =
                      visibleTeamMembers[Math.floor(visibleTeamMembers.length / 2)];
                    return (
                      <div className="text-center space-y-3">
                        <p className="text-xs font-medium tracking-[0.28em] uppercase text-purple-300/80">
                          Team insight
                        </p>
                        <p className="text-white/85 italic leading-relaxed text-sm md:text-base">
                          "
                          {featured.bio ||
                            "For us, innovation means quietly solving the hard problems so clients experience clarity, consistency, and genuine care in every interaction."}
                          "
                        </p>
                        <p className="text-white/50 text-xs md:text-sm mt-1">
                          {featured.name} &mdash; {featured.role}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-white/70 italic leading-relaxed text-sm md:text-base text-center">
                    Our team&apos;s perspectives on innovation will appear here as soon as profiles are
                    available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm backdrop-enter" />
          
          {/* Modal Content */}
          <div
            className="relative bg-black border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center gap-6">
                <div className="text-8xl">{selectedMember.icon}</div>
                <div>
                  <h2 className="text-white text-3xl font-bold mb-2">{selectedMember.name}</h2>
                  <p className="text-white/70 text-lg">{selectedMember.role}</p>
                  <p className="text-white/50 text-sm mt-1">{selectedMember.experience} of experience</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-white text-xl font-semibold mb-3">About</h3>
                <p className="text-white/80 leading-relaxed">{selectedMember.bio}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-white text-xl font-semibold mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-white/90 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-white text-xl font-semibold mb-3">Notable Projects</h3>
                <ul className="space-y-2">
                  {selectedMember.projects.map((project, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/80">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      {project}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white text-xl font-semibold mb-3">Contact</h3>
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {selectedMember.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <section id="projects" className={`relative z-10 py-20 px-6 bg-black/50 section-fade-up ${visibleSections.has("projects") ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-4">
            Individual Insights on Innovation
          </h2>
          <p className="text-white/70 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed">
            Every member of our team sees innovation a little differently. Swipe through their perspectives
            to see how we turn ideas into client-focused solutions.
          </p>

          {teamMembers.length > 0 ? (
            <div className="relative max-w-4xl mx-auto">
              {/* Carousel card */}
              {(() => {
                const member = teamMembers[Math.min(insightIndex, teamMembers.length - 1)];
                return (
                  <div
                    key={insightIndex}
                    className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#1b102d] via-[#0b1025] to-[#050812] backdrop-blur-md shadow-[0_24px_80px_rgba(0,0,0,0.85)] px-6 py-8 md:px-10 md:py-10"
                    style={{ animation: "fadeInUp 0.55s ease both 0.12s" }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_55%)] opacity-80 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 md:gap-10">
                      {/* Photo / avatar */}
                      <div className="w-full md:w-40 flex-shrink-0">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border border-white/15 shadow-xl shadow-black/60 mx-auto md:mx-0">
                          {member.icon && member.icon.startsWith("data:image") ? (
                            <img
                              src={member.icon}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500/40 via-indigo-500/40 to-blue-500/30 flex items-center justify-center text-5xl md:text-6xl">
                              {member.icon || "👤"}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="flex-1 space-y-5">
                        <div>
                          <h3 className="text-white text-2xl md:text-3xl font-semibold">
                            {member.name}
                          </h3>
                          <p className="text-purple-300/90 text-sm md:text-base mt-1">
                            {member.role}
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <p className="text-white/85 leading-relaxed italic text-base">
                            "
                            {member.bio ||
                              `Innovation, for me, means designing systems that feel effortless for clients while remaining robust behind the scenes. When technology respects people’s time and attention, it becomes truly powerful.`}
                            "
                          </p>
                        </div>

                        {member.skills && member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {member.skills.slice(0, 3).map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs md:text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Controls */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setInsightIndex((prev) =>
                      teamMembers.length ? (prev - 1 + teamMembers.length) % teamMembers.length : 0
                    )
                  }
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors h-10 w-10"
                >
                  <span className="sr-only">Previous insight</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex-1 flex items-center justify-center gap-2">
                  {teamMembers.slice(0, 8).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInsightIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === Math.min(insightIndex, teamMembers.length - 1)
                          ? "w-6 bg-purple-400"
                          : "w-2 bg-white/25 hover:bg-white/40"
                      }`}
                    >
                      <span className="sr-only">Go to insight {idx + 1}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setInsightIndex((prev) =>
                      teamMembers.length ? (prev + 1) % teamMembers.length : 0
                    )
                  }
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors h-10 w-10"
                >
                  <span className="sr-only">Next insight</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">
                Team member insights will appear here once team data is loaded.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-20 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-4">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { number: "500+", label: "Projects Completed", icon: "🚀" },
              { number: "200+", label: "Happy Clients", icon: "😊" },
              { number: "8+", label: "Countries Served", icon: "🌍" },
              { number: "99%", label: "Client Satisfaction", icon: "⭐" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-white text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business with innovative solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push("/consultation")}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Book a Consultation
            </button>
            <button 
              onClick={() => {
                const projectsSection = document.getElementById("projects");
                if (projectsSection) {
                  const offset = 80;
                  const elementPosition = projectsSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
              }}
              className="border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            >
              View Our Work
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form */}

      {/* Footer / Contact Section */}
      <footer
        id="contacts"
        className={`relative z-10 py-20 px-6 bg-black/60 section-fade-up ${
          visibleSections.has("contacts") ? "visible" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Outer card */}
          <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-purple-900/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Top content: company + contact info (no form) */}
            <div className="p-8 md:p-10 lg:p-12">
              {/* Company + contact info */}
              <div className="space-y-8 max-w-5xl">
                {/* Brand */}
                <div className="space-y-3">
                  <p className="text-purple-300 text-xs md:text-sm tracking-[0.35em] uppercase">
                    Contact
                  </p>
                  <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                    Let&apos;s build your next
                    <span className="block text-purple-300">customer experience.</span>
                  </h2>
                  <p className="text-sm md:text-base text-white/70 max-w-xl">
                    Share your requirements and we&apos;ll respond within one business day with next steps,
                    timelines, and how our team can support your operations.
                  </p>
                </div>

                {/* Direct contact details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-white/50 uppercase tracking-[0.2em]">
                      Call us
                    </p>
                    <a
                      href="tel:+15551234567"
                      className="text-white text-base md:text-lg font-medium hover:text-purple-300 transition-colors"
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-white/50 uppercase tracking-[0.2em]">
                      Email
                    </p>
                    <a
                      href="mailto:contact@united4contactsolutions.com"
                      className="text-white text-base md:text-lg font-medium hover:text-purple-300 transition-colors break-all"
                    >
                      contact@united4contactsolutions.com
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-white/50 uppercase tracking-[0.2em]">
                      Social
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 text-sm md:text-base hover:text-purple-300 transition-colors"
                      >
                        LinkedIn
                      </a>
                      <span className="text-white/30">•</span>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 text-sm md:text-base hover:text-purple-300 transition-colors"
                      >
                        Instagram
                      </a>
                      <span className="text-white/30">•</span>
                      <a
                        href="https://x.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 text-sm md:text-base hover:text-purple-300 transition-colors"
                      >
                        X
                      </a>
                      <span className="text-white/30">•</span>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 text-sm md:text-base hover:text-purple-300 transition-colors"
                      >
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar: brand + copyright */}
            <div className="border-t border-white/10 bg-black/40 px-6 md:px-8 lg:px-10 py-5 md:py-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 border border-purple-400/60 text-purple-300 text-xs font-semibold">
                  U4
                </span>
                <span className="text-sm md:text-base font-medium text-white">
                  United4ContactSolutions
                </span>
              </div>
              <p className="text-xs md:text-sm text-white/50 text-center md:text-right">
                © {new Date().getFullYear()} United4ContactSolutions. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed z-50 bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Connection indicator */}
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
              <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-500"></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <a
              href="#"
              onClick={(e) => handleNavClick("home", e)}
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeSection === "home"
                  ? "bg-white text-black scale-110 shadow-lg shadow-white/20"
                  : "bg-emerald-900/50 text-white hover:bg-emerald-800/50"
              } ${
                clickedButton === "home" ? "animate-pulse scale-95" : ""
              }`}
            >
              Home
              {activeSection === "home" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
              )}
          </a>
          <a
              href="#team"
              onClick={(e) => handleNavClick("team", e)}
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeSection === "team"
                  ? "bg-white text-black scale-110 shadow-lg shadow-white/20"
                  : "bg-emerald-900/50 text-white hover:bg-emerald-800/50"
              } ${
                clickedButton === "team" ? "animate-pulse scale-95" : ""
              }`}
            >
              Meet our Team
              {activeSection === "team" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
              )}
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick("projects", e)}
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeSection === "projects"
                  ? "bg-white text-black scale-110 shadow-lg shadow-white/20"
                  : "bg-emerald-900/50 text-white hover:bg-emerald-800/50"
              } ${
                clickedButton === "projects" ? "animate-pulse scale-95" : ""
              }`}
            >
              Projects
              {activeSection === "projects" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
              )}
          </a>
          <a
              href="#contacts"
              onClick={(e) => handleNavClick("contacts", e)}
              className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeSection === "contacts"
                  ? "bg-white text-black scale-110 shadow-lg shadow-white/20"
                  : "bg-emerald-900/50 text-white hover:bg-emerald-800/50"
              } ${
                clickedButton === "contacts" ? "animate-pulse scale-95" : ""
              }`}
            >
              Contacts
              {activeSection === "contacts" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
              )}
          </a>
        </div>
        </div>
      </nav>
    </div>
  );
}

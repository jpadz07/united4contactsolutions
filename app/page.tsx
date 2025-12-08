"use client";

import { useState, useEffect, useMemo } from "react";
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

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  hearAbout: string;
  consent: boolean;
}

const INITIAL_FORM_STATE: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  hearAbout: "",
  consent: false,
};

const normalizeHeadline = (headline: string) => {
  if (!headline) return "";
  if (headline.includes(" ")) return headline;
  // Insert spaces before capital letters/numbers to split camel/pascal case strings
  return headline
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .trim();
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
  const [contactForm, setContactForm] = useState<ContactFormData>(INITIAL_FORM_STATE);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Content from Supabase
  const [headerData, setHeaderData] = useState({
    companyName: "United4ContactSolutions",
    tagline: "Unity • Precision • Integrity • Impact",
    logo: "",
  });
  const [heroData, setHeroData] = useState({
    headline: "We Build Solutions That Drive Results",
    subheadline: "Connecting Every Step",
    description:
      "United4ContactSolutions delivers comprehensive virtual assistance and customer support services that empower businesses to operate efficiently, scale confidently, and achieve sustainable growth through professional, reliable, and innovative solutions.",
    ctaPrimary: "Schedule Consultation",
    ctaSecondary: "View Services",
  });
  const formattedHeadline = useMemo(
    () => normalizeHeadline(heroData.headline || ""),
    [heroData.headline]
  );
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
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load Header (with cache busting and timestamp)
        const headerRes = await fetch(`/api/content/header?t=${Date.now()}`, {
          cache: 'no-store',
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        if (headerRes.ok) {
          const header = await headerRes.json();
          console.log("Header API response (raw):", JSON.stringify(header, null, 2));
          
          // Handle null response
          if (header === null) {
            console.warn("Header data is null - using defaults");
          } else {
            // Handle both direct data and wrapped response
            const headerData = (header && typeof header === 'object' && 'data' in header) ? header.data : header;
            console.log("Header data (processed):", JSON.stringify(headerData, null, 2));
            
            // Check if response has error (database not configured)
            if (headerData && typeof headerData === 'object' && !headerData.error) {
              // Always update if we have data (even if some fields are empty)
              const newHeaderData = {
                companyName: headerData.company_name || "United4ContactSolutions",
                tagline: headerData.tagline || "Unity • Precision • Integrity • Impact",
                logo: headerData.logo || "",
              };
              console.log("Setting header data to:", newHeaderData);
              setHeaderData(newHeaderData);
              console.log("Header state updated successfully");
            } else if (headerData && headerData.error) {
              console.warn("Header data not available:", headerData.error);
            } else {
              console.warn("Header data format unexpected:", typeof headerData, headerData);
            }
          }
        } else {
          const errorData = await headerRes.json().catch(() => ({}));
          console.warn("Failed to load header:", errorData.error || "Unknown error", headerRes.status);
        }

        // Load Hero (with cache busting and timestamp)
        const heroRes = await fetch(`/api/content/hero?t=${Date.now()}`, {
          cache: 'no-store',
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        if (heroRes.ok) {
          const hero = await heroRes.json();
          console.log("Hero API response (raw):", JSON.stringify(hero, null, 2));
          
          // Handle null response
          if (hero === null) {
            console.warn("Hero data is null - using defaults");
          } else {
            // Handle both direct data and wrapped response
            const heroData = (hero && typeof hero === 'object' && 'data' in hero) ? hero.data : hero;
            console.log("Hero data (processed):", JSON.stringify(heroData, null, 2));
            
            if (heroData && typeof heroData === 'object' && !heroData.error) {
              // Always update if we have data (even if some fields are empty)
              const newHeroData = {
                headline: heroData.headline || "We Build Solutions That Drive Results",
                subheadline: heroData.subheadline || "Connecting Every Step",
                description: heroData.description || "",
                ctaPrimary: heroData.cta_primary || "Schedule Consultation",
                ctaSecondary: heroData.cta_secondary || "View Services",
              };
              console.log("Setting hero data to:", newHeroData);
              setHeroData(newHeroData);
              console.log("Hero state updated successfully");
            } else if (heroData && heroData.error) {
              console.warn("Hero data not available:", heroData.error);
            } else {
              console.warn("Hero data format unexpected:", typeof heroData, heroData);
            }
          }
        } else {
          const errorData = await heroRes.json().catch(() => ({}));
          console.warn("Failed to load hero:", errorData.error || "Unknown error", heroRes.status);
        }

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

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (formStatus.type) {
      setFormStatus({ type: null, message: "" });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: checked }));
    if (formStatus.type) {
      setFormStatus({ type: null, message: "" });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredFields: Array<keyof ContactFormData> = ["firstName", "lastName", "email", "message"];
    const missingFields = requiredFields.filter((field) => {
      if (field === "consent") return false;
      return !contactForm[field] || (typeof contactForm[field] === "string" && !contactForm[field].trim());
    });

    if (missingFields.length > 0) {
      setFormStatus({ type: "error", message: "Please fill out all required fields before submitting." });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFormStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you soon.",
      });
      setContactForm(INITIAL_FORM_STATE);
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again or email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            {formattedHeadline.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="hero-word" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                  {" "}
                  <span className="text-blue-400 italic">{word}</span>
                </span>
              ) : (
                <span key={i} className="hero-word" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>{word} </span>
              )
            )}
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
                  <a
                    href="mailto:contact@united4contactsolutions.com?subject=Service%20Inquiry"
                    className="flex-1 border border-white/20 text-white font-semibold px-6 py-3 rounded-full text-center transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                    onClick={closeServiceModal}
                  >
                    Email details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meet our Team Section */}
      <section id="team" className={`relative z-10 py-20 px-6 bg-black/40 section-fade-up ${visibleSections.has("team") ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-blue-400 uppercase tracking-[0.4em] mb-3">Our Team</p>
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-3">Our Experts Are Like No Other</h2>
            <p className="text-white/70 max-w-4xl mx-auto">
              Partner with our experts to elevate your operations. We work closely with every client to deliver practical
              improvements that make daily workflows smarter and more efficient.
          </p>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {teamMembers.map((member) => (
              <div
                key={member.email}
                onClick={() => handleMemberClick(member)}
                className="group cursor-pointer rounded-[32px] overflow-hidden bg-white shadow-2xl flex flex-col w-full max-w-xs"
              >
                <div className="relative h-64 w-full bg-gradient-to-br from-gray-200 via-gray-100 to-white flex items-center justify-center">
                  {member.icon && member.icon.startsWith("data:image") ? (
                    <img src={member.icon} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl">{member.icon}</div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-black text-lg font-semibold">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
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
          <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-4">Featured Projects</h2>
          <p className="text-white/70 text-center mb-16 max-w-2xl mx-auto">
            Showcasing our best work and client success stories
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "E-Commerce Platform", category: "Web Development", color: "from-purple-500/20 to-pink-500/20" },
              { title: "Healthcare App", category: "Mobile Development", color: "from-blue-500/20 to-cyan-500/20" },
              { title: "FinTech Dashboard", category: "UI/UX Design", color: "from-green-500/20 to-emerald-500/20" },
              { title: "SaaS Platform", category: "Cloud Solutions", color: "from-orange-500/20 to-red-500/20" },
              { title: "Education Portal", category: "Web Development", color: "from-indigo-500/20 to-purple-500/20" },
              { title: "Real Estate App", category: "Mobile Development", color: "from-teal-500/20 to-blue-500/20" },
            ].map((project, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className={`h-64 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4 opacity-50">💼</div>
                    <h3 className="text-white text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-white/60 text-sm">{project.category}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="text-white px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-4">Client Success Stories</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            See how we've helped businesses achieve measurable results through our professional virtual assistance services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "Sarah Mitchell", 
                role: "Operations Director", 
                company: "TechFlow Solutions",
                quote: "United4ContactSolutions reduced our administrative overhead by 40% while improving customer response times. Their team seamlessly integrated with our operations.",
                rating: 5,
                result: "40% cost reduction",
                avatar: "👩‍💼"
              },
              { 
                name: "David Chen", 
                role: "CEO", 
                company: "Global Automotive Parts",
                quote: "Their automotive sales support helped us increase lead conversion by 65%. The team's industry knowledge and professionalism exceeded our expectations.",
                rating: 5,
                result: "65% lead increase",
                avatar: "👨‍💼"
              },
              { 
                name: "Maria Rodriguez", 
                role: "Founder", 
                company: "E-Commerce Plus",
                quote: "From order processing to customer service, they handle everything flawlessly. Our customer satisfaction scores improved by 35% in just 3 months.",
                rating: 5,
                result: "35% satisfaction boost",
                avatar: "👩‍💻"
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    <p className="text-blue-400 text-xs font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide mb-1">Result</p>
                  <p className="text-white text-sm font-medium">{testimonial.result}</p>
                </div>
              </div>
            ))}
          </div>
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
      <section id="consultation" className={`relative z-10 py-20 px-6 section-fade-up ${visibleSections.has("consultation") ? "visible" : ""}`}>
        <div className="max-w-4xl mx-auto">
          <form className="section-child bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl" onSubmit={handleContactSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-white/90 text-sm font-medium mb-2">
                  First name: <span className="text-red-400">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={contactForm.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:bg-white/15 transition-all"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-white/90 text-sm font-medium mb-2">
                  Last name: <span className="text-red-400">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={contactForm.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:bg-white/15 transition-all"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2">
                  Email address: <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:bg-white/15 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-white/90 text-sm font-medium mb-2">
                  Phone number:
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:bg-white/15 transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-white/90 text-sm font-medium mb-2">
                Message: <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={contactForm.message}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:bg-white/15 transition-all resize-y"
                placeholder="Tell us about your project or inquiry..."
              />
            </div>

            <div>
              <label htmlFor="hearAbout" className="block text-white/90 text-sm font-medium mb-2">
                How did you hear about me?:
              </label>
              <select
                id="hearAbout"
                name="hearAbout"
                value={contactForm.hearAbout}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:bg-white/15 transition-all"
              >
                <option value="" className="bg-black text-white">Select an option</option>
                <option value="google" className="bg-black text-white">Google Search</option>
                <option value="social-media" className="bg-black text-white">Social Media</option>
                <option value="referral" className="bg-black text-white">Referral</option>
                <option value="other" className="bg-black text-white">Other</option>
              </select>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={contactForm.consent}
                  onChange={handleCheckboxChange}
                  className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-white/80 text-sm">
                  Yes, I agree to be contacted and receive helpful emails and understand I can unsubscribe at anytime.
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105"
              >
                SUBMIT
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {formStatus.message && (
              <p
                className={`text-sm text-center ${
                  formStatus.type === "success" ? "text-green-400" : "text-red-400"
                }`}
                aria-live="polite"
              >
                {formStatus.message}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className={`relative z-10 py-20 px-6 bg-black/50 pb-32 section-fade-up ${visibleSections.has("contacts") ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-4">Get in Touch</h2>
          <p className="text-white/70 text-center mb-16 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us through any of these channels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Email", info: "contact@united4contactsolutions.com", icon: "📧" },
              { title: "Phone", info: "+1 (555) 123-4567", icon: "📞" },
              { title: "Address", info: "123 Business St, Suite 100", icon: "📍" },
            ].map((contact, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl mb-4">{contact.icon}</div>
                <h3 className="text-white text-xl font-semibold mb-3">{contact.title}</h3>
                <p className="text-white/70">{contact.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

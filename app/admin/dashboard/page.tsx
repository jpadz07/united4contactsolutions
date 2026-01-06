"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { isAuthenticated, clearSession, getSession, extendSession } from "@/lib/auth/session";
import { getTokenFromUrl, validateUrlToken, generateSecureDashboardUrl } from "@/lib/auth/url-encryption";
import {
  OverviewIcon,
  TargetIcon,
  StarIcon,
  BookIcon,
  SettingsIcon,
  UsersIcon,
  BriefcaseIcon,
  ChatIcon,
  LogoutIcon,
  ServicesIcon,
  SaveIcon,
  MetricsIcon,
  
} from "./components/Icons";
import IconPicker, { iconLibrary } from "./components/IconPicker";

// Default data matching the landing page structure
const defaultHeader = {
  companyName: "United4ContactSolutions",
  tagline: "Unity • Focus • Commitment • Stewardship",
  logo: "",
};

const defaultHero = {
  headline: "We Build Solutions That Drive Results",
  subheadline: "Connecting Every Step",
  description:
    "United4ContactSolutions delivers comprehensive virtual assistance and customer support services that empower businesses to operate efficiently, scale confidently, and achieve sustainable growth through professional, reliable, and innovative solutions.",
  ctaPrimary: "Schedule Consultation",
  ctaSecondary: "View Services",
};

const defaultCoreValues = [
  {
    icon: "users", // Icon ID from icon library
    title: "Unity",
    desc: "One cohesive team working together with shared goals and clear communication.",
    color: "from-blue-600 to-blue-800",
  },
  {
    icon: "target", // Icon ID from icon library
    title: "Precision",
    desc: "Meticulous attention to detail and accuracy in every task and interaction.",
    color: "from-purple-600 to-purple-800",
  },
  {
    icon: "shield-check", // Icon ID from icon library
    title: "Integrity",
    desc: "Honest, ethical practices and transparent communication in all we do.",
    color: "from-blue-600 to-cyan-700",
  },
  {
    icon: "lightning", // Icon ID from icon library
    title: "Impact",
    desc: "Delivering measurable results that drive meaningful business transformation.",
    color: "from-slate-600 to-blue-700",
  },
];

const defaultAbout = {
  description:
    "United4ContactSolutions delivers modern virtual assistance and customer support that keeps teams focused on what matters most. We blend reliable talent, proven processes, and smart tools to handle customer communications, admin tasks, and operational follow through so every client interaction feels seamless and on brand.",
  mission:
    "At United for Contact Solutions, our mission is to deliver exceptional virtual assistance and customer support services that empower businesses to operate efficiently and grow confidently. We are committed to providing reliable, high-quality solutions through teamwork, professionalism and a client-focused approach that ensures seamless communication and outstanding results.",
  vision:
    "Our vision is to become a trusted global partner in virtual assistance by setting the standard for excellence, innovation, and dependability. We aspire to build a future where businesses of all sizes can rely on our expertise to simplify their operations, elevate customer experiences, and achieve long-term success.",
};

const defaultServices = [
  {
    title: "General Virtual Assistance",
    desc: "Comprehensive virtual support services to streamline your daily operations",
    icon: "headset", // Next-gen icon ID
    features: ["Administrative tasks", "Email management", "Calendar scheduling", "Data entry"],
  },
  {
    title: "Marketing and Content",
    desc: "Strategic marketing solutions and engaging content creation services",
    icon: "trending-up", // Next-gen icon ID
    features: ["Content creation", "Social media management", "SEO optimization", "Brand strategy"],
  },    
  {
    title: "E-Commerce and Retail",
    desc: "End-to-end e-commerce support and retail management solutions",
    icon: "shopping-cart", // Next-gen icon ID
    features: ["Product listings", "Inventory management", "Order processing", "Customer service"],
  },
  {
    title: "Administrative and Support",
    desc: "Professional administrative services to keep your business running smoothly",
    icon: "document", // Next-gen icon ID
    features: ["Document management", "Report generation", "Meeting coordination", "Project tracking"],
  },
  {
    title: "Automotive Sales & Aftersales Support",
    desc: "Specialized support for automotive businesses and dealerships",
    icon: "car", // Next-gen icon ID
    features: ["Sales support", "Customer follow-up", "Service scheduling", "Inventory tracking"],
  },
  {
    title: "Web Development",
    desc: "Custom web solutions and digital platform development",
    icon: "code", // Next-gen icon ID
    features: ["Website design", "Frontend development", "Backend integration", "Maintenance"],
  },
];

const defaultTeam = [
  {
    name: "Niño Nesperos",
    role: "CEO & Founder",
    icon: "👨‍💼",
    bio: "Visionary leader dedicated to delivering exceptional virtual assistance services. With extensive experience in business operations and client relations, Niño drives the company's mission to empower businesses through reliable support solutions.",
    skills: ["Strategic Leadership", "Business Development", "Client Relations", "Operations Management"],
    experience: "10+ years",
    email: "nino.nesperos@united4contactsolutions.com",
    projects: ["Company Foundation", "Service Excellence Program", "Client Success Initiative"],
  },
  {
    name: "Jason Pada",
    role: "IT General Services",
    icon: "👨‍💻",
    bio: "Experienced IT specialist focused on providing comprehensive technical support, infrastructure management, and smooth operations across all client systems.",
    skills: ["IT Support", "Infrastructure Management", "Systems Administration", "Process Optimization"],
    experience: "8+ years",
    email: "jason.pada@united4contactsolutions.com",
    projects: ["IT Infrastructure Setup", "System Optimization", "Security Implementation"],
  },
  {
    name: "Louis Gascon",
    role: "Customer Expert Support",
    icon: "👨‍🎓",
    bio: "Customer service expert committed to delivering outstanding support experiences. Specializes in building strong client relationships and ensuring customer satisfaction.",
    skills: ["Customer Support", "Relationship Management", "Problem Solving", "Communication"],
    experience: "7+ years",
    email: "louis.gascon@united4contactsolutions.com",
    projects: ["Customer Success Program", "Support Process Improvement", "Client Onboarding"],
  },
];

const defaultProjects = [
  { title: "E-Commerce Platform", category: "Web Development", color: "from-purple-500/20 to-pink-500/20" },
  { title: "Healthcare App", category: "Mobile Development", color: "from-blue-500/20 to-cyan-500/20" },
  { title: "FinTech Dashboard", category: "UI/UX Design", color: "from-green-500/20 to-emerald-500/20" },
  { title: "SaaS Platform", category: "Cloud Solutions", color: "from-orange-500/20 to-red-500/20" },
  { title: "Education Portal", category: "Web Development", color: "from-indigo-500/20 to-purple-500/20" },
  { title: "Real Estate App", category: "Mobile Development", color: "from-teal-500/20 to-blue-500/20" },
];

const defaultTestimonials = [
  {
    name: "Sarah Mitchell",
    role: "Operations Director",
    company: "TechFlow Solutions",
    quote:
      "United4ContactSolutions reduced our administrative overhead by 40% while improving customer response times. Their team seamlessly integrated with our operations.",
    rating: 5,
    result: "40% cost reduction",
    avatar: "👩‍💼",
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "Global Retail Co.",
    quote:
      "The e-commerce support team transformed our online operations. We've seen a 60% increase in order processing efficiency and significantly improved customer satisfaction scores.",
    rating: 5,
    result: "60% efficiency increase",
    avatar: "👨‍💼",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Brand Innovations",
    quote:
      "Their content and marketing services elevated our brand presence. We've achieved consistent growth in engagement and lead generation since partnering with them.",
    rating: 5,
    result: "3x engagement growth",
    avatar: "👩‍💻",
  },
];

type TabType = "overview" | "header" | "core-values" | "about" | "services" | "team" | "projects" | "testimonials" | "settings";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [header, setHeader] = useState(defaultHeader);
  const [hero, setHero] = useState(defaultHero);
  const [coreValues, setCoreValues] = useState(defaultCoreValues);
  const [about, setAbout] = useState(defaultAbout);
  const [services, setServices] = useState(defaultServices);
  const [team, setTeam] = useState(defaultTeam);
  const [projects, setProjects] = useState(defaultProjects);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [status, setStatus] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<{
    connected: boolean;
    message: string;
    loading: boolean;
  }>({ connected: false, message: "Not checked", loading: false });

  // Handle mobile sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const session = getSession();
      
      if (!session || !isAuthenticated()) {
        router.push("/admin");
        return;
      }

      // Validate URL token first
      const urlToken = getTokenFromUrl();
      if (!urlToken || !validateUrlToken(session.token, urlToken)) {
        // Token missing or invalid - redirect to login
        clearSession();
        router.push("/admin");
        return;
      }

      // If URL doesn't have token, redirect to secure URL
      if (!urlToken) {
        const secureUrl = generateSecureDashboardUrl(session.token);
        router.replace(secureUrl);
        return;
      }

      // Verify session with server
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: session.token }),
        });

        const data = await response.json();

        if (!data.authenticated) {
          clearSession();
          router.push("/admin");
          return;
        }

        // Extend session on activity
        extendSession();
      } catch (error) {
        console.error("Auth verification failed:", error);
        clearSession();
        router.push("/admin");
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Extend session on user activity
  useEffect(() => {
    if (isCheckingAuth) return;

    const activityHandler = () => {
      extendSession();
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, activityHandler);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, activityHandler);
      });
    };
  }, [isCheckingAuth]);

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTimeout(() => setIsTransitioning(false), 150);
    }, 150);
  };

  useEffect(() => {
    setIsTransitioning(false);
  }, [activeTab]);

  const handleSave = async (section: string) => {
    // Check authentication first
    const session = getSession();
    if (!session || !isAuthenticated()) {
      setStatus("Error: Session expired. Redirecting to login...");
      setTimeout(() => {
        clearSession();
        router.push("/admin");
      }, 2000);
      return;
    }

    // Extend session before saving
    extendSession();

    setStatus(`Saving ${section}...`);
    try {
      let response;
      let endpoint = "";
      let body: any = {};

      switch (section) {
        case "Header":
          endpoint = "/api/content/header";
          body = {
            company_name: header.companyName,
            tagline: header.tagline,
            logo: header.logo || null,
          };
          break;
        case "Hero Section":
          endpoint = "/api/content/hero";
          body = {
            headline: hero.headline,
            subheadline: hero.subheadline,
            description: hero.description,
            cta_primary: hero.ctaPrimary,
            cta_secondary: hero.ctaSecondary,
          };
          break;
        case "Core Values":
          endpoint = "/api/content/core-values";
          body = {
            values: coreValues.map((v) => ({
              // Save icon ID if it's not a data URL (uploaded image), otherwise save the data URL
              icon: v.icon && v.icon.startsWith("data:image") ? v.icon : (v.icon || null),
              title: v.title,
              desc: v.desc,
              color: v.color,
            })),
          };
          break;
        case "About Us":
          endpoint = "/api/content/about";
          body = {
            description: about.description,
            mission: about.mission,
            vision: about.vision,
          };
          break;
        case "Services":
          endpoint = "/api/content/services";
          body = {
            services: services.map((s) => ({
              title: s.title,
              desc: s.desc,
              icon: s.icon,
              // Filter out empty lines when saving to database
              features: s.features.filter((f: string) => f.trim() !== ""),
            })),
          };
          break;
        case "Team":
          endpoint = "/api/content/team";
          body = {
            team: team.map((t) => ({
              name: t.name,
              role: t.role,
              icon: t.icon,
              bio: t.bio,
              skills: t.skills,
              experience: t.experience,
              email: t.email,
              projects: t.projects,
            })),
          };
          break;
        case "Projects":
          endpoint = "/api/content/projects";
          body = {
            projects: projects.map((p) => ({
              title: p.title,
              category: p.category,
              color: p.color,
            })),
          };
          break;
        case "Testimonials":
          endpoint = "/api/content/testimonials";
          body = {
            testimonials: testimonials.map((t) => ({
              name: t.name,
              role: t.role,
              company: t.company,
              quote: t.quote,
              rating: t.rating,
              result: t.result,
              avatar: t.avatar,
            })),
          };
          break;
        default:
          setStatus("Unknown section");
          return;
      }

      // Get fresh session token (already checked above)
      const authToken = session.token;

      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken,
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Check for database connection errors
        if (response.status === 503) {
          throw new Error(
            responseData.error || 
            "Database not connected. Please check your Supabase configuration."
          );
        }
        throw new Error(
          responseData.error || 
          responseData.details || 
          "Failed to save"
        );
      }

      // Check if response indicates success
      if (responseData.success || responseData.data) {
        setStatus(`${section} saved successfully!`);
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus(`${section} saved (check landing page to verify)`);
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (error: any) {
      console.error("Save error:", error);
      setStatus(`Error: ${error.message}`);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Header
        const headerRes = await fetch("/api/content/header");
        if (headerRes.ok) {
          const headerData = await headerRes.json();
          if (headerData) {
            setHeader({
              companyName: headerData.company_name || defaultHeader.companyName,
              tagline: headerData.tagline || defaultHeader.tagline,
              logo: headerData.logo || "",
            });
          }
        }

        // Load Hero
        const heroRes = await fetch("/api/content/hero");
        if (heroRes.ok) {
          const heroData = await heroRes.json();
          if (heroData) {
            setHero({
              headline: heroData.headline || defaultHero.headline,
              subheadline: heroData.subheadline || defaultHero.subheadline,
              description: heroData.description || defaultHero.description,
              ctaPrimary: heroData.cta_primary || defaultHero.ctaPrimary,
              ctaSecondary: heroData.cta_secondary || defaultHero.ctaSecondary,
            });
          }
        }

        // Load Core Values
        const coreValuesRes = await fetch("/api/content/core-values");
        if (coreValuesRes.ok) {
          const coreValuesData = await coreValuesRes.json();
          if (coreValuesData && coreValuesData.length > 0) {
            setCoreValues(
              coreValuesData.map((v: any) => ({
                // Only keep icon if it's an uploaded image (data URL), otherwise use empty to trigger SVG lookup
                icon: v.icon && v.icon.startsWith("data:image") ? v.icon : (v.icon || ""),
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
          const aboutData = await aboutRes.json();
          if (aboutData) {
            setAbout({
              description: aboutData.description || defaultAbout.description,
              mission: aboutData.mission || defaultAbout.mission,
              vision: aboutData.vision || defaultAbout.vision,
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
            setTeam(
              teamData.map((t: any) => ({
                name: t.name,
                role: t.role,
                icon: t.icon,
                bio: t.bio,
                skills: t.skills || [],
                experience: t.experience,
                email: t.email,
                projects: t.projects || [],
              }))
            );
          }
        }

        // Load Projects
        const projectsRes = await fetch("/api/content/projects");
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (projectsData && projectsData.length > 0) {
            setProjects(projectsData);
          }
        }

        // Load Testimonials
        const testimonialsRes = await fetch("/api/content/testimonials");
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json();
          if (testimonialsData && testimonialsData.length > 0) {
            setTestimonials(testimonialsData);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setStatus("Error loading data. Using defaults.");
        setTimeout(() => setStatus(""), 3000);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    clearSession();
    // Clear URL parameters on logout
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/admin");
    }
    router.push("/admin");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const testDatabaseConnection = async () => {
    setDbConnectionStatus({ connected: false, message: "Testing...", loading: true });
    try {
      const response = await fetch("/api/test-connection");
      const data = await response.json();
      
      if (data.connected) {
        setDbConnectionStatus({
          connected: true,
          message: "Database connected successfully!",
          loading: false,
        });
      } else {
        setDbConnectionStatus({
          connected: false,
          message: data.error || "Connection failed",
          loading: false,
        });
      }
    } catch (error: any) {
      setDbConnectionStatus({
        connected: false,
        message: `Error: ${error.message}`,
        loading: false,
      });
    }
  };

  const handleFileUpload = (file: File, callback: (url: string) => void) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        callback(result);
      };
      reader.readAsDataURL(file);
    } else {
      setStatus("Please upload a valid image file");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const navItems = [
    { id: "overview" as TabType, label: "Overview", icon: OverviewIcon },
    { id: "header" as TabType, label: "Header & Hero", icon: TargetIcon },
    { id: "core-values" as TabType, label: "Core Values", icon: StarIcon },
    { id: "about" as TabType, label: "About Us", icon: BookIcon },
    { id: "services" as TabType, label: "Services", icon: ServicesIcon },
    { id: "team" as TabType, label: "Team", icon: UsersIcon },
    { id: "projects" as TabType, label: "Projects", icon: BriefcaseIcon },
    { id: "testimonials" as TabType, label: "Testimonials", icon: ChatIcon },
    { id: "settings" as TabType, label: "Settings", icon: SettingsIcon },
  ];

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-cyan-500/30 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-300 text-lg font-medium">Verifying authentication...</p>
          <div className="mt-4 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950 text-white flex relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        } glass-strong border-r border-white/10 transition-all duration-300 flex flex-col fixed h-screen z-40 left-0 top-0 shadow-2xl`}
      >
        {/* Logo/Header */}
        <div className={`p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} min-h-[90px] relative overflow-hidden`}>
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-30"></div>
          
          {sidebarOpen && (
            <div className="flex items-center gap-3 flex-1 min-w-0 relative z-10">
              <div className="relative flex-shrink-0 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/50 animate-glow group-hover:scale-110 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">U4</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-950 shadow-lg animate-pulse"></div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-xl -z-10"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent truncate">
                  Dashboard
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">Admin Panel</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/50 animate-glow group-hover:scale-110 transition-transform duration-300">
                <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">U4</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-950 shadow-lg animate-pulse"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-xl -z-10"></div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 flex-shrink-0 text-gray-300 hover:text-white hover:scale-110 md:flex hidden backdrop-blur-sm border border-white/5 hover:border-white/20"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? "justify-start" : "justify-center"} gap-3 px-4 md:px-5 py-3 md:py-3.5 rounded-xl transition-all duration-300 ease-out transform relative group ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-blue-500/20 border border-blue-400/30 text-blue-300 scale-[1.02] shadow-lg shadow-blue-500/30 backdrop-blur-sm"
                  : "hover:bg-white/5 text-gray-300 hover:text-white hover:scale-[1.01] active:scale-[0.98] border border-transparent hover:border-white/10"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Active indicator */}
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full"></div>
              )}
              
              <span className={`flex-shrink-0 transition-all duration-300 relative z-10 ${
                activeTab === item.id 
                  ? "scale-110 text-blue-300" 
                  : "group-hover:scale-110 group-hover:text-white"
              }`}>
                <item.icon />
              </span>
              {sidebarOpen && (
                <span className={`text-sm md:text-base font-medium transition-all duration-300 truncate relative z-10 ${
                  activeTab === item.id 
                    ? "font-semibold text-blue-200" 
                    : "group-hover:text-white"
                }`}>
                  {item.label}
                </span>
              )}
              
              {/* Hover glow effect */}
              {activeTab === item.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-xl -z-10"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 md:p-4 border-t border-white/10 flex-shrink-0 bg-gradient-to-t from-red-500/5 to-transparent">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start" : "justify-center"} gap-3 px-4 md:px-5 py-3 md:py-3.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/30 group backdrop-blur-sm`}
          >
            <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              <LogoutIcon />
            </span>
            {sidebarOpen && <span className="text-sm md:text-base font-medium truncate group-hover:text-red-300">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-3.5 glass-strong border border-white/20 rounded-xl text-white md:hidden shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 hover:border-blue-400/50 group"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
        </button>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 min-w-0 overflow-x-hidden ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {/* Top Bar */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
            <div className={`transition-all duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <div className="w-1.5 h-10 bg-gradient-to-b from-blue-400 via-cyan-400 to-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  <div className="absolute inset-0 w-1.5 h-10 bg-gradient-to-b from-blue-400 via-cyan-400 to-blue-500 rounded-full blur-md opacity-50"></div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent transition-all duration-300">
                    {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 font-medium">Manage your landing page content and settings</p>
                </div>
              </div>
            </div>
            {status && (
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm animate-scale-in backdrop-blur-sm shadow-lg shadow-green-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{status}</span>
              </div>
            )}
          </div>

          {/* Content with smooth transitions */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Published Services", value: services.length, iconColor: "blue", color: "from-blue-500 to-cyan-500" },
                    { label: "Team Members", value: team.length, iconColor: "purple", color: "from-purple-500 to-pink-500" },
                    { label: "Featured Projects", value: projects.length, iconColor: "green", color: "from-green-500 to-emerald-500" },
                    { label: "Testimonials", value: testimonials.length, iconColor: "orange", color: "from-orange-500 to-red-500" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="group bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <MetricsIcon color={metric.iconColor} />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{metric.label}</p>
                      <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                      <p className="text-xs text-gray-500">Active items</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="glass-strong rounded-2xl p-6 lg:p-8 border border-white/10 relative overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent"></div>
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-1">Quick Actions</h3>
                      <p className="text-sm text-gray-400 font-medium">Navigate to content sections</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                    {[
                      { label: "Edit Header & Hero", tab: "header" as TabType, icon: TargetIcon, gradient: "from-blue-500 to-cyan-500" },
                      { label: "Update Core Values", tab: "core-values" as TabType, icon: StarIcon, gradient: "from-purple-500 to-pink-500" },
                      { label: "Manage Services", tab: "services" as TabType, icon: ServicesIcon, gradient: "from-green-500 to-emerald-500" },
                      { label: "Update Team", tab: "team" as TabType, icon: UsersIcon, gradient: "from-orange-500 to-red-500" },
                    ].map((action) => (
                      <button
                        key={action.tab}
                        onClick={() => handleTabChange(action.tab)}
                        className="group relative flex items-center gap-3 p-5 glass border border-white/10 rounded-xl hover:border-white/30 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 text-left hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Hover gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg relative z-10`}>
                          <action.icon />
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${action.gradient} blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                        </div>
                        <span className="font-semibold text-sm relative z-10 group-hover:text-white transition-colors duration-300">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Header & Hero Tab */}
            {activeTab === "header" && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-700/30">
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-1 text-white">Header Content</h3>
                      <p className="text-sm text-gray-400">Update company name and tagline</p>
                    </div>
                    <button
                      onClick={() => handleSave("Header")}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <SaveIcon />
                      <span>Save Header</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Logo</label>
                      <div className="space-y-3">
                        {header.logo && (header.logo.startsWith("data:image") || header.logo.startsWith("http") || header.logo.startsWith("/")) ? (
                          <div className="relative">
                            <img
                              src={header.logo}
                              alt="Company Logo"
                              className="w-32 h-32 object-contain bg-gray-900/50 border border-gray-700/50 rounded-xl p-2"
                              onError={(e) => {
                                // If image fails to load, show placeholder
                                e.currentTarget.style.display = 'none';
                                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }}
                            />
                            <div className="w-32 h-32 bg-gray-900/50 border border-gray-700/50 rounded-xl flex items-center justify-center text-gray-500 text-sm" style={{ display: 'none' }}>
                              Invalid image
                            </div>
                            <button
                              type="button"
                              onClick={() => setHeader({ ...header, logo: "" })}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-gray-900/50 border border-gray-700/50 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                            No logo
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, (url) => {
                                setHeader({ ...header, logo: url });
                              });
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500">Upload a logo image (PNG, JPG, SVG recommended). When a logo is uploaded, it will replace the company name in the hero section header.</p>
                        <div className="mt-2">
                          <label className="block text-xs font-medium text-gray-400 mb-1">Or enter image URL:</label>
                          <input
                            type="text"
                            placeholder="https://example.com/logo.png"
                            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            value={header.logo && !header.logo.startsWith("data:image") ? header.logo : ""}
                            onChange={(e) => {
                              const url = e.target.value.trim();
                              if (url) {
                                setHeader({ ...header, logo: url });
                              } else if (!header.logo || !header.logo.startsWith("data:image")) {
                                setHeader({ ...header, logo: "" });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                      <input
                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        value={header.companyName}
                        onChange={(e) => setHeader({ ...header, companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                      <input
                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        value={header.tagline}
                        onChange={(e) => setHeader({ ...header, tagline: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-700/30">
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-1 text-white">Hero Section</h3>
                      <p className="text-sm text-gray-400">Update main hero content and CTAs</p>
                    </div>
                    <button
                      onClick={() => handleSave("Hero Section")}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                      <SaveIcon />
                      <span>Save Hero</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Headline</label>
                      <input
                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        value={hero.headline}
                        onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subheadline</label>
                      <input
                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        value={hero.subheadline}
                        onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        rows={4}
                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                        value={hero.description}
                        onChange={(e) => setHero({ ...hero, description: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Primary CTA Button</label>
                        <input
                          className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          value={hero.ctaPrimary}
                          onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Secondary CTA Button</label>
                        <input
                          className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          value={hero.ctaSecondary}
                          onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Core Values Tab */}
            {activeTab === "core-values" && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-700/30">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1 text-white">Core Values</h3>
                    <p className="text-sm text-gray-400">Update your company's core values</p>
                  </div>
                  <button
                    onClick={() => handleSave("Core Values")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    <SaveIcon />
                    <span>Save Core Values</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coreValues.map((value, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <label className="block text-xs text-gray-400 mb-2">Icon</label>
                          <IconPicker
                            selectedIconId={value.icon && !value.icon.startsWith("data:image") ? value.icon : null}
                            onSelect={(iconId) => {
                              const updated = [...coreValues];
                              updated[idx].icon = iconId;
                              setCoreValues(updated);
                            }}
                            gradientColor={value.color}
                          />
                          <p className="mt-2 text-xs text-gray-500">Select a next-generation icon</p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="w-full bg-transparent border-b border-gray-700/50 pb-2 text-xl font-semibold focus:outline-none focus:border-blue-500/50 transition-colors"
                            value={value.title}
                            onChange={(e) => {
                              const updated = [...coreValues];
                              updated[idx].title = e.target.value;
                              setCoreValues(updated);
                            }}
                            placeholder="Value Title"
                          />
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        className="w-full bg-transparent text-sm text-gray-300 focus:outline-none resize-none border border-gray-700/30 rounded-lg p-3 focus:border-blue-500/50 transition-colors"
                        value={value.desc}
                        onChange={(e) => {
                          const updated = [...coreValues];
                          updated[idx].desc = e.target.value;
                          setCoreValues(updated);
                        }}
                        placeholder="Value description"
                      ></textarea>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Gradient Color</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={value.color}
                          onChange={(e) => {
                            const updated = [...coreValues];
                            updated[idx].color = e.target.value;
                            setCoreValues(updated);
                          }}
                          placeholder="from-blue-600 to-blue-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Us Tab */}
            {activeTab === "about" && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-700/30">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1 text-white">About Us Section</h3>
                    <p className="text-sm text-gray-400">Update About Us, Mission, and Vision content</p>
                  </div>
                  <button
                    onClick={() => handleSave("About Us")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    <SaveIcon />
                    <span>Save About Us</span>
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">About Us Description</label>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                      value={about.description}
                      onChange={(e) => setAbout({ ...about, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mission Statement</label>
                    <textarea
                      rows={5}
                      className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                      value={about.mission}
                      onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Vision Statement</label>
                    <textarea
                      rows={5}
                      className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                      value={about.vision}
                      onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-700/30">
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-1 text-white">Services Management</h3>
                      <p className="text-sm text-gray-400">Add, edit, or remove services from your landing page</p>
                    </div>
                      <button
                        onClick={() => handleSave("Services")}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                      >
                        <SaveIcon />
                        <span>Save All Services</span>
                      </button>
                  </div>
                  <div className="space-y-4">
                    {services.map((service, idx) => (
                      <div key={idx} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Icon</label>
                            <IconPicker
                              selectedIconId={service.icon && !service.icon.startsWith("data:image") ? service.icon : null}
                              onSelect={(iconId) => {
                                const updated = [...services];
                                updated[idx].icon = iconId;
                                setServices(updated);
                              }}
                              gradientColor="from-blue-600 to-purple-600"
                            />
                            <p className="mt-2 text-xs text-gray-500">Select a next-generation icon</p>
                            {service.icon && service.icon.startsWith("data:image") && (
                              <button
                                onClick={() => {
                                  const updated = [...services];
                                  updated[idx].icon = "";
                                  setServices(updated);
                                }}
                                className="mt-2 text-xs text-red-400 hover:text-red-300"
                              >
                                Remove uploaded image
                              </button>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Title</label>
                            <input
                              type="text"
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              value={service.title}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[idx].title = e.target.value;
                                setServices(updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Description</label>
                            <input
                              type="text"
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              value={service.desc}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[idx].desc = e.target.value;
                                setServices(updated);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-2">Features (one per line)</label>
                          <textarea
                            rows={6}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y text-white placeholder-gray-500 whitespace-pre-wrap"
                            value={service.features.join("\n")}
                            onChange={(e) => {
                              const updated = [...services];
                              // Split by newline and keep all lines (including empty ones for spacing)
                              updated[idx].features = e.target.value.split("\n");
                              setServices(updated);
                            }}
                            onKeyDown={(e) => {
                              // Allow Enter key to create new lines
                              if (e.key === "Enter") {
                                e.stopPropagation();
                              }
                            }}
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            style={{ whiteSpace: "pre-wrap" }}
                          ></textarea>
                          <p className="mt-1 text-xs text-gray-500">Press Enter to create a new line</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setServices([
                        ...services,
                        { title: "New Service", desc: "Service description", icon: "", features: [] },
                      ]);
                    }}
                    className="mt-4 w-full bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-xl py-3 font-medium transition-all duration-200"
                  >
                    + Add New Service
                  </button>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === "team" && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-700/30">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1 text-white">Team Directory</h3>
                    <p className="text-sm text-gray-400">Manage team member information</p>
                  </div>
                  <button
                    onClick={() => handleSave("Team")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    <SaveIcon />
                    <span>Save Team Info</span>
                  </button>
                </div>
                <div className="space-y-6">
                  {team.map((member, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Icon/Photo</label>
                          <div className="space-y-2">
                            <div className="w-20 h-20 bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center">
                              {member.icon && member.icon.startsWith("data:image") ? (
                                <img src={member.icon} alt="Member" className="w-full h-full object-cover" />
                              ) : member.icon ? (
                                <span className="text-2xl">{member.icon}</span>
                              ) : (
                                <span className="text-gray-500 text-xs">No icon</span>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, (url) => {
                                    const updated = [...team];
                                    updated[idx].icon = url;
                                    setTeam(updated);
                                  });
                                }
                              }}
                            />
                            {member.icon && member.icon.startsWith("data:image") && (
                              <button
                                onClick={() => {
                                  const updated = [...team];
                                  updated[idx].icon = "";
                                  setTeam(updated);
                                }}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Name</label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[idx].name = e.target.value;
                              setTeam(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Role</label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={member.role}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[idx].role = e.target.value;
                              setTeam(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Email</label>
                          <input
                            type="email"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={member.email}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[idx].email = e.target.value;
                              setTeam(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Experience</label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={member.experience}
                            onChange={(e) => {
                              const updated = [...team];
                              updated[idx].experience = e.target.value;
                              setTeam(updated);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Bio</label>
                        <textarea
                          rows={3}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                          value={member.bio}
                          onChange={(e) => {
                            const updated = [...team];
                            updated[idx].bio = e.target.value;
                            setTeam(updated);
                          }}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Skills (comma separated)</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={member.skills.join(", ")}
                          onChange={(e) => {
                            const updated = [...team];
                            updated[idx].skills = e.target.value.split(",").map((s) => s.trim()).filter((s) => s);
                            setTeam(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Projects (one per line)</label>
                        <textarea
                          rows={3}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                          value={member.projects.join("\n")}
                          onChange={(e) => {
                            const updated = [...team];
                            updated[idx].projects = e.target.value.split("\n").filter((p) => p.trim());
                            setTeam(updated);
                          }}
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Featured Projects</h3>
                    <p className="text-gray-400">Manage featured projects showcase</p>
                  </div>
                  <button
                    onClick={() => handleSave("Projects")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    <SaveIcon />
                    <span>Save Projects</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-5 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Title</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={project.title}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[idx].title = e.target.value;
                            setProjects(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Category</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={project.category}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[idx].category = e.target.value;
                            setProjects(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Gradient Color</label>
                        <input
                          type="text"
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          value={project.color}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[idx].color = e.target.value;
                            setProjects(updated);
                          }}
                          placeholder="from-purple-500/20 to-pink-500/20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setProjects([...projects, { title: "New Project", category: "Category", color: "from-gray-500/20 to-gray-600/20" }]);
                  }}
                  className="mt-4 w-full bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-xl py-3 font-medium transition-all duration-200"
                >
                  + Add New Project
                </button>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === "testimonials" && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Client Testimonials</h3>
                    <p className="text-gray-400">Manage client success stories and testimonials</p>
                  </div>
                  <button
                    onClick={() => handleSave("Testimonials")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    <SaveIcon />
                    <span>Save Testimonials</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Avatar Photo</label>
                          <div className="space-y-2">
                            <div className="w-16 h-16 bg-gray-800/50 border border-gray-700/50 rounded-full overflow-hidden flex items-center justify-center">
                              {testimonial.avatar && testimonial.avatar.startsWith("data:image") ? (
                                <img src={testimonial.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              ) : testimonial.avatar ? (
                                <span className="text-2xl">{testimonial.avatar}</span>
                              ) : (
                                <span className="text-gray-500 text-xs">No photo</span>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, (url) => {
                                    const updated = [...testimonials];
                                    updated[idx].avatar = url;
                                    setTestimonials(updated);
                                  });
                                }
                              }}
                            />
                            {testimonial.avatar && testimonial.avatar.startsWith("data:image") && (
                              <button
                                onClick={() => {
                                  const updated = [...testimonials];
                                  updated[idx].avatar = "";
                                  setTestimonials(updated);
                                }}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Name</label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={testimonial.name}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[idx].name = e.target.value;
                              setTestimonials(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Role</label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={testimonial.role}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[idx].role = e.target.value;
                              setTestimonials(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Company</label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={testimonial.company}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[idx].company = e.target.value;
                              setTestimonials(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Result</label>
                          <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={testimonial.result}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[idx].result = e.target.value;
                              setTestimonials(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Rating</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={testimonial.rating}
                            onChange={(e) => {
                              const updated = [...testimonials];
                              updated[idx].rating = parseInt(e.target.value) || 5;
                              setTestimonials(updated);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Quote</label>
                        <textarea
                          rows={3}
                          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                          value={testimonial.quote}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].quote = e.target.value;
                            setTestimonials(updated);
                          }}
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setTestimonials([
                      ...testimonials,
                      {
                        name: "New Client",
                        role: "Role",
                        company: "Company",
                        quote: "Testimonial quote",
                        rating: 5,
                        result: "Result",
                        avatar: "👤",
                      },
                    ]);
                  }}
                  className="mt-4 w-full bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-xl py-3 font-medium transition-all duration-200"
                >
                  + Add New Testimonial
                </button>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Settings</h3>
                <div className="space-y-6">
                  {/* Database Connection Status */}
                  <div className="p-6 bg-gray-900/50 border border-gray-700/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-lg">Database Connection</h4>
                        <p className="text-gray-400 text-sm">
                          Test your Supabase database connection and verify data flow
                        </p>
                      </div>
                      <button
                        onClick={testDatabaseConnection}
                        disabled={dbConnectionStatus.loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        {dbConnectionStatus.loading ? "Testing..." : "Test Connection"}
                      </button>
                    </div>
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/30">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            dbConnectionStatus.connected
                              ? "bg-green-500 animate-pulse"
                              : dbConnectionStatus.loading
                              ? "bg-yellow-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              dbConnectionStatus.connected
                                ? "text-green-400"
                                : dbConnectionStatus.loading
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {dbConnectionStatus.message}
                          </p>
                          {dbConnectionStatus.connected && (
                            <p className="text-xs text-gray-500 mt-1">
                              ✓ Changes made in the dashboard will be saved to the database
                              <br />
                              ✓ The landing page will automatically reflect these changes
                            </p>
                          )}
                          {!dbConnectionStatus.connected && !dbConnectionStatus.loading && (
                            <p className="text-xs text-gray-500 mt-1">
                              Make sure your Supabase environment variables are configured correctly
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900/50 border border-gray-700/30 rounded-xl">
                    <h4 className="font-semibold mb-2">Account Settings</h4>
                    <p className="text-gray-400 text-sm">Manage your admin account preferences</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 border border-gray-700/30 rounded-xl">
                    <h4 className="font-semibold mb-2">Site Configuration</h4>
                    <p className="text-gray-400 text-sm">Configure site-wide settings and preferences</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={cancelLogout}
        >
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <LogoutIcon />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Confirm Logout</h3>
                <p className="text-sm text-gray-400">Are you sure you want to sign out?</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              You will need to sign in again to access the dashboard. Any unsaved changes will be lost.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 rounded-xl text-white font-medium transition-all duration-200 hover:border-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

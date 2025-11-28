"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const defaultHero = {
  headline: "We Build Solutions That Drive Results",
  subheadline: "Connecting Businesses • Delivering Excellence • Building Success",
  description:
    "United4ContactSolutions delivers comprehensive virtual assistance and customer support services that empower businesses to operate efficiently, scale confidently, and achieve sustainable growth through professional, reliable, and innovative solutions.",
};

const defaultServices = [
  { title: "General Virtual Assistance", desc: "Comprehensive support for daily operations" },
  { title: "Marketing & Content", desc: "Strategic content planning and execution" },
  { title: "E-Commerce & Retail", desc: "Storefront management and customer care" },
];

const defaultTeam = [
  { name: "Niño Nesperos", role: "CEO & Founder", email: "nino.nesperos@united4contactsolutions.com" },
  { name: "Jason Pada", role: "IT General Services", email: "jason.pada@united4contactsolutions.com" },
  { name: "Louis Gascon", role: "Customer Expert Support", email: "louis.gascon@united4contactsolutions.com" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [hero, setHero] = useState(defaultHero);
  const [services, setServices] = useState(defaultServices);
  const [team, setTeam] = useState(defaultTeam);
  const [newService, setNewService] = useState({ title: "", desc: "" });
  const [status, setStatus] = useState("");

  const handleHeroChange = (field: keyof typeof hero, value: string) => {
    setHero((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddService = () => {
    if (!newService.title.trim()) return;
    setServices((prev) => [...prev, newService]);
    setNewService({ title: "", desc: "" });
  };

  const handleSave = (section: string) => {
    setStatus(`Saving ${section}...`);
    setTimeout(() => setStatus(`${section} saved (demo only)`), 800);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-blue-400 uppercase tracking-[0.4em]">Admin Panel</p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Manage Landing Page Content</h1>
            <p className="text-gray-400 mt-2">
              Update hero messaging, services, and team information. Hook up these actions to your CMS or API when ready.
            </p>
            {status && <p className="text-xs text-blue-300 mt-2">{status}</p>}
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="self-start md:self-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 text-sm transition"
          >
            Logout
          </button>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Published Services", value: services.length },
            { label: "Team Members", value: team.length },
            { label: "Hero CTA Clicks", value: "1,284" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Hero editor */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Hero Section</p>
              <h2 className="text-xl font-semibold">Update Hero Messaging</h2>
            </div>
            <button onClick={() => handleSave("Hero Section")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
              Save Hero Content
            </button>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-gray-300">Headline</label>
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
              value={hero.headline}
              onChange={(e) => handleHeroChange("headline", e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-gray-300">Subheadline</label>
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
              value={hero.subheadline}
              onChange={(e) => handleHeroChange("subheadline", e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
              value={hero.description}
              onChange={(e) => handleHeroChange("description", e.target.value)}
            ></textarea>
          </div>
        </section>

        {/* Services manager */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Services</p>
              <h2 className="text-xl font-semibold">Manage Services & Features</h2>
            </div>
            <button onClick={() => handleSave("Services")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
              Save Services
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, idx) => (
              <div key={`${service.title}-${idx}`} className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
                <input
                  className="w-full bg-transparent border-b border-white/10 pb-1 text-lg font-semibold"
                  value={service.title}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[idx].title = e.target.value;
                    setServices(updated);
                  }}
                />
                <textarea
                  rows={3}
                  className="w-full bg-transparent text-sm text-gray-300"
                  value={service.desc}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[idx].desc = e.target.value;
                    setServices(updated);
                  }}
                ></textarea>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-3"
              placeholder="New service title"
              value={newService.title}
              onChange={(e) => setNewService((prev) => ({ ...prev, title: e.target.value }))}
            />
            <input
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-3"
              placeholder="Short description"
              value={newService.desc}
              onChange={(e) => setNewService((prev) => ({ ...prev, desc: e.target.value }))}
            />
            <button
              type="button"
              onClick={handleAddService}
              className="sm:col-span-2 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2"
            >
              Add Service
            </button>
          </div>
        </section>

        {/* Team manager */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Team</p>
              <h2 className="text-xl font-semibold">Team Directory</h2>
            </div>
            <button onClick={() => handleSave("Team")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
              Save Team Info
            </button>
          </div>
          <div className="space-y-4">
            {team.map((member, idx) => (
              <div key={member.email} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/40 border border-white/10 rounded-xl p-4">
                <input
                  className="bg-transparent border-b border-white/10 pb-1 text-white"
                  value={member.name}
                  onChange={(e) => {
                    const updated = [...team];
                    updated[idx].name = e.target.value;
                    setTeam(updated);
                  }}
                />
                <input
                  className="bg-transparent border-b border-white/10 pb-1 text-white"
                  value={member.role}
                  onChange={(e) => {
                    const updated = [...team];
                    updated[idx].role = e.target.value;
                    setTeam(updated);
                  }}
                />
                <input
                  className="bg-transparent border-b border-white/10 pb-1 text-white"
                  value={member.email}
                  onChange={(e) => {
                    const updated = [...team];
                    updated[idx].email = e.target.value;
                    setTeam(updated);
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

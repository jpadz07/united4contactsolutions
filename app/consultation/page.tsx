"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsultationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hearAbout: "",
    consent: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would send the data to your backend/API
      // const response = await fetch("/api/consultation", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      setSubmitStatus({
        type: "success",
        message: "Thank you! We've received your consultation request. Our team will contact you within 24 hours.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        hearAbout: "",
        consent: false,
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1021] text-white">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        type="button"
        className="fixed top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all duration-200 group backdrop-blur-sm z-50 shadow-lg hover:shadow-xl cursor-pointer"
        style={{ pointerEvents: "auto" }}
      >
        <svg
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Back to Home</span>
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left visual panel */}
        <div className="relative lg:w-2/5 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white overflow-hidden flex items-center justify-center px-6 py-12">
          <div className="absolute inset-0 opacity-60">
            {[120, 220, 320, 420].map((size, i) => (
              <div
                key={size}
                className="absolute rounded-full border border-white/10"
                style={{
                  width: `${size}%`,
                  height: `${size}%`,
                  top: `${50 - size / 2}%`,
                  left: `${50 - size / 2}%`,
                  opacity: 0.5 - i * 0.08,
                }}
              />
            ))}
          </div>
          {/* Floating nodes */}
          <div className="relative w-full max-w-xl h-[520px]">
            {[
              { top: "10%", left: "18%", color: "from-cyan-400 to-blue-500" },
              { top: "28%", left: "55%", color: "from-purple-400 to-indigo-500" },
              { top: "42%", left: "24%", color: "from-teal-400 to-cyan-500" },
              { top: "60%", left: "68%", color: "from-blue-400 to-purple-500" },
              { top: "72%", left: "34%", color: "from-emerald-400 to-teal-500" },
              { top: "18%", left: "78%", color: "from-sky-400 to-cyan-500" },
              { top: "50%", left: "85%", color: "from-pink-400 to-purple-500" },
            ].map((dot, idx) => (
              <div
                key={idx}
                className="absolute w-14 h-14 rounded-full shadow-lg shadow-black/30 border border-white/10 overflow-hidden"
                style={{ top: dot.top, left: dot.left }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${dot.color} flex items-center justify-center text-white font-semibold`}>
                  U4
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 left-6 text-sm text-white/60 space-y-2 hidden sm:block">
            <div className="font-semibold text-white/80">United4ContactSolutions</div>
            <div className="space-y-1">
              <div>Facebook • LinkedIn • Instagram • X</div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="lg:w-3/5 bg-gradient-to-b from-[#0f172a] via-[#0b1021] to-black text-white flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-3xl space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-wide text-blue-300 mb-2">Book a consultation</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Let’s design your support plan</h1>
              <p className="text-base text-white/70">
                Share what you need—team size, timelines, and channels—and we’ll tailor a plan within 24 hours.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-blue-900/30 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 text-sm text-white">
                {/* Row: first + last name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block font-semibold mb-2">First name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block font-semibold mb-2">Last name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Row: email + phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block font-semibold mb-2">Email address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block font-semibold mb-2">Phone number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-semibold mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                {/* How did you hear + consent */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="hearAbout" className="block font-semibold mb-2">How did you hear about us?</label>
                    <select
                      id="hearAbout"
                      name="hearAbout"
                      value={formData.hearAbout}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                    >
                      <option value="">Select an option</option>
                      <option value="referral">Referral</option>
                      <option value="social">Social media</option>
                      <option value="search">Search engine</option>
                      <option value="event">Event / webinar</option>
                      <option value="ad">Online ad</option>
                      <option value="newsletter">Newsletter / email</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <label className="flex items-start gap-3 text-white/80 text-sm">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-white/5 text-cyan-400 focus:ring-cyan-500/40"
                    />
                    <span>
                      Yes, I agree to be contacted and receive helpful emails and understand I can unsubscribe at anytime.
                    </span>
                  </label>
                </div>

                {/* Submit Status */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-xl border ${
                      submitStatus.type === "success"
                        ? "bg-emerald-500/10 border-emerald-400/40 text-emerald-200"
                        : "bg-rose-500/10 border-rose-400/40 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {submitStatus.type === "success" ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 text-white font-semibold rounded-xl py-4 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Send message"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, Users, Clock, ChevronRight, AlertCircle, Star, Mail, MessageCircle, Send, FileText } from "lucide-react";
import { getDefaultSiteSettings, loadSiteSettings } from "@/lib/siteSettings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatCard from "@/components/features/StatCard";
import CommissionCalculator from "@/components/features/CommissionCalculator";
import SeatCounter from "@/components/features/SeatCounter";
import CommunityPieChart from "@/components/features/CommunityPieChart";
import LiveMarketChart from "@/components/features/LiveMarketChart";
import WhatsAppButton from "@/components/features/WhatsAppButton";
import WelcomeModal from "@/components/features/WelcomeModal";
import TermsModal from "@/components/features/TermsModal";
import { PLAN_STATS, TERMS, COMMISSION_STRUCTURE } from "@/constants";
import heroMoneyTree from "@/assets/hero-money-tree.png";

const WHATSAPP_MSG = encodeURIComponent("Hi, I would Like to invest in the OTI, Can I get the details Regarding to this");

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [siteSettings, setSiteSettings] = useState(getDefaultSiteSettings());

  useEffect(() => {
    let isMounted = true;

    const syncSiteSettings = async () => {
      const settings = await loadSiteSettings();
      if (isMounted) {
        setSiteSettings(settings);
      }
    };

    void syncSiteSettings();

    const seen = localStorage.getItem("oti_welcomed");
    if (!seen) {
      const t = setTimeout(() => setShowWelcome(true), 600);
      return () => {
        isMounted = false;
        clearTimeout(t);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: "", message: "" });
    setTimeout(() => setContactSent(false), 4000);
  };
  return (
    <div className="min-h-screen bg-background">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroMoneyTree})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/75 to-navy-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 text-gold text-sm font-medium mb-8">
              <Star size={14} fill="currentColor" />
              {siteSettings.heroBadge}
              <Star size={14} fill="currentColor" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">{siteSettings.heroTitle.split(". ")[0] + "."}</span>
              <br />
              <span className="gold-text">{siteSettings.heroTitle.split(". ")[1] || siteSettings.heroTitle}</span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {siteSettings.heroSubtitle}
            </p>

            {/* Feature Pills */}
            <div className="space-y-3 mb-8">
              {[
                { icon: Shield, label: "Secure", sub: "Your Future" },
                { icon: TrendingUp, label: "Long-Term", sub: "Growth" },
                { icon: Users, label: "Limited", sub: "Seats" },
                { icon: Clock, label: "Legal", sub: "Agreement" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-gold/30 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm leading-tight">{label}</p>
                    <p className="text-muted-foreground text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seat Counter - urgency element */}
            <SeatCounter />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                to="/apply"
                className="px-8 py-4 gold-gradient text-navy-dark font-bold rounded text-base hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-gold/25"
              >
                {siteSettings.heroPrimaryCta} <ChevronRight size={18} />
              </Link>
              <a
                href="#plan-details"
                className="px-8 py-4 border border-gold/40 text-gold font-semibold rounded text-base hover:bg-gold/10 transition-colors"
              >
                {siteSettings.heroSecondaryCta}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="bg-navy-dark/90 backdrop-blur-sm border-t border-gold/15">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
              {[
                { icon: Clock, label: "10+ Years", sub: "Year Horizon" },
                { icon: Users, label: "6,000", sub: "Seats Only" },
                { icon: Shield, label: "Legal", sub: "Agreement" },
                { icon: TrendingUp, label: "Long-Term", sub: "Growth" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={sub} className="flex items-center gap-3 py-4 px-4 sm:px-6">
                  <Icon size={18} className="text-gold flex-shrink-0" />
                  <div>
                    <p className="text-foreground font-bold text-sm">{label}</p>
                    <p className="text-muted-foreground text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="plan-details" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Investment Overview</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Plan at a Glance</h2>
          <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PLAN_STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </section>

      {/* Commission Section */}
      <section className="py-16 px-4 sm:px-6 bg-navy-light/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Earnings Structure</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Commission Plan</h2>
            <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {COMMISSION_STRUCTURE.map((item) => (
              <div
                key={item.role}
                className={`navy-card rounded-lg p-6 ${
                  item.color === "gold"
                    ? "border-gold/40 bg-gold/5"
                    : "border-blue-500/30 bg-blue-500/5"
                }`}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  item.color === "gold"
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}>
                  {item.role}
                </div>
                <p className={`font-serif text-5xl font-bold mb-3 ${
                  item.color === "gold" ? "gold-text" : "text-blue-400"
                }`}>
                  {item.rate}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Process</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">How It Works</h2>
          <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Apply", desc: "Fill in your personal, KYC, and nominee details to secure your seat." },
            { step: "02", title: "Invest", desc: "Transfer ₹50,000 and receive your allocation of 160 shares." },
            { step: "03", title: "Grow", desc: "Mr. Manoj manages your shares for a minimum period of 10 years." },
            { step: "04", title: "Earn", desc: "On maturity, receive proceeds minus the agreed 20% commission." },
          ].map((item) => (
            <div key={item.step} className="text-center group">
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-gold/40 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                <span className="gold-text font-serif font-bold text-lg">{item.step}</span>
              </div>
              <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {siteSettings.showCommissionSection && <CommissionCalculator />}

      {siteSettings.showMarketChartSection && <LiveMarketChart />}

      {siteSettings.showCommunitySection && <CommunityPieChart />}

      {siteSettings.showTermsSection && (
        <section className="py-16 px-4 sm:px-6 bg-navy-light/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Legal</p>
              <h2 className="font-serif text-3xl font-bold">Terms & Conditions</h2>
              <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
            </div>
            <div className="navy-card rounded-lg p-6 sm:p-8 space-y-4 border-gold/20">
              {TERMS.slice(0, 5).map((term) => (
                term.highlight ? (
                  <div key={term.id} className="flex gap-3 p-3 rounded border border-gold/40 bg-gold/10">
                    <AlertCircle size={15} className="text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-gold text-sm font-bold leading-relaxed">{term.text}</p>
                  </div>
                ) : (
                  <div key={term.id} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center text-gold text-xs font-bold mt-0.5">
                      {term.id}
                    </span>
                    <p className="text-muted-foreground text-sm leading-relaxed">{term.text}</p>
                  </div>
                )
              ))}
              <div className="pt-2 border-t border-border text-center">
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-gold text-sm hover:underline font-medium flex items-center justify-center gap-1 mx-auto"
                >
                  <FileText size={14} /> View all {TERMS.length} terms & conditions <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {siteSettings.showContactSection && (
        <section id="contact" className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Get In Touch</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">Contact Us</h2>
              <p className="text-muted-foreground text-sm mt-3">Have questions? Reach out to us directly.</p>
              <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="navy-card rounded-xl p-6 border-gold/20">
                  <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-5">Direct Contact</p>
                  <div className="space-y-4">
                    <a
                      href={`mailto:${siteSettings.contactEmail}`}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-gold/30 hover:bg-gold/5 transition-all group"
                    >
                      <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail size={16} className="text-navy-dark" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">Email</p>
                        <p className="text-foreground font-semibold text-sm group-hover:text-gold transition-colors">{siteSettings.contactEmail}</p>
                      </div>
                    </a>

                    <a
                      href={`https://wa.me/${siteSettings.whatsappContact}?text=${WHATSAPP_MSG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#25D366" }}>
                        <MessageCircle size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">WhatsApp</p>
                        <p className="text-emerald-400 font-semibold">Chat with Co-Applicant Mr. Manoj</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded border border-border text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Office Hours:</strong> Monday – Saturday, 10:00 AM – 6:00 PM IST.
                  We typically respond within 24 hours.
                </div>
              </div>

              <div className="navy-card rounded-xl p-6 border-gold/20">
                <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-5">Send a Message</p>
                {contactSent ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3">
                    <div className="w-14 h-14 gold-gradient rounded-full flex items-center justify-center">
                      <Send size={24} className="text-navy-dark" />
                    </div>
                    <p className="text-foreground font-semibold font-serif text-lg">Message Sent!</p>
                    <p className="text-muted-foreground text-sm text-center">We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContact} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Full name"
                        className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Your question or message..."
                        className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-colors resize-none"
                      />
                    </div>
                    <a
                      href={`mailto:${siteSettings.contactEmail}?subject=OTI Investment Enquiry from ${encodeURIComponent(contactForm.name)}&body=${encodeURIComponent(contactForm.message)}`}
                      onClick={() => { setContactSent(true); setTimeout(() => setContactSent(false), 3000); }}
                      className="w-full py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Send size={15} /> Send Message
                    </a>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {siteSettings.showDisclaimerSection && (
        <section className="py-10 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="flex gap-3 p-4 rounded border border-amber-500/30 bg-amber-500/5">
            <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-400/80 text-xs leading-relaxed">
              <strong className="text-amber-400">Investment Risk Disclosure:</strong> This investment is made at the investor's own risk.
              The project does not disclose the name of the underlying share company.
              The investment cannot be cancelled or withdrawn before the maturity period.
              Please read all terms carefully before applying.
            </p>
          </div>
        </section>
      )}

      {siteSettings.showFinalCtaSection && (
        <section className="py-16 px-4 sm:px-6 text-center">
          <div className="max-w-xl mx-auto navy-card rounded-xl p-10 border-gold/30">
            <h2 className="font-serif text-3xl font-bold gold-text mb-3">Secure Your Seat Today</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Only <strong className="text-gold">6,000 seats</strong> available. Fill your application and sign the investment agreement.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity shadow-lg shadow-gold/20"
            >
              Start Application <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

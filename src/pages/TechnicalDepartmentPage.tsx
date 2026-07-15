import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Sparkles, Settings2, LayoutTemplate, Palette, FileText, ShieldCheck, RotateCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDefaultSiteSettings, loadSiteSettings, resetSiteSettings, saveSiteSettings } from "@/lib/siteSettings";

const TECH_USERNAME = "Charan";
const TECH_PASSWORD = "Char@ngr7";

export default function TechnicalDepartmentPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState(getDefaultSiteSettings());

  useEffect(() => {
    const auth = sessionStorage.getItem("oti_tech_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      void loadSiteSettings().then(setSettings);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === TECH_USERNAME && password === TECH_PASSWORD) {
      sessionStorage.setItem("oti_tech_auth", "true");
      setIsAuthenticated(true);
      const syncedSettings = await loadSiteSettings();
      setSettings(syncedSettings);
      toast.success("Technical department access granted.");
    } else {
      toast.error("Invalid credentials.");
    }
  };

  const handleSave = async () => {
    await saveSiteSettings(settings);
    toast.success("Website settings updated.");
  };

  const handleReset = async () => {
    await resetSiteSettings();
    setSettings(getDefaultSiteSettings());
    toast.success("Settings reset to defaults.");
  };

  const handleRemoveSection = (key: keyof typeof settings) => {
    if (key === "showCommissionSection") {
      setSettings((prev) => ({ ...prev, showCommissionSection: false }));
      return;
    }
    if (key === "showMarketChartSection") {
      setSettings((prev) => ({ ...prev, showMarketChartSection: false }));
      return;
    }
    if (key === "showCommunitySection") {
      setSettings((prev) => ({ ...prev, showCommunitySection: false }));
      return;
    }
    if (key === "showTermsSection") {
      setSettings((prev) => ({ ...prev, showTermsSection: false }));
      return;
    }
    if (key === "showContactSection") {
      setSettings((prev) => ({ ...prev, showContactSection: false }));
      return;
    }
    if (key === "showDisclaimerSection") {
      setSettings((prev) => ({ ...prev, showDisclaimerSection: false }));
      return;
    }
    if (key === "showFinalCtaSection") {
      setSettings((prev) => ({ ...prev, showFinalCtaSection: false }));
      return;
    }
  };

  const sectionOptions = useMemo(() => [
    { key: "showCommissionSection", label: "Commission Section" },
    { key: "showMarketChartSection", label: "Market Chart Section" },
    { key: "showCommunitySection", label: "Community Section" },
    { key: "showTermsSection", label: "Terms Section" },
    { key: "showContactSection", label: "Contact Section" },
    { key: "showDisclaimerSection", label: "Disclaimer Section" },
    { key: "showFinalCtaSection", label: "Final CTA Section" },
  ], []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-2">Technical Department</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Website Management Portal</h1>
          <p className="text-muted-foreground text-sm mt-2">Manage hero content, enable or hide sections, and tune the public-facing experience.</p>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto navy-card rounded-xl p-8 border-gold/20">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                <Lock size={20} className="text-navy-dark" />
              </div>
            </div>
            <h2 className="text-center font-serif text-2xl font-semibold mb-2">Secure Access</h2>
            <p className="text-center text-muted-foreground text-sm mb-6">Use the technical department credentials to continue.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm pr-10" />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-3 gold-gradient text-navy-dark font-bold rounded">Sign In</button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="navy-card rounded-xl p-6 border-gold/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">Management Console</p>
                  <h2 className="font-serif text-2xl font-semibold">Content & Layout Controls</h2>
                  <p className="text-muted-foreground text-sm mt-2">Adjust homepage messaging and hide any section that should not appear on the live site.</p>
                </div>
                <button onClick={() => { sessionStorage.removeItem("oti_tech_auth"); setIsAuthenticated(false); }} className="flex items-center gap-2 px-3 py-2 rounded border border-border text-sm text-muted-foreground">
                  <Lock size={14} /> Sign Out
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <div className="navy-card rounded-xl p-6 border-gold/20 space-y-5">
                <div className="flex items-center gap-2 text-gold"><Sparkles size={16} /> <span className="text-sm font-semibold uppercase tracking-wide">Hero Content</span></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Hero Badge</label>
                    <input value={settings.heroBadge} onChange={(e) => setSettings((prev) => ({ ...prev, heroBadge: e.target.value }))} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Hero Title</label>
                    <input value={settings.heroTitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroTitle: e.target.value }))} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Hero Subtitle</label>
                    <textarea value={settings.heroSubtitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))} rows={3} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Primary CTA</label>
                      <input value={settings.heroPrimaryCta} onChange={(e) => setSettings((prev) => ({ ...prev, heroPrimaryCta: e.target.value }))} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Secondary CTA</label>
                      <input value={settings.heroSecondaryCta} onChange={(e) => setSettings((prev) => ({ ...prev, heroSecondaryCta: e.target.value }))} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="navy-card rounded-xl p-6 border-gold/20 space-y-5">
                <div className="flex items-center gap-2 text-gold"><Settings2 size={16} /> <span className="text-sm font-semibold uppercase tracking-wide">Section Controls</span></div>
                <div className="space-y-3">
                  {sectionOptions.map((section) => (
                    <label key={section.key} className="flex items-center justify-between gap-3 rounded border border-border p-3">
                      <span className="text-sm text-foreground">{section.label}</span>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={settings[section.key as keyof typeof settings] as boolean} onChange={(e) => setSettings((prev) => ({ ...prev, [section.key]: e.target.checked }))} className="h-4 w-4 rounded border-gray-300" />
                        <button type="button" onClick={() => handleRemoveSection(section.key as keyof typeof settings)} className="text-muted-foreground hover:text-foreground">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="space-y-4 border-t border-border pt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Contact Email</label>
                    <input value={settings.contactEmail} onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">WhatsApp Contact</label>
                    <input value={settings.whatsappContact} onChange={(e) => setSettings((prev) => ({ ...prev, whatsappContact: e.target.value }))} className="w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 gold-gradient text-navy-dark font-semibold rounded"><Save size={15} /> Save Changes</button>
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded text-muted-foreground hover:text-foreground"><RotateCcw size={15} /> Reset Defaults</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

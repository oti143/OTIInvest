import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Shield, TrendingUp, Users, Star, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "Welcome to OTI",
    headline: "Your Future Starts",
    headlineGold: "With One Decision.",
    quote: "The secret to getting ahead is getting started.",
    author: "— Mark Twain",
    sub: "A trusted long-term share investment plan designed to create generational wealth for those who dare to plan ahead.",
    icon: Star,
    accent: "gold",
    bg: "from-[#0a0f1e] via-[#0d1428] to-[#0a0f1e]",
    visual: "₹",
  },
  {
    id: 2,
    badge: "Long-Term Vision",
    headline: "Plant Today,",
    headlineGold: "Harvest Tomorrow.",
    quote: "Investing in yourself is the best investment you will ever make. It will not only improve your life, it will improve the lives of all those around you.",
    author: "— Warren Buffett",
    sub: "OTI is built on the principle that true wealth is created over time — minimum 10 years of disciplined investment for maximum returns.",
    icon: TrendingUp,
    accent: "blue",
    bg: "from-[#050b1a] via-[#091022] to-[#050b1a]",
    visual: "📈",
  },
  {
    id: 3,
    badge: "Trust & Security",
    headline: "Guided by Expertise,",
    headlineGold: "Protected by Law.",
    quote: "Risk comes from not knowing what you're doing. Knowledge is the bridge between risk and reward.",
    author: "— Warren Buffett",
    sub: "With Co-Applicant Mr. Manoj managing your shares, every rupee is handled with professional care and transparent legal agreements.",
    icon: Shield,
    accent: "emerald",
    bg: "from-[#050f0a] via-[#071510] to-[#050f0a]",
    visual: "🛡️",
  },
  {
    id: 4,
    badge: "Limited Community",
    headline: "6,000 Seats.",
    headlineGold: "One Opportunity.",
    quote: "Opportunities don't happen. You create them. But when they appear — seize them.",
    author: "— Chris Grosser",
    sub: "Only 6,000 applications are accepted. Each seat represents ₹50,000 invested into 160 shares — your stake in a confidential high-growth portfolio.",
    icon: Users,
    accent: "purple",
    bg: "from-[#0a0516] via-[#0f0820] to-[#0a0516]",
    visual: "🏆",
  },
  {
    id: 5,
    badge: "Begin Your Journey",
    headline: "The Wealth You",
    headlineGold: "Deserve Is Waiting.",
    quote: "Do not save what is left after spending, but spend what is left after saving.",
    author: "— Warren Buffett",
    sub: "You've read the quotes. You've seen the vision. Now it's time to act. Secure your seat in the OTI family today.",
    icon: ArrowRight,
    accent: "gold",
    bg: "from-[#0a0f1e] via-[#0d1428] to-[#0a0f1e]",
    visual: "🌟",
    isFinal: true,
  },
];

const accentMap = {
  gold: {
    badge: "border-gold/30 bg-gold/10 text-gold",
    dot: "bg-gold",
    btn: "gold-gradient text-navy-dark",
    bar: "bg-gold",
    text: "gold-text",
    glow: "bg-gold/15",
  },
  blue: {
    badge: "border-blue-400/30 bg-blue-400/10 text-blue-400",
    dot: "bg-blue-400",
    btn: "bg-blue-500 text-white hover:bg-blue-600",
    bar: "bg-blue-400",
    text: "text-blue-400",
    glow: "bg-blue-400/15",
  },
  emerald: {
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
    dot: "bg-emerald-400",
    btn: "bg-emerald-500 text-white hover:bg-emerald-600",
    bar: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "bg-emerald-400/15",
  },
  purple: {
    badge: "border-purple-400/30 bg-purple-400/10 text-purple-400",
    dot: "bg-purple-400",
    btn: "bg-purple-500 text-white hover:bg-purple-600",
    bar: "bg-purple-400",
    text: "text-purple-400",
    glow: "bg-purple-400/15",
  },
};

export default function WelcomePage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const slide = SLIDES[current];
  const accent = accentMap[slide.accent as keyof typeof accentMap];

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (animating || index === current) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 350);
    },
    [animating, current]
  );

  const next = () => {
    if (current < SLIDES.length - 1) goTo(current + 1, "next");
  };

  const prev = () => {
    if (current > 0) goTo(current - 1, "prev");
  };

  // Auto-advance (pause on last slide)
  useEffect(() => {
    if (current === SLIDES.length - 1) return;
    const t = setTimeout(next, 5500);
    return () => clearTimeout(t);
  }, [current]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, animating]);

  const handleEnter = () => {
    localStorage.setItem("oti_welcomed", "true");
    navigate("/");
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(135deg, #050816 0%, #0d1428 50%, #050816 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 transition-all duration-1000 pointer-events-none ${accent.glow}`}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Skip */}
      <div className="relative z-20 flex justify-end p-4 sm:p-6">
        <button
          onClick={handleEnter}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors px-4 py-2 rounded border border-border/50 hover:border-gold/30"
        >
          Skip Intro →
        </button>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-12 text-center">
        <div
          className={`max-w-2xl w-full transition-all duration-350 ${
            animating
              ? direction === "next"
                ? "opacity-0 translate-x-8"
                : "opacity-0 -translate-x-8"
              : "opacity-100 translate-x-0"
          }`}
        >
          {/* Visual emoji/icon */}
          <div className="text-6xl sm:text-7xl mb-6 select-none">{slide.visual}</div>

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-6 ${accent.badge}`}
          >
            {slide.badge}
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-foreground">{slide.headline}</span>
            <br />
            <span className={accent.text}>{slide.headlineGold}</span>
          </h1>

          {/* Quote */}
          <div className={`relative border-l-4 pl-6 text-left mx-auto max-w-lg mb-6 ${
            slide.accent === "gold" ? "border-gold/50" : `border-${slide.accent}-400/50`
          }`}>
            <p className="text-foreground/90 text-lg sm:text-xl font-serif italic leading-relaxed">
              "{slide.quote}"
            </p>
            <p className={`text-sm font-semibold mt-2 ${accent.text}`}>{slide.author}</p>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            {slide.sub}
          </p>

          {/* Final CTA */}
          {(slide as typeof SLIDES[0] & { isFinal?: boolean }).isFinal && (
            <button
              onClick={handleEnter}
              className={`inline-flex items-center gap-3 px-10 py-4 rounded font-bold text-lg transition-all hover:opacity-90 shadow-xl mb-6 ${accent.btn}`}
            >
              Enter OTI Platform <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 pb-8 px-6 flex flex-col items-center gap-5">
        {/* Progress bar */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? `w-10 ${accent.bar}` : "w-4 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-muted-foreground text-sm font-mono">
            {current + 1} / {SLIDES.length}
          </span>

          {current < SLIDES.length - 1 ? (
            <button
              onClick={next}
              className={`flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm transition-all hover:opacity-90 ${accent.btn}`}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleEnter}
              className="flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm gold-gradient text-navy-dark hover:opacity-90 transition-opacity"
            >
              Enter <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

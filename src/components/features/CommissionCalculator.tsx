import { useState, useMemo } from "react";
import { Calculator, IndianRupee, TrendingUp, Users, ChevronRight } from "lucide-react";

export default function CommissionCalculator() {
  const [salePrice, setSalePrice] = useState("500000");

  const price = useMemo(() => {
    const v = parseFloat(salePrice.replace(/,/g, ""));
    return isNaN(v) || v < 0 ? 0 : v;
  }, [salePrice]);

  const commission = price * 0.20;
  const investorEarnings = price * 0.80;
  const referralBonus = commission * 0.25;
  const coApplicantNet = commission - referralBonus;

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(val);

  const breakdownItems = [
    {
      label: "Your Earnings (Investor)",
      value: investorEarnings,
      pct: "80%",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/25",
      bar: "bg-emerald-500",
      barWidth: 80,
      icon: IndianRupee,
      desc: "Your net proceeds after commission",
    },
    {
      label: "Co-Applicant Commission",
      value: coApplicantNet,
      pct: "15%",
      color: "gold-text",
      bg: "bg-gold/10 border-gold/25",
      bar: "bg-gold",
      barWidth: 15,
      icon: TrendingUp,
      desc: "20% commission, minus 5% referral payout",
    },
    {
      label: "Referral Bonus",
      value: referralBonus,
      pct: "5%",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/25",
      bar: "bg-blue-500",
      barWidth: 5,
      icon: Users,
      desc: "25% of the 20% commission (if referred)",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-navy-light/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Interactive Tool</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Commission Calculator</h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto">
            Enter a potential sale price to see the exact earnings breakdown for investor, co-applicant, and referral bonus.
          </p>
          <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
        </div>

        <div className="navy-card rounded-xl p-6 sm:p-8 border-gold/20">
          {/* Input */}
          <div className="mb-8">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Total Share Sale Price (₹)
            </label>
            <div className="relative max-w-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold text-lg">₹</span>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                min="0"
                step="10000"
                placeholder="500000"
                className="w-full bg-navy-light/50 border border-border rounded pl-9 pr-4 py-3.5 text-foreground text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-colors"
              />
            </div>
            {/* Quick values */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[100000, 250000, 500000, 1000000, 2500000].map((v) => (
                <button
                  key={v}
                  onClick={() => setSalePrice(String(v))}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                    parseFloat(salePrice) === v
                      ? "gold-gradient text-navy-dark border-transparent"
                      : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                  }`}
                >
                  ₹{v >= 100000 ? `${v / 100000}L` : `${v / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center gap-3 p-4 rounded border border-gold/20 bg-gold/5 mb-6">
            <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
              <Calculator size={18} className="text-navy-dark" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Total Sale Price</p>
              <p className="font-serif text-2xl font-bold gold-text">₹{formatINR(price)}</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            {breakdownItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-lg border p-4 ${item.bg}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                      <Icon size={15} className={item.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <p className="text-foreground font-semibold text-sm">{item.label}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-background/50 ${item.color}`}>
                          {item.pct}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                    <p className={`font-serif text-xl font-bold flex-shrink-0 ${item.color}`}>
                      ₹{formatINR(item.value)}
                    </p>
                  </div>
                  {/* Bar */}
                  <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                      style={{ width: `${item.barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div className="mt-6 p-3 rounded border border-border text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Note:</strong> The referral bonus of 25% is calculated from the 20% commission, equalling 5% of total sale price.
            This is paid only when the investor has referred a new applicant. Actual returns depend on market performance and share value at time of withdrawal.
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <a href="/apply" className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm shadow-lg shadow-gold/20">
              Start Your Investment <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

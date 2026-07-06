import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
}

function generateCandle(prev: number): Candle {
  const change = (Math.random() - 0.48) * 8;
  const open = prev;
  const close = Math.max(80, Math.min(200, prev + change));
  const high = Math.max(open, close) + Math.random() * 3;
  const low = Math.min(open, close) - Math.random() * 3;
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return { open, high, low, close, time };
}

function generateInitialCandles(count: number): Candle[] {
  const candles: Candle[] = [];
  let price = 130;
  for (let i = 0; i < count; i++) {
    const c = generateCandle(price);
    candles.push(c);
    price = c.close;
  }
  return candles;
}

const CANDLE_WIDTH = 10;
const CANDLE_GAP = 4;
const CHART_HEIGHT = 180;
const MAX_CANDLES = 30;

export default function LiveMarketChart() {
  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(MAX_CANDLES));
  const [tick, setTick] = useState(0);
  const animRef = useRef<number | null>(null);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const newCandle = generateCandle(last.close);
        const updated = [...prev.slice(-MAX_CANDLES + 1), newCandle];
        return updated;
      });
      setTick((t) => t + 1);
      lastTickRef.current = Date.now();
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Animate current candle
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const elapsed = Date.now() - lastTickRef.current;
      if (elapsed < 1200) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    animRef.current = frame;
    return () => cancelAnimationFrame(frame);
  }, [tick]);

  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...allPrices) - 5;
  const maxPrice = Math.max(...allPrices) + 5;
  const priceRange = maxPrice - minPrice || 1;

  const toY = (price: number) =>
    CHART_HEIGHT - ((price - minPrice) / priceRange) * CHART_HEIGHT;

  const lastCandle = candles[candles.length - 1];
  const firstClose = candles[0]?.close || 100;
  const currentClose = lastCandle?.close || 100;
  const isUp = currentClose >= firstClose;
  const changeAmt = (currentClose - firstClose).toFixed(2);
  const changePct = (((currentClose - firstClose) / firstClose) * 100).toFixed(2);

  // Line chart data for background
  const linePoints = candles
    .map((c, i) => {
      const x = i * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_WIDTH / 2;
      const y = toY(c.close);
      return `${x},${y}`;
    })
    .join(" ");

  const svgWidth = MAX_CANDLES * (CANDLE_WIDTH + CANDLE_GAP);

  return (
    <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Live Market</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Share Market Pulse</h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          Real-time simulated market movement — reflecting the dynamic nature of long-term share investments.
        </p>
        <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
      </div>

      <div className="navy-card rounded-xl border-gold/20 p-5 sm:p-6 overflow-hidden">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-gold animate-pulse" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">OTI Share Index</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-bold text-foreground">
                ₹{currentClose.toFixed(2)}
              </span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? "+" : ""}{changeAmt} ({isUp ? "+" : ""}{changePct}%)
              </div>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              Last tick: {lastCandle?.time}
            </p>
          </div>

          {/* Mini stat pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Open", val: `₹${candles[0]?.close.toFixed(1)}` },
              { label: "High", val: `₹${Math.max(...candles.map((c) => c.high)).toFixed(1)}` },
              { label: "Low", val: `₹${Math.min(...candles.map((c) => c.low)).toFixed(1)}` },
              { label: "Volume", val: `${(tick * 142 + 5000).toLocaleString("en-IN")}` },
            ].map(({ label, val }) => (
              <div key={label} className="text-center px-3 py-1.5 rounded border border-border bg-background/50">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wide">{label}</p>
                <p className="text-foreground text-xs font-bold">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Candlestick Chart */}
        <div className="overflow-x-auto rounded-lg" style={{ background: "rgba(5,8,22,0.6)", border: "1px solid rgba(201,168,76,0.1)" }}>
          <div className="relative" style={{ minWidth: svgWidth + 40, padding: "16px 8px 8px" }}>
            {/* Y-axis labels */}
            <div className="absolute left-1 top-4 bottom-4 flex flex-col justify-between pointer-events-none">
              {[maxPrice, (maxPrice + minPrice) / 2, minPrice].map((p) => (
                <span key={p} className="text-[9px] text-muted-foreground/60">
                  ₹{p.toFixed(0)}
                </span>
              ))}
            </div>

            <svg
              width={svgWidth}
              height={CHART_HEIGHT + 24}
              className="ml-6"
              style={{ display: "block" }}
            >
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((pct) => (
                <line
                  key={pct}
                  x1={0}
                  x2={svgWidth}
                  y1={CHART_HEIGHT * pct}
                  y2={CHART_HEIGHT * pct}
                  stroke="rgba(201,168,76,0.06)"
                  strokeWidth={1}
                />
              ))}

              {/* Area fill under line */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity="0.01" />
                </linearGradient>
              </defs>
              {candles.length > 1 && (
                <polygon
                  points={`${candles[0].close ? 0 * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_WIDTH / 2 : 0},${CHART_HEIGHT} ${linePoints} ${(candles.length - 1) * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_WIDTH / 2},${CHART_HEIGHT}`}
                  fill="url(#areaGrad)"
                />
              )}

              {/* Trend line */}
              {candles.length > 1 && (
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke={isUp ? "#10b981" : "#ef4444"}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                  strokeDasharray="3 2"
                />
              )}

              {/* Candlesticks */}
              {candles.map((c, i) => {
                const x = i * (CANDLE_WIDTH + CANDLE_GAP);
                const bodyTop = Math.min(toY(c.open), toY(c.close));
                const bodyHeight = Math.max(1, Math.abs(toY(c.open) - toY(c.close)));
                const isGreen = c.close >= c.open;
                const color = isGreen ? "#10b981" : "#ef4444";
                const centerX = x + CANDLE_WIDTH / 2;
                const isLatest = i === candles.length - 1;

                return (
                  <g key={i}>
                    {/* Wick */}
                    <line
                      x1={centerX}
                      x2={centerX}
                      y1={toY(c.high)}
                      y2={toY(c.low)}
                      stroke={color}
                      strokeWidth={1}
                      opacity={0.8}
                    />
                    {/* Body */}
                    <rect
                      x={x}
                      y={bodyTop}
                      width={CANDLE_WIDTH}
                      height={bodyHeight}
                      fill={color}
                      opacity={isLatest ? 1 : 0.75}
                      rx={1}
                    />
                    {/* Latest candle pulse */}
                    {isLatest && (
                      <circle cx={centerX} cy={toY(c.close)} r={3} fill={color} opacity={0.9}>
                        <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Current price line */}
              <line
                x1={0}
                x2={svgWidth}
                y1={toY(currentClose)}
                y2={toY(currentClose)}
                stroke={isUp ? "#10b981" : "#ef4444"}
                strokeWidth={0.5}
                strokeDasharray="4 3"
                opacity={0.5}
              />
            </svg>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-muted-foreground/60 text-[10px] mt-3 text-center leading-relaxed">
          * Simulated market data for illustrative purposes only. Not real financial advice or actual share prices.
          OTI's actual share company is not disclosed per plan terms.
        </p>
      </div>
    </section>
  );
}

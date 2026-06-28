import { useState } from "react";
import { batteries, datasheets } from "@/lib/batteryData";
import BatteryModal from "@/components/BatteryModal";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, LabelList,
  ReferenceLine,
} from "recharts";
import { FileText, ChevronDown, ChevronUp, Info, Award, Zap, DollarSign, Shield } from "lucide-react";

// ============================================================
// LIGHTNING ENERGY — PUBLIC PRESENTATION DESIGN SYSTEM
// Background: #000000 | Aqua: #00EAD3 | Ash: #808285 | White: #FFFFFF
// Aqua used sparingly: logo, active tabs, bar fills, key accents only
// Fonts: NextSphere (headings), GeneralSans (body/numbers), Urbanist (UI)
// All charts: rounded bars, clean grid, professional labels, high contrast
// ============================================================

const AQUA = "#00EAD3";
const ASH = "#808285";
const WHITE = "#FFFFFF";
const CARD_BG = "#0d0d0d";
const SECTION_BG = "#080808";
const BORDER = "#1e1e1e";

// Secondary palette for multi-series charts — no blue
const PALETTE = [AQUA, "#FF6B35", "#A8E063", "#F7C59F", "#E8D5B7", "#9B5DE5", "#F15BB5"];

/* ─── Shared tooltip style ─── */
const tooltipStyle = {
  backgroundColor: "#111",
  border: `1px solid ${AQUA}`,
  borderRadius: "10px",
  color: WHITE,
  fontFamily: "'GeneralSans', sans-serif",
  fontSize: 13,
  boxShadow: `0 8px 32px rgba(0,234,211,0.12)`,
};

/* ─── Custom rounded bar shape ─── */
const RoundedBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  const r = Math.min(5, height / 2, width / 2);
  return <rect x={x} y={y} width={width} height={height} rx={r} ry={r} fill={fill} />;
};

const RoundedBarH = (props: any) => {
  const { x, y, width, height, fill } = props;
  if (!width || width <= 0) return null;
  const r = Math.min(5, height / 2);
  return <rect x={x} y={y} width={width} height={height} rx={r} ry={r} fill={fill} />;
};

/* ─── Section header with decorative line ─── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1 h-8 rounded-full" style={{ background: AQUA }} />
        <h2 className="text-3xl font-extrabold uppercase tracking-wider" style={{ fontFamily: "'NextSphere', sans-serif", color: AQUA }}>
          {title}
        </h2>
      </div>
      {subtitle && <p className="text-sm ml-5" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>{subtitle}</p>}
    </div>
  );
}

/* ─── Chart container card ─── */
function ChartCard({ title, subtitle, children, height = 420 }: { title: string; subtitle?: string; children: React.ReactNode; height?: number }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
      <h3 className="text-lg font-bold mb-1" style={{ color: WHITE, fontFamily: "'Urbanist', sans-serif" }}>{title}</h3>
      {subtitle && <p className="text-xs mb-5" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>{subtitle}</p>}
      <div style={{ height }}>{children}</div>
    </div>
  );
}

/* ─── Stat badge ─── */
function StatBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#1a1a1a" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>{label}</p>
        <p className="text-sm font-bold" style={{ color: WHITE, fontFamily: "'GeneralSans', sans-serif" }}>{value}</p>
      </div>
    </div>
  );
}

/* ─── Aqua tab bar ─── */
function TabBar({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-7">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} className={`le-tab${active === t.id ? " active" : ""}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* BatteryModal is now imported from @/components/BatteryModal */

/* ─── Battery card ─── */
function BatteryCard({ battery, onClick }: { battery: (typeof batteries)[0]; onClick: () => void }) {
  return (
    <div className="battery-card flex flex-col gap-3 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: ASH }}>{battery.brand}</p>
          <h3 className="text-base font-extrabold text-white leading-tight" style={{ fontFamily: "'NextSphere', sans-serif" }}>{battery.model}</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0" style={{ background: AQUA, color: "#000", fontFamily: "'GeneralSans', sans-serif" }}>{battery.year}</span>
      </div>
      <div className="space-y-1.5 text-sm">
        {[["Capacity", battery.capacity], ["Warranty", battery.warranty], ["Origin", battery.origin]].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-2">
            <span style={{ color: ASH }}>{label}:</span>
            <span className="text-white text-right font-semibold" style={{ fontFamily: "'GeneralSans', sans-serif" }}>{value}</span>
          </div>
        ))}
      </div>
      <button onClick={onClick}
        className="mt-auto text-sm font-bold py-2 rounded-full border transition-all"
        style={{ borderColor: AQUA, color: AQUA, background: "transparent" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = AQUA; (e.currentTarget as HTMLButtonElement).style.color = "#000"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = AQUA; }}>
        View Details
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   COMPARATIVE ANALYSIS — upgraded charts
════════════════════════════════════════════ */
const comparativeTabs = [
  { id: "efficiency", label: "Round-Trip Efficiency" },
  { id: "power", label: "Power Output" },
  { id: "cost", label: "Cost Analysis" },
  { id: "matrix", label: "Comparison Matrix" },
];

function ComparativeAnalysis() {
  const [tab, setTab] = useState("efficiency");

  const effData = [...batteries]
    .sort((a, b) => b.efficiency - a.efficiency)
    .map((b) => ({
      name: b.brand,
      value: b.efficiency,
      sub: b.threePhaseInverter || '',
    }));

  const CustomEffYTick = ({ x, y, payload }: any) => {
    const item = effData.find(d => d.name === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-6} y={-6} textAnchor="end" fill={WHITE} fontSize={12} fontFamily="'GeneralSans', sans-serif">{payload.value}</text>
        {item?.sub && (
          <text x={-6} y={8} textAnchor="end" fill={AQUA} fontSize={9} fontFamily="'GeneralSans', sans-serif">{item.sub}</text>
        )}
      </g>
    );
  };

  const powerData = [...batteries]
    .sort((a, b) => b.peakPower - a.peakPower)
    .map((b) => ({
      name: `${b.brand} ${b.model.split(" ")[0]}`,
      peak: b.peakPower,
      continuous: b.continuousPower,
    }));

  const costData = [...batteries]
    .sort((a, b) => a.pricePerKwh - b.pricePerKwh)
    .map((b) => ({
      name: `${b.brand} ${b.model.split(" ")[0]}`,
      perKwh: b.pricePerKwh,
      total: Math.round(b.totalCost / 1000),
    }));

  const CustomEffTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{ ...tooltipStyle, padding: "10px 14px" }}>
        <p className="font-bold text-white mb-1">{d.name}</p>
        <p style={{ color: AQUA }}>Efficiency: <strong>{d.value}%</strong></p>
        {d.sub && <p className="text-xs mt-1" style={{ color: ASH }}>{d.sub}</p>}
      </div>
    );
  };

  return (
    <section className="mb-16">
      <SectionHeader title="Comparative Analysis" subtitle="Technical performance benchmarks across all stocked battery systems" />
      <div className="rounded-2xl p-6" style={{ background: SECTION_BG, border: `1px solid ${BORDER}` }}>
        <TabBar tabs={comparativeTabs} active={tab} onChange={setTab} />

        {tab === "efficiency" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                <strong style={{ color: AQUA }}>Round-trip efficiency</strong> measures how much stored energy is returned on discharge.
                A higher percentage means less energy lost per cycle — directly reducing electricity costs over the battery's lifetime.
              </p>
            </div>
            {/* KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
              <StatBadge icon={<Award size={16} style={{ color: AQUA }} />} label="Highest Efficiency" value="GoodWe GW8.3 — 98%" />
              <StatBadge icon={<Award size={16} style={{ color: "#FF6B35" }} />} label="Lowest Efficiency" value="Enphase IQ5P — 89%" />
              <StatBadge icon={<Zap size={16} style={{ color: AQUA }} />} label="Average Efficiency" value={`${(batteries.reduce((s, b) => s + b.efficiency, 0) / batteries.length).toFixed(1)}%`} />
              <StatBadge icon={<Shield size={16} style={{ color: AQUA }} />} label="Systems Above 96%" value={`${batteries.filter(b => b.efficiency >= 96).length} of ${batteries.length}`} />
            </div>
            <ChartCard title="Round-Trip Efficiency Comparison (%)" subtitle="Sorted highest to lowest — industry benchmark range: 80–100%" height={520}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={effData} layout="vertical" margin={{ left: 10, right: 60, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" domain={[80, 100]} tickCount={6}
                    tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }}
                    tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={160}
                    tick={<CustomEffYTick />} interval={0} />
                  <Tooltip content={<CustomEffTooltip />} cursor={{ fill: "rgba(0,234,211,0.05)" }} />
                  <ReferenceLine x={95} stroke="#333" strokeDasharray="4 4" label={{ value: "95% benchmark", fill: ASH, fontSize: 10, position: "top" }} />
                  <Bar dataKey="value" fill={AQUA} shape={<RoundedBarH />} maxBarSize={28}>
                    <LabelList dataKey="value" position="right" formatter={(v: number) => `${v}%`}
                      style={{ fill: WHITE, fontSize: 12, fontFamily: "'GeneralSans', sans-serif", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {tab === "power" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#1a0d08", borderLeft: `3px solid #FF6B35` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                <strong style={{ color: "#FF6B35" }}>Peak power</strong> determines the maximum instantaneous load the battery can support.
                <strong style={{ color: AQUA }}> Continuous power</strong> is the sustained output during normal operation. Both are critical for sizing against household loads.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
              <StatBadge icon={<Zap size={16} style={{ color: AQUA }} />} label="Highest Peak Power" value="Fronius Symo — 15 kW" />
              <StatBadge icon={<Zap size={16} style={{ color: "#FF6B35" }} />} label="Avg Peak Power" value={`${(batteries.reduce((s, b) => s + b.peakPower, 0) / batteries.length).toFixed(1)} kW`} />
              <StatBadge icon={<Zap size={16} style={{ color: AQUA }} />} label="Highest Continuous" value="Fronius Symo — 10 kW" />
              <StatBadge icon={<Zap size={16} style={{ color: "#FF6B35" }} />} label="Avg Continuous" value={`${(batteries.reduce((s, b) => s + b.continuousPower, 0) / batteries.length).toFixed(1)} kW`} />
            </div>
            <ChartCard title="Power Output Comparison (kW)" subtitle="Peak vs continuous power — sorted by peak output" height={440}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={powerData} layout="vertical" margin={{ left: 10, right: 50, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }} tickFormatter={(v) => `${v} kW`} />
                  <YAxis type="category" dataKey="name" width={145} tick={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`${v} kW`, name === "peak" ? "Peak Power" : "Continuous Power"]} cursor={{ fill: "rgba(0,234,211,0.05)" }} />
                  <Bar dataKey="peak" name="Peak Power" fill={AQUA} shape={<RoundedBarH />} maxBarSize={18}>
                    <LabelList dataKey="peak" position="right" formatter={(v: number) => `${v} kW`} style={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  </Bar>
                  <Bar dataKey="continuous" name="Continuous Power" fill="#FF6B35" shape={<RoundedBarH />} maxBarSize={18}>
                    <LabelList dataKey="continuous" position="right" formatter={(v: number) => `${v} kW`} style={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <div className="flex gap-6 text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: AQUA }} /> Peak Power</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#FF6B35" }} /> Continuous Power</span>
            </div>
          </div>
        )}

        {tab === "cost" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                <strong style={{ color: AQUA }}>Estimated cost per usable kWh</strong> is the most meaningful value metric — lower cost per kWh indicates better long-term return on investment.
                Total installed cost estimates include hardware and standard installation (AUD, indicative).
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
              <StatBadge icon={<DollarSign size={16} style={{ color: AQUA }} />} label="Best Value/kWh" value="FoxESS ECS — $800" />
              <StatBadge icon={<DollarSign size={16} style={{ color: "#FF6B35" }} />} label="Premium/kWh" value="Enphase IQ5P — $1,400" />
              <StatBadge icon={<DollarSign size={16} style={{ color: AQUA }} />} label="Avg Cost/kWh" value={`$${Math.round(batteries.reduce((s, b) => s + b.pricePerKwh, 0) / batteries.length).toLocaleString()}`} />
              <StatBadge icon={<DollarSign size={16} style={{ color: "#FF6B35" }} />} label="Avg Total Cost" value={`$${Math.round(batteries.reduce((s, b) => s + b.totalCost, 0) / batteries.length).toLocaleString()}`} />
            </div>
            <ChartCard title="Estimated Cost per Usable kWh (AUD)" subtitle="Lower is better — sorted by cost efficiency" height={440}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData} layout="vertical" margin={{ left: 10, right: 80, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="name" width={145} tick={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [name === "perKwh" ? `$${v}/kWh` : `$${(v * 1000).toLocaleString()}`, name === "perKwh" ? "Cost per kWh" : "Total Cost"]} cursor={{ fill: "rgba(0,234,211,0.05)" }} />
                  <Bar dataKey="perKwh" name="Cost per kWh ($)" fill={AQUA} shape={<RoundedBarH />} maxBarSize={28}>
                    <LabelList dataKey="perKwh" position="right" formatter={(v: number) => `$${v}`} style={{ fill: WHITE, fontSize: 12, fontFamily: "'GeneralSans', sans-serif", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {tab === "matrix" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                Full side-by-side specification comparison across all stocked battery systems. All figures are indicative and subject to installation configuration.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
              <table className="w-full text-sm" style={{ fontFamily: "'GeneralSans', sans-serif" }}>
                <thead>
                  <tr style={{ background: "#111" }}>
                    {["Battery System", "Year", "Capacity", "Efficiency", "Peak Power", "Warranty", "Origin"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: AQUA, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batteries.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{b.brand} {b.model}</td>
                      <td className="py-3 px-4 font-semibold whitespace-nowrap" style={{ color: AQUA }}>{b.year}</td>
                      <td className="py-3 px-4 text-white">{b.capacity}</td>
                      <td className="py-3 px-4 font-bold whitespace-nowrap" style={{ color: b.efficiency >= 97 ? AQUA : b.efficiency >= 95 ? "#A8E063" : WHITE }}>{b.efficiency}%</td>
                      <td className="py-3 px-4 text-white whitespace-nowrap">{b.peakPower} kW</td>
                      <td className="py-3 px-4 text-white whitespace-nowrap">{b.warranty}</td>
                      <td className="py-3 px-4 whitespace-nowrap" style={{ color: ASH }}>{b.origin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs" style={{ color: ASH }}>* Efficiency highlighted: <span style={{ color: AQUA }}>≥97%</span> | <span style={{ color: "#A8E063" }}>≥95%</span> | white = standard</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   GRAPHICS OVERVIEW — upgraded charts
════════════════════════════════════════════ */
const graphicsTabs = [
  { id: "features", label: "Features Matrix" },
  { id: "performance", label: "Overall Performance" },
  { id: "capacity", label: "Battery Capacity" },
  { id: "warranty", label: "Warranty Period" },
  { id: "cost-efficiency", label: "Cost Efficiency" },
  { id: "power-efficiency", label: "Power vs Efficiency" },
];

function FeatureIcon({ value }: { value: boolean | "partial" }) {
  if (value === true) return <span className="text-base font-bold" style={{ color: AQUA }}>✓</span>;
  if (value === "partial") return <span className="text-base font-bold" style={{ color: "#f59e0b" }}>◐</span>;
  return <span className="text-base font-bold" style={{ color: "#ef4444" }}>✗</span>;
}

function GraphicsOverview() {
  const [tab, setTab] = useState("features");
  const [showThreePhase, setShowThreePhase] = useState(false);

  /* Overall Performance Score — composite of efficiency, peak power, capacity */
  const performanceData = [...batteries]
    .map((b) => {
      const capMatch = b.capacity.match(/[\d.]+/);
      const cap = capMatch ? parseFloat(capMatch[0]) : 10;
      const score = Math.round(b.efficiency * 5 + b.peakPower * 20 + cap * 5);
      return { name: b.brand, score };
    })
    .sort((a, b) => b.score - a.score);

  const capacityData = batteries
    .filter((b) => !b.capacity.includes("Compatible"))
    .map((b) => {
      const match = b.capacity.match(/[\d.]+/);
      return { name: `${b.brand} ${b.model.split(" ")[0]}`, capacity: match ? parseFloat(match[0]) : 0 };
    })
    .sort((a, b) => b.capacity - a.capacity);

  const warrantyData = batteries.map((b) => ({
    name: `${b.brand} ${b.model.split(" ")[0]}`,
    years: b.warranty.includes("15") ? 15 : 10,
    label: b.warranty.includes("15") ? "15 yrs" : "10 yrs",
  }));

  const costEffData = [...batteries]
    .sort((a, b) => a.pricePerKwh - b.pricePerKwh)
    .map((b) => ({
      name: `${b.brand} ${b.model.split(" ")[0]}`,
      costPerKwh: b.pricePerKwh,
      efficiency: b.efficiency,
    }));

  const powerEffData = batteries.map((b) => ({
    x: b.peakPower,
    y: b.efficiency,
    z: b.totalCost / 1000,
    name: `${b.brand} ${b.model.split(" ")[0]}`,
  }));

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{ ...tooltipStyle, padding: "10px 14px" }}>
        <p className="font-bold text-white mb-1">{d.name}</p>
        <p style={{ color: AQUA }}>Peak Power: <strong>{d.x} kW</strong></p>
        <p style={{ color: "#FF6B35" }}>Efficiency: <strong>{d.y}%</strong></p>
        <p style={{ color: ASH }}>Est. Cost: ~${(d.z * 1000).toLocaleString()}</p>
      </div>
    );
  };

  return (
    <section className="mb-16">
      <SectionHeader title="Graphics Overview" subtitle="Visual analysis of features, performance, capacity, and value across all battery systems" />
      <div className="rounded-2xl p-6" style={{ background: SECTION_BG, border: `1px solid ${BORDER}` }}>
        <TabBar tabs={graphicsTabs} active={tab} onChange={setTab} />

        {tab === "features" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                Feature availability matrix across all stocked systems — including built-in inverters, three-phase compatibility, EV charging, and smart home integration.
              </p>
            </div>

            {/* Three-Phase info */}
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid #1e3a38` }}>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                style={{ background: "#0d1a18" }}
                onClick={() => setShowThreePhase(!showThreePhase)}
              >
                <Info size={15} style={{ color: AQUA, flexShrink: 0 }} />
                <span className="font-semibold" style={{ color: AQUA }}>What is Three-Phase?</span>
                <span className="ml-auto" style={{ color: ASH }}>{showThreePhase ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              </button>
              {showThreePhase && (
                <div className="px-4 pb-4 pt-2 text-sm" style={{ background: "#0a1512", color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
                  Three-phase compatible batteries are suitable for properties with a three-phase power connection — typically larger homes, commercial premises, or sites with high-power equipment such as ducted air conditioning, large appliances, or EV chargers. Most standard homes use single-phase power.
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
              <table className="w-full text-sm" style={{ fontFamily: "'GeneralSans', sans-serif" }}>
                <thead>
                  <tr style={{ background: "#111" }}>
                    {["Battery System", "Built-in Inverter", "Three-Phase ⓘ", "High Power", "EV Charging", "Smart Features"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: AQUA, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batteries.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "transparent" : "#0a0a0a" }}>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{b.brand} {b.model.split(" ").slice(0, 2).join(" ")}</td>
                      <td className="py-3 px-4 text-center"><FeatureIcon value={b.builtInInverter} /></td>
                      <td className="py-3 px-4 text-center"><FeatureIcon value={b.threePhase} /></td>
                      <td className="py-3 px-4 text-center"><FeatureIcon value={b.highPower} /></td>
                      <td className="py-3 px-4 text-center"><FeatureIcon value={b.evCharging} /></td>
                      <td className="py-3 px-4 text-center"><FeatureIcon value={b.smartFeatures} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-6 text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
              <span><span style={{ color: AQUA }}>✓</span> Fully Supported</span>
              <span><span style={{ color: "#f59e0b" }}>◐</span> Partially Supported</span>
              <span><span style={{ color: "#ef4444" }}>✗</span> Not Supported</span>
            </div>
          </div>
        )}

        {tab === "performance" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                A composite performance score calculated from each battery's efficiency, power output, and usable capacity. This gives a quick overall ranking across all systems.
              </p>
            </div>
            <ChartCard title="Overall Performance Score" subtitle="Composite score: efficiency × 5 + peak power × 20 + capacity × 5" height={460}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ left: 20, right: 60, top: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  <YAxis tick={{ fill: ASH, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} tickCount={6} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, "Performance Score"]} cursor={{ fill: "rgba(0,234,211,0.05)" }} />
                  <Bar dataKey="score" fill={AQUA} shape={<RoundedBar />} maxBarSize={60}>
                    <LabelList dataKey="score" position="top" style={{ fill: WHITE, fontSize: 12, fontFamily: "'GeneralSans', sans-serif", fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {tab === "capacity" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                Usable battery capacity (kWh) sorted highest to lowest. Larger capacity delivers longer backup duration and greater daily self-consumption.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
              <StatBadge icon={<Zap size={16} style={{ color: AQUA }} />} label="Largest Capacity" value="GoodWe ESA — 108 kWh" />
              <StatBadge icon={<Zap size={16} style={{ color: "#FF6B35" }} />} label="Most Scalable" value="Sungrow SBR — 25.6 kWh" />
              <StatBadge icon={<Zap size={16} style={{ color: AQUA }} />} label="Standard Home" value="Tesla PW3 — 13.5 kWh" />
              <StatBadge icon={<Zap size={16} style={{ color: "#FF6B35" }} />} label="Entry Level" value="Enphase IQ5P — 5.0 kWh" />
            </div>
            <ChartCard title="Battery Capacity Comparison (kWh)" subtitle="Usable energy storage — sorted largest to smallest" height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityData} layout="vertical" margin={{ left: 10, right: 70, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }} tickFormatter={(v) => `${v} kWh`} />
                  <YAxis type="category" dataKey="name" width={145} tick={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} kWh`, "Capacity"]} cursor={{ fill: "rgba(0,234,211,0.05)" }} />
                  <Bar dataKey="capacity" shape={<RoundedBarH />} maxBarSize={28}>
                    {capacityData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? AQUA : i === 1 ? "#00c4b0" : i === 2 ? "#00a89e" : "#008c84"} />
                    ))}
                    <LabelList dataKey="capacity" position="right" formatter={(v: number) => `${v} kWh`} style={{ fill: WHITE, fontSize: 12, fontFamily: "'GeneralSans', sans-serif", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {tab === "warranty" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                Warranty period is a key indicator of manufacturer confidence and long-term reliability. The Enphase IQ Battery 5P leads with a 15-year warranty — the longest in the range.
              </p>
            </div>
            <ChartCard title="Warranty Period by Battery System (Years)" subtitle="Longer warranty = greater manufacturer confidence and product longevity" height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={warrantyData} layout="vertical" margin={{ left: 10, right: 80, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" domain={[0, 20]} tickCount={5} tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }} tickFormatter={(v) => `${v} yrs`} />
                  <YAxis type="category" dataKey="name" width={145} tick={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} years`, "Warranty"]} cursor={{ fill: "rgba(0,234,211,0.05)" }} />
                  <ReferenceLine x={10} stroke="#333" strokeDasharray="4 4" label={{ value: "10yr standard", fill: ASH, fontSize: 10, position: "top" }} />
                  <Bar dataKey="years" shape={<RoundedBarH />} maxBarSize={28}>
                    {warrantyData.map((d, i) => (
                      <Cell key={i} fill={d.years >= 15 ? AQUA : "#00a89e"} />
                    ))}
                    <LabelList dataKey="label" position="right" style={{ fill: WHITE, fontSize: 12, fontFamily: "'GeneralSans', sans-serif", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <p className="text-xs" style={{ color: ASH }}>
              <span style={{ color: AQUA }}>Aqua</span> = 15-year warranty (Enphase IQ5P) &nbsp;|&nbsp; Teal = 10-year standard
            </p>
          </div>
        )}

        {tab === "cost-efficiency" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                Dual-axis comparison of <strong style={{ color: AQUA }}>cost per kWh</strong> and <strong style={{ color: "#FF6B35" }}>round-trip efficiency</strong>.
                The ideal system combines low cost per kWh with high efficiency — maximising return on investment over the battery's lifetime.
              </p>
            </div>
            <ChartCard title="Cost Efficiency: $/kWh vs Round-Trip Efficiency" subtitle="Lower cost + higher efficiency = best long-term value" height={440}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costEffData} layout="vertical" margin={{ left: 10, right: 70, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }} />
                  <YAxis type="category" dataKey="name" width={145} tick={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [name === "costPerKwh" ? `$${v}/kWh` : `${v}%`, name === "costPerKwh" ? "Cost per kWh" : "Efficiency"]} cursor={{ fill: "rgba(0,234,211,0.05)" }} />
                  <Bar dataKey="costPerKwh" name="Cost per kWh ($)" fill={AQUA} shape={<RoundedBarH />} maxBarSize={18}>
                    <LabelList dataKey="costPerKwh" position="right" formatter={(v: number) => `$${v}`} style={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  </Bar>
                  <Bar dataKey="efficiency" name="Efficiency (%)" fill="#FF6B35" shape={<RoundedBarH />} maxBarSize={18}>
                    <LabelList dataKey="efficiency" position="right" formatter={(v: number) => `${v}%`} style={{ fill: WHITE, fontSize: 11, fontFamily: "'GeneralSans', sans-serif" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <div className="flex gap-6 text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: AQUA }} /> Cost per kWh ($)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#FF6B35" }} /> Round-Trip Efficiency (%)</span>
            </div>
          </div>
        )}

        {tab === "power-efficiency" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}>
              <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                Scatter plot of <strong style={{ color: AQUA }}>peak power output (kW)</strong> vs <strong style={{ color: "#FF6B35" }}>round-trip efficiency (%)</strong>.
                Bubble size represents estimated total installed cost. Systems in the upper-right quadrant offer the best combination of power and efficiency.
              </p>
            </div>
            <ChartCard title="Peak Power vs Round-Trip Efficiency" subtitle="Upper-right = high power + high efficiency | Bubble size = estimated total cost" height={440}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 30, right: 40, top: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis type="number" dataKey="x" name="Peak Power (kW)"
                    tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }}
                    label={{ value: "Peak Power (kW)", position: "insideBottom", offset: -20, fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }} />
                  <YAxis type="number" dataKey="y" name="Efficiency (%)" domain={[85, 100]}
                    tick={{ fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }}
                    label={{ value: "Efficiency (%)", angle: -90, position: "insideLeft", offset: -10, fill: ASH, fontSize: 12, fontFamily: "'GeneralSans', sans-serif" }} />
                  <ZAxis type="number" dataKey="z" range={[80, 500]} name="Total Cost ($k)" />
                  <ReferenceLine x={8} stroke="#222" strokeDasharray="4 4" />
                  <ReferenceLine y={95} stroke="#222" strokeDasharray="4 4" />
                  <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: "3 3", stroke: AQUA }} />
                  <Scatter data={powerEffData} fill={AQUA} fillOpacity={0.85} />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
            <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
              Dashed reference lines at 8 kW peak power and 95% efficiency threshold.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Brochures section ─── */
function BrochuresSection() {
  return (
    <section className="mb-16">
      <div className="rounded-2xl p-6" style={{ background: SECTION_BG, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-3 mb-1">
          <FileText size={20} style={{ color: AQUA }} />
          <h2 className="text-xl font-extrabold" style={{ color: WHITE, fontFamily: "'NextSphere', sans-serif" }}>
            Download Manufacturer Brochures
          </h2>
        </div>
        <p className="text-sm mb-6 ml-8" style={{ color: ASH }}>Official product brochures and technical datasheets from manufacturers</p>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3">
          {datasheets.map((ds) => (
            <a key={ds.name} href={ds.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-3 transition-all"
              style={{ background: "#111", border: "1px dashed #2a2a2a" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = AQUA; (e.currentTarget as HTMLAnchorElement).style.background = "#0d1a1a"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLAnchorElement).style.background = "#111"; }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#1a1a1a" }}>
                <FileText size={15} style={{ color: AQUA }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                  {ds.name.replace(" Official Datasheet", "")}
                </p>
                <p className="text-xs" style={{ color: ASH }}>Official Datasheet</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Home page ─── */
export default function Home() {
  const [selectedBattery, setSelectedBattery] = useState<(typeof batteries)[0] | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center gap-4"
        style={{ background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${BORDER}`, backdropFilter: "blur(16px)" }}>
        <img src="/manus-storage/LightningEnergy_Logo_Icon_Aqua_d7ae55bd.png" alt="Lightning Energy Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="text-xl font-extrabold leading-none" style={{ color: AQUA, fontFamily: "'NextSphere', sans-serif" }}>
            Lightning Energy
          </h1>
          <p className="text-xs" style={{ color: ASH, fontFamily: "'Urbanist', sans-serif" }}>Solar Battery Storage Solutions</p>
        </div>
        <nav className="ml-auto flex items-center gap-2">
          <a href="/" className="text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={{ color: WHITE, fontFamily: "'Urbanist', sans-serif", background: "#111", border: `1px solid ${BORDER}` }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = AQUA; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = BORDER; }}>
            Battery Systems
          </a>
          <a href="/files" className="text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={{ color: WHITE, fontFamily: "'Urbanist', sans-serif", background: "#111", border: `1px solid ${BORDER}` }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = AQUA; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = BORDER; }}>
            File Storage
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Battery grid */}
        <section className="mb-16">
          <SectionHeader
            title="Stocked Solar Battery Systems"
            subtitle="Compare specifications, warranties, and compatible inverters for our complete range of premium solar battery storage solutions."
          />
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
            {batteries.map((b) => (
              <BatteryCard key={b.id} battery={b} onClick={() => setSelectedBattery(b)} />
            ))}
          </div>
        </section>

        <ComparativeAnalysis />
        <GraphicsOverview />
        <BrochuresSection />
      </main>

      {/* Footer */}
      <footer className="py-10 text-center" style={{ borderTop: `1px solid ${BORDER}`, background: "#000" }}>
        <div className="flex justify-center mb-4">
          <img src="/manus-storage/LightningEnergy_Logo_Icon_Aqua_d7ae55bd.png" alt="Lightning Energy" className="w-12 h-12 object-contain opacity-70" />
        </div>
        <p className="text-sm mb-1" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>© 2026 Lightning Energy. All rights reserved.</p>
        <p className="text-xs mb-1" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>Professional solar battery storage solutions for residential and commercial applications.</p>
        <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>Prepared by George Fotopoulos, Renewables Consultant</p>
        <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>1 Waverley Road, Malvern East VIC 3145 | M: 0419 574 520 | E: george.f@lightning-energy.com.au</p>
        <p className="text-xs mt-3 font-semibold" style={{ color: "#333", fontFamily: "'GeneralSans', sans-serif" }}>COPYRIGHT Lightning Energy — Architect George Fotopoulos</p>
      </footer>

      {selectedBattery && <BatteryModal battery={selectedBattery} onClose={() => setSelectedBattery(null)} />}
    </div>
  );
}

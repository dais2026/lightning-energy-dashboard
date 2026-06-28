import { useState } from "react";
import { Battery } from "@/lib/batteryData";
import { FileText, X, Building2, Zap, Star } from "lucide-react";

// ============================================================
// LIGHTNING ENERGY — Battery Detail Modal
// Design: Full-width dark modal matching reference screenshot
// 4 tabs: Specifications | Company Background | Compatible Inverters | Features
// Two-column spec grid, usable capacity highlighted in aqua
// ============================================================

const AQUA = "#00EAD3";
const ASH = "#808285";
const WHITE = "#FFFFFF";
const BORDER = "#2a2a2a";

const MODAL_TABS = [
  { id: "specs", label: "Specifications" },
  { id: "company", label: "Company Background" },
  { id: "inverters", label: "Compatible Inverters" },
  { id: "features", label: "Features" },
];

interface Props {
  battery: Battery;
  onClose: () => void;
}

export default function BatteryModal({ battery, onClose }: Props) {
  const [tab, setTab] = useState("specs");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: "#0d0d0d", border: `1px solid ${BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-8 pt-7 pb-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2
                className="text-3xl font-extrabold text-white leading-tight"
                style={{ fontFamily: "'NextSphere', sans-serif" }}
              >
                {battery.brand.toUpperCase()} {battery.model.toUpperCase()}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{ background: AQUA, color: "#000", fontFamily: "'GeneralSans', sans-serif" }}
                >
                  {battery.year}
                </span>
                <span className="text-sm" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
                  {battery.origin}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: AQUA, fontFamily: "'GeneralSans', sans-serif" }}
                >
                  {battery.efficiency}% Efficiency
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ color: ASH, background: "#1a1a1a" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = WHITE;
                (e.currentTarget as HTMLButtonElement).style.background = "#2a2a2a";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = ASH;
                (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a";
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Tab bar — matching reference: horizontal, full-width, bordered */}
          <div className="flex">
            {MODAL_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-6 py-3 text-sm font-semibold transition-all relative"
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  color: tab === t.id ? WHITE : ASH,
                  background: tab === t.id ? "#1a1a1a" : "transparent",
                  border: `1px solid ${tab === t.id ? BORDER : "transparent"}`,
                  borderBottom: tab === t.id ? "1px solid #0d0d0d" : `1px solid ${BORDER}`,
                  borderRadius: "8px 8px 0 0",
                  marginBottom: "-1px",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* ─── SPECIFICATIONS ─── */}
          {tab === "specs" && (
            <div>
              {/* Two-column grid — matching reference exactly */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
                {battery.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className={`py-4 ${spec.highlight ? "col-span-1 md:col-span-2 mt-2" : ""}`}
                    style={{ borderBottom: spec.highlight ? "none" : `1px solid #1a1a1a` }}
                  >
                    <p
                      className="text-xs mb-1"
                      style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}
                    >
                      {spec.label}
                    </p>
                    <p
                      className={`font-semibold ${spec.highlight ? "text-2xl" : "text-base"}`}
                      style={{
                        color: spec.highlight ? AQUA : WHITE,
                        fontFamily: "'GeneralSans', sans-serif",
                        fontWeight: spec.highlight ? 700 : 600,
                      }}
                    >
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Datasheet link */}
              <div className="mt-6 pt-6" style={{ borderTop: `1px solid #1a1a1a` }}>
                <a
                  href={battery.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                  style={{ background: AQUA, color: "#000", fontFamily: "'Urbanist', sans-serif" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                >
                  <FileText size={14} />
                  View Official Datasheet
                </a>
              </div>
            </div>
          )}

          {/* ─── COMPANY BACKGROUND ─── */}
          {tab === "company" && (
            <div className="space-y-6">
              {/* KPI strip */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Founded", value: battery.companyBackground.founded, icon: <Building2 size={15} style={{ color: AQUA }} /> },
                  { label: "Headquarters", value: battery.companyBackground.headquarters, icon: <Building2 size={15} style={{ color: AQUA }} /> },
                  { label: "Certifications", value: battery.companyBackground.certifications, icon: <Star size={15} style={{ color: AQUA }} /> },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl p-4"
                    style={{ background: "#111", border: `1px solid #1e1e1e` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ASH, fontFamily: "'Urbanist', sans-serif" }}>
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "'GeneralSans', sans-serif" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Company overview */}
              <div className="rounded-xl p-5" style={{ background: "#111", border: `1px solid #1e1e1e` }}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: AQUA, fontFamily: "'Urbanist', sans-serif" }}>
                  Company Overview
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                  {battery.companyBackground.overview}
                </p>
              </div>

              {/* Australia presence */}
              <div className="rounded-xl p-5" style={{ background: "#111", border: `1px solid #1e1e1e` }}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: AQUA, fontFamily: "'Urbanist', sans-serif" }}>
                  Australian Market Presence
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                  {battery.companyBackground.australiaPresence}
                </p>
              </div>
            </div>
          )}

          {/* ─── COMPATIBLE INVERTERS ─── */}
          {tab === "inverters" && (
            <div className="space-y-4">
              <div
                className="rounded-xl p-4 text-sm mb-2"
                style={{ background: "#0d1a18", borderLeft: `3px solid ${AQUA}` }}
              >
                <p style={{ color: "#ccc", fontFamily: "'GeneralSans', sans-serif" }}>
                  The following inverters are compatible with the <strong style={{ color: WHITE }}>{battery.brand} {battery.model}</strong>.
                  Always consult your accredited installer to confirm the optimal inverter pairing for your specific site requirements.
                </p>
              </div>

              {battery.compatibleInverters.map((inv, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{ background: "#111", border: `1px solid #1e1e1e` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "#1a1a1a" }}
                      >
                        <Zap size={15} style={{ color: AQUA }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                          {inv.name}
                        </h4>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "#1a1a1a", color: AQUA, border: `1px solid #2a2a2a`, fontFamily: "'GeneralSans', sans-serif" }}
                        >
                          {inv.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm ml-12" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
                    {inv.notes}
                  </p>
                </div>
              ))}

              <div className="rounded-xl p-4 mt-2" style={{ background: "#0a0a0a", border: `1px dashed #2a2a2a` }}>
                <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
                  <strong style={{ color: WHITE }}>Note:</strong> Inverter compatibility may vary depending on firmware versions and installation configuration.
                  Lightning Energy recommends consulting with a CEC-accredited installer before finalising your system design.
                </p>
              </div>
            </div>
          )}

          {/* ─── FEATURES ─── */}
          {tab === "features" && (
            <div className="space-y-6">
              {battery.features.map((section, si) => (
                <div key={si}>
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                    style={{ color: AQUA, fontFamily: "'Urbanist', sans-serif" }}
                  >
                    <span className="w-4 h-px inline-block" style={{ background: AQUA }} />
                    {section.category}
                  </h3>
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid #1e1e1e` }}>
                    {section.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="flex gap-4 px-5 py-4"
                        style={{
                          borderBottom: ii < section.items.length - 1 ? `1px solid #1a1a1a` : "none",
                          background: ii % 2 === 0 ? "#111" : "#0d0d0d",
                        }}
                      >
                        <div className="w-48 shrink-0">
                          <p className="text-xs" style={{ color: ASH, fontFamily: "'GeneralSans', sans-serif" }}>
                            {item.label}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white" style={{ fontFamily: "'GeneralSans', sans-serif" }}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Datasheet link at bottom of features */}
              <div className="pt-2">
                <a
                  href={battery.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                  style={{ background: "transparent", color: AQUA, border: `1px solid ${AQUA}`, fontFamily: "'Urbanist', sans-serif" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = AQUA;
                    (e.currentTarget as HTMLAnchorElement).style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = AQUA;
                  }}
                >
                  <FileText size={14} />
                  View Official Datasheet
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

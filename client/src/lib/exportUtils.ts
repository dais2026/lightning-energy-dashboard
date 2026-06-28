/**
 * exportUtils.ts — Battery Data Export Utilities
 * Exports the full battery comparison dataset to CSV or JSON.
 * Used by the "Export Report" button in the dashboard.
 */

import type { Battery } from './batteryData';

// ── CSV Export ─────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  'Brand',
  'Model',
  'Year',
  'Origin',
  'Capacity',
  'Efficiency (%)',
  'Peak Power (kW)',
  'Continuous Power (kW)',
  'Price per kWh ($AUD)',
  'Total Cost ($AUD)',
  'Warranty',
  'Built-in Inverter',
  'Three Phase',
  'EV Charging',
  'Smart Features',
  'High Power',
  'Datasheet URL',
];

function booleanToLabel(val: boolean | 'partial'): string {
  if (val === true) return 'Yes';
  if (val === false) return 'No';
  return 'Partial';
}

function escapeCSV(val: string | number): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function batteryToCSVRow(b: Battery): string {
  return [
    b.brand,
    b.model,
    b.year,
    b.origin,
    b.capacity,
    b.efficiency,
    b.peakPower,
    b.continuousPower,
    b.pricePerKwh,
    b.totalCost,
    b.warranty,
    booleanToLabel(b.builtInInverter),
    booleanToLabel(b.threePhase),
    booleanToLabel(b.evCharging),
    booleanToLabel(b.smartFeatures),
    booleanToLabel(b.highPower),
    b.datasheetUrl,
  ]
    .map(escapeCSV)
    .join(',');
}

export function exportToCSV(batteries: Battery[], filename = 'lightning-energy-battery-comparison'): void {
  const rows = [
    CSV_HEADERS.join(','),
    ...batteries.map(batteryToCSVRow),
  ];
  const csvContent = rows.join('\n');
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

// ── JSON Export ────────────────────────────────────────────────────────────

interface ExportSummary {
  exportedAt: string;
  totalBatteries: number;
  generatedBy: string;
  version: string;
  batteries: BatteryExportRecord[];
}

interface BatteryExportRecord {
  brand: string;
  model: string;
  year: number;
  origin: string;
  capacity: string;
  efficiency: number;
  peakPowerKw: number;
  continuousPowerKw: number;
  pricePerKwhAud: number;
  totalCostAud: number;
  warranty: string;
  builtInInverter: boolean | 'partial';
  threePhase: boolean | 'partial';
  evCharging: boolean | 'partial';
  smartFeatures: boolean | 'partial';
  highPower: boolean | 'partial';
  datasheetUrl: string;
}

export function exportToJSON(batteries: Battery[], filename = 'lightning-energy-battery-comparison'): void {
  const summary: ExportSummary = {
    exportedAt: new Date().toISOString(),
    totalBatteries: batteries.length,
    generatedBy: 'Lightning Energy Dashboard v1.3.0',
    version: '1.0',
    batteries: batteries.map(b => ({
      brand: b.brand,
      model: b.model,
      year: b.year,
      origin: b.origin,
      capacity: b.capacity,
      efficiency: b.efficiency,
      peakPowerKw: b.peakPower,
      continuousPowerKw: b.continuousPower,
      pricePerKwhAud: b.pricePerKwh,
      totalCostAud: b.totalCost,
      warranty: b.warranty,
      builtInInverter: b.builtInInverter,
      threePhase: b.threePhase,
      evCharging: b.evCharging,
      smartFeatures: b.smartFeatures,
      highPower: b.highPower,
      datasheetUrl: b.datasheetUrl,
    })),
  };
  const jsonContent = JSON.stringify(summary, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

// ── Markdown Export ─────────────────────────────────────────────────────────

export function exportToMarkdown(batteries: Battery[], filename = 'lightning-energy-battery-comparison'): void {
  const rows = batteries.map(b =>
    `| ${b.brand} ${b.model} | ${b.year} | ${b.origin} | ${b.capacity} | ${b.efficiency}% | ${b.peakPower} kW | $${b.pricePerKwh}/kWh | $${b.totalCost.toLocaleString()} | ${b.warranty} |`
  );

  const md = [
    '# Lightning Energy — Battery Storage Comparison',
    '',
    `> Generated: ${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}  `,
    `> Prepared by: George Fotopoulos, Lightning Energy  `,
    `> Contact: george.f@lightning-energy.com.au | 0419 574 520`,
    '',
    '## Battery Systems Compared',
    '',
    '| Battery | Year | Origin | Capacity | Efficiency | Peak Power | Cost/kWh | Total Cost | Warranty |',
    '|---------|------|--------|----------|------------|------------|----------|------------|----------|',
    ...rows,
    '',
    '## Feature Matrix',
    '',
    '| Battery | Built-in Inverter | 3-Phase | EV Charging | Smart Features | High Power |',
    '|---------|-------------------|---------|-------------|----------------|------------|',
    ...batteries.map(b =>
      `| ${b.brand} ${b.model} | ${booleanToLabel(b.builtInInverter)} | ${booleanToLabel(b.threePhase)} | ${booleanToLabel(b.evCharging)} | ${booleanToLabel(b.smartFeatures)} | ${booleanToLabel(b.highPower)} |`
    ),
    '',
    '---',
    '',
    '*Lightning Energy, Malvern East VIC 3145 — lightning-energy.com.au*',
  ].join('\n');

  downloadFile(md, `${filename}.md`, 'text/markdown');
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke the object URL after a short delay to allow the download to start
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

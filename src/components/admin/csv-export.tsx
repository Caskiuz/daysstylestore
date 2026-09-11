"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Row = Record<string, string | number>;

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(";"), ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(";"))].join("\n");
}

export function CsvExport({ range, data }: { range: string; data: Record<string, Row[]> }) {
  function download() {
    const sections = Object.entries(data).filter(([, rows]) => rows.length > 0);
    if (sections.length === 0) {
      alert("No hay datos en el período para exportar.");
      return;
    }
    const csv = sections
      .map(([name, rows]) => `### ${name.toUpperCase()}\n${toCsv(rows)}`)
      .join("\n\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `days-style-informe-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={download}>
      <Download size={16} /> Exportar CSV
    </Button>
  );
}

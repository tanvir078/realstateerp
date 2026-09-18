import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Download, FileSpreadsheet, FileText, Calendar, 
  CheckSquare, Square, Filter
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
  availableColumns?: string[];
  defaultColumns?: string[];
  title?: string;
}

interface ExportConfig {
  format: "CSV" | "EXCEL" | "PDF";
  dateRange: {
    startDate: string;
    endDate: string;
  };
  dataScope: "ALL" | "FILTERED";
  includeColumns: string[];
}

export default function ExportModal({ 
  isOpen, 
  onClose, 
  onExport, 
  availableColumns = [],
  defaultColumns = [],
  title = "Export Data"
}: ExportModalProps) {
  const [format, setFormat] = useState<"CSV" | "EXCEL" | "PDF">("CSV");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataScope, setDataScope] = useState<"ALL" | "FILTERED">("ALL");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultColumns);

  if (!isOpen) return null;

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const toggleAllColumns = () => {
    if (selectedColumns.length === availableColumns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(availableColumns);
    }
  };

  const handleExport = () => {
    const config: ExportConfig = {
      format,
      dateRange: {
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date().toISOString().split('T')[0]
      },
      dataScope,
      includeColumns: selectedColumns
    };
    onExport(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{title}</h2>
              <p className="text-xs text-[#829B96]">Select export format and options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* File Format */}
          <div className="space-y-2">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#10B981]" /> File Format <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "CSV", label: "CSV", icon: FileSpreadsheet },
                { value: "EXCEL", label: "Excel (.xlsx)", icon: FileSpreadsheet },
                { value: "PDF", label: "PDF Document", icon: FileText }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value as any)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                    format === option.value
                      ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981]"
                      : "bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:text-white hover:border-[#829B96]"
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#10B981]" /> Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#829B96] mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#829B96] mb-1 block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>
          </div>

          {/* Data Scope */}
          <div className="space-y-2">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-[#10B981]" /> Data Scope
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setDataScope("ALL")}
                className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
                  dataScope === "ALL"
                    ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-medium"
                    : "bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:text-white"
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setDataScope("FILTERED")}
                className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
                  dataScope === "FILTERED"
                    ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] font-medium"
                    : "bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:text-white"
                }`}
              >
                Filtered Only
              </button>
            </div>
          </div>

          {/* Include Columns */}
          {availableColumns.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-[#10B981]" /> Include Columns
                </label>
                <button
                  onClick={toggleAllColumns}
                  className="text-[10px] text-[#10B981] hover:underline"
                >
                  {selectedColumns.length === availableColumns.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="bg-[#0B1816] border border-[#1E3E37] rounded-lg p-3 max-h-32 overflow-y-auto grid grid-cols-2 gap-2">
                {availableColumns.map((column) => (
                  <button
                    key={column}
                    onClick={() => toggleColumn(column)}
                    className="flex items-center gap-2 text-left text-[#829B96] hover:text-white transition-colors"
                  >
                    {selectedColumns.includes(column) ? (
                      <CheckSquare className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : (
                      <Square className="h-3.5 w-3.5" />
                    )}
                    <span className="text-[11px]">{column}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E3E37]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:bg-[#1A3530] hover:text-white text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Download File
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

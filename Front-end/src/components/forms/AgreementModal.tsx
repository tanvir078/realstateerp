import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, FileText, Printer, Download, Eye, CheckCircle2, Building, User, Calendar, DollarSign
} from "lucide-react";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  defaultClientData?: any;
  defaultProjectData?: any;
  defaultUnitData?: any;
}

export default function AgreementModal({ 
  isOpen, 
  onClose, 
  onSave,
  defaultClientData,
  defaultProjectData,
  defaultUnitData 
}: AgreementModalProps) {
  const [documentType, setDocumentType] = useState<string>("SALE_AGREEMENT");
  const [agreementDate, setAgreementDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [agreementNo, setAgreementNo] = useState<string>(`AGR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const [witnessName, setWitnessName] = useState<string>("");
  const [witnessAddress, setWitnessAddress] = useState<string>("");
  const [termsConditions, setTermsConditions] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const documentTypes = [
    { value: "SALE_AGREEMENT", label: "Sale Agreement", icon: FileText },
    { value: "ALLOTMENT_LETTER", label: "Allotment Letter", icon: Building },
    { value: "PAYMENT_SCHEDULE", label: "Payment Schedule", icon: Calendar },
    { value: "DEED_OF_AGREEMENT", label: "Deed of Agreement", icon: FileText },
  ];

  const handleGenerate = () => {
    if (!documentType) {
      setError("Please select a document type.");
      return;
    }
    setError("");
    
    const agreementData = {
      documentType,
      agreementNo,
      agreementDate,
      clientData: defaultClientData,
      projectData: defaultProjectData,
      unitData: defaultUnitData,
      witnessName,
      witnessAddress,
      termsConditions
    };

    if (onSave) onSave(agreementData);
    setIsPreviewOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = [
      `${documentType.replaceAll("_", " ")} - ${agreementNo}`,
      `Date: ${agreementDate}`,
      `Client: ${defaultClientData?.name ?? "N/A"}`,
      `Project: ${defaultProjectData?.projectName ?? "N/A"}`,
      `Unit: ${defaultUnitData?.unitCode ?? defaultUnitData?.unitNo ?? "N/A"}`,
      "",
      termsConditions,
      "",
      `Witness: ${witnessName || "N/A"}`,
      `Witness address: ${witnessAddress || "N/A"}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${agreementNo}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b1715] border border-[#1e3e37] w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl text-[#e2e8f0] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3e37] bg-[#081210] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center">
              <FileText className="h-4 w-4 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Agreement Document Generator
              </h2>
              <p className="text-[11px] text-[#829b96]">
                Generate legal documents for property booking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-[#112421] border border-[#1e3e37] text-[#829b96] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
          
          {/* Section 1: Document Type Selection */}
          <div className="bg-[#0f211e] border border-[#1e3e37] p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3e37] pb-2.5">
              <FileText className="h-4 w-4 text-[#10b981]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Document Type
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {documentTypes.map((doc) => (
                <button
                  key={doc.value}
                  type="button"
                  onClick={() => setDocumentType(doc.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    documentType === doc.value
                      ? "bg-[#10b981]/10 border-[#10b981] text-[#10b981]"
                      : "bg-[#0b1715] border-[#1e3e37] text-[#829b96] hover:text-white hover:border-[#10b981]/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <doc.icon className="h-4 w-4" />
                    <span className="text-xs font-bold">{doc.label}</span>
                  </div>
                  <p className="text-[10px] opacity-80">
                    {doc.value === "SALE_AGREEMENT" && "Legal sale agreement between parties"}
                    {doc.value === "ALLOTMENT_LETTER" && "Official allotment confirmation"}
                    {doc.value === "PAYMENT_SCHEDULE" && "Payment installment schedule"}
                    {doc.value === "DEED_OF_AGREEMENT" && "Registered deed of agreement"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Agreement Details */}
          <div className="bg-[#0f211e] border border-[#1e3e37] p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3e37] pb-2.5">
              <Building className="h-4 w-4 text-[#10b981]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Agreement Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Agreement Number
                </label>
                <input
                  type="text"
                  value={agreementNo}
                  onChange={(e) => setAgreementNo(e.target.value)}
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white font-mono focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Agreement Date
                </label>
                <input
                  type="date"
                  value={agreementDate}
                  onChange={(e) => setAgreementDate(e.target.value)}
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Party Information (Read-only) */}
          {(defaultClientData || defaultProjectData || defaultUnitData) && (
            <div className="bg-[#0f211e] border border-[#1e3e37] p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1e3e37] pb-2.5">
                <User className="h-4 w-4 text-[#10b981]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Party Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultClientData && (
                  <div className="bg-[#0b1715] border border-[#1e3e37] rounded-lg p-3 space-y-1">
                    <p className="text-[10px] text-[#829b96] font-medium uppercase">Client</p>
                    <p className="text-xs font-bold text-white">{defaultClientData.name || "N/A"}</p>
                    <p className="text-[11px] text-[#829b96]">{defaultClientData.phone || "N/A"}</p>
                  </div>
                )}
                {defaultProjectData && (
                  <div className="bg-[#0b1715] border border-[#1e3e37] rounded-lg p-3 space-y-1">
                    <p className="text-[10px] text-[#829b96] font-medium uppercase">Project</p>
                    <p className="text-xs font-bold text-white">{defaultProjectData.name || "N/A"}</p>
                    <p className="text-[11px] text-[#829b96]">{defaultProjectData.location || "N/A"}</p>
                  </div>
                )}
                {defaultUnitData && (
                  <div className="bg-[#0b1715] border border-[#1e3e37] rounded-lg p-3 space-y-1 sm:col-span-2">
                    <p className="text-[10px] text-[#829b96] font-medium uppercase">Unit</p>
                    <p className="text-xs font-bold text-white">{defaultUnitData.unitCode || "N/A"}</p>
                    <p className="text-[11px] text-[#829b96]">
                      Size: {defaultUnitData.size || "N/A"} SFT | Price: ৳ {(defaultUnitData.totalPrice || 0).toLocaleString("en-BD")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Witness Information */}
          <div className="bg-[#0f211e] border border-[#1e3e37] p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3e37] pb-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Witness Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Witness Name
                </label>
                <input
                  type="text"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  placeholder="Enter witness name"
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a3b8b4]">
                  Witness Address
                </label>
                <input
                  type="text"
                  value={witnessAddress}
                  onChange={(e) => setWitnessAddress(e.target.value)}
                  placeholder="Enter witness address"
                  className="w-full h-10 bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#10b981]"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Terms & Conditions */}
          <div className="bg-[#0f211e] border border-[#1e3e37] p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3e37] pb-2.5">
              <FileText className="h-4 w-4 text-[#10b981]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Terms & Conditions
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#a3b8b4]">
                Additional Terms (Optional)
              </label>
              <textarea
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                placeholder="Enter any additional terms and conditions..."
                rows={4}
                className="w-full bg-[#0b1715] border border-[#1e3e37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e3e37]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#112421] border border-[#1e3e37] text-white hover:bg-[#1a3530] text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGenerate}
              className="bg-[#10b981] hover:bg-[#0d9668] text-slate-950 font-semibold text-xs gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Generate Document
            </Button>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-300 w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-gray-50 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {documentTypes.find(d => d.value === documentType)?.label}
                </h3>
                <p className="text-xs text-gray-600">Agreement No: {agreementNo}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
                >
                  Close
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-xs text-gray-700 space-y-4">
                <div className="text-center border-b border-gray-300 pb-4">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                    {documentTypes.find(d => d.value === documentType)?.label}
                  </h2>
                  <p className="text-gray-600 mt-1">Agreement No: {agreementNo}</p>
                  <p className="text-gray-600">Date: {agreementDate}</p>
                </div>

                {defaultClientData && (
                  <div className="border border-gray-300 rounded p-3">
                    <p className="font-semibold text-gray-900 mb-2">First Party (Buyer):</p>
                    <p className="text-gray-700">Name: {defaultClientData.name || "N/A"}</p>
                    <p className="text-gray-700">Phone: {defaultClientData.phone || "N/A"}</p>
                    <p className="text-gray-700">Address: {defaultClientData.address || "N/A"}</p>
                  </div>
                )}

                {defaultProjectData && (
                  <div className="border border-gray-300 rounded p-3">
                    <p className="font-semibold text-gray-900 mb-2">Second Party (Developer):</p>
                    <p className="text-gray-700">Project: {defaultProjectData.name || "N/A"}</p>
                    <p className="text-gray-700">Location: {defaultProjectData.location || "N/A"}</p>
                  </div>
                )}

                {defaultUnitData && (
                  <div className="border border-gray-300 rounded p-3">
                    <p className="font-semibold text-gray-900 mb-2">Property Details:</p>
                    <p className="text-gray-700">Unit: {defaultUnitData.unitCode || "N/A"}</p>
                    <p className="text-gray-700">Size: {defaultUnitData.size || "N/A"} SFT</p>
                    <p className="text-gray-700">Total Price: ৳ {(defaultUnitData.totalPrice || 0).toLocaleString("en-BD")}</p>
                  </div>
                )}

                {witnessName && (
                  <div className="border border-gray-300 rounded p-3">
                    <p className="font-semibold text-gray-900 mb-2">Witness:</p>
                    <p className="text-gray-700">Name: {witnessName}</p>
                    <p className="text-gray-700">Address: {witnessAddress || "N/A"}</p>
                  </div>
                )}

                {termsConditions && (
                  <div className="border border-gray-300 rounded p-3">
                    <p className="font-semibold text-gray-900 mb-2">Terms & Conditions:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{termsConditions}</p>
                  </div>
                )}

                <div className="border-t border-gray-300 pt-4 mt-4">
                  <p className="text-gray-600 text-center">
                    This document is automatically generated by SLBL-ERP System.
                  </p>
                  <p className="text-gray-600 text-center mt-1">
                    Generated on: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Upload, FileText, CheckCircle2, AlertCircle,
  Building2, Calendar, FileUp
} from "lucide-react";

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: UploadData) => void;
  title?: string;
  targetOptions?: Array<{ id: string; name: string }>;
  targetLabel?: string;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
}

interface UploadData {
  targetId: string;
  file: File;
  skipHeaderRows?: number;
  dateFormat?: string;
}

export default function UploadFileModal({ 
  isOpen, 
  onClose, 
  onUpload,
  title = "Upload File",
  targetOptions = [],
  targetLabel = "Target",
  acceptedFileTypes = ".csv,.xlsx,.pdf",
  maxFileSizeMB = 5
}: UploadFileModalProps) {
  const [targetId, setTargetId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [skipHeaderRows, setSkipHeaderRows] = useState("0");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setUploadError("");
    
    // Check file type
    const fileExtension = "." + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      setUploadError(`Invalid file type. Accepted: ${acceptedFileTypes}`);
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      setUploadError(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }
    if (!targetId) {
      setUploadError(`Please select a ${targetLabel.toLowerCase()}`);
      return;
    }

    const data: UploadData = {
      targetId,
      file: selectedFile,
      skipHeaderRows: parseInt(skipHeaderRows),
      dateFormat
    };
    onUpload(data);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{title}</h2>
              <p className="text-xs text-[#829B96]">Upload file from your device</p>
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
        <div className="p-6 space-y-4 text-xs">
          
          {/* Target Selection */}
          {targetOptions.length > 0 && (
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#10B981]" /> {targetLabel} <span className="text-rose-400">*</span>
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
                required
              >
                <option value="">Select {targetLabel.toLowerCase()}</option>
                {targetOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-[#0B1816]">
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <FileUp className="h-3.5 w-3.5 text-[#10B981]" /> File <span className="text-rose-400">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#10B981] bg-[#10B981]/5"
                  : "border-[#1E3E37] bg-[#0B1816] hover:border-[#829B96]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[#10B981]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">File Selected</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[#829B96]">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-[10px] text-[#829B96]">{formatFileSize(selectedFile.size)}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-[#829B96]" />
                  <p className="text-[#829B96]">
                    Drag & drop file here, or <span className="text-[#10B981] font-medium">browse</span>
                  </p>
                  <p className="text-[10px] text-[#829B96]">
                    Accepted: {acceptedFileTypes} (Max {maxFileSizeMB}MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Options */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Skip Header Rows</label>
              <input
                type="number"
                value={skipHeaderRows}
                onChange={(e) => setSkipHeaderRows(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#10B981]"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-rose-400">{uploadError}</p>
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
              onClick={handleUpload}
              disabled={!selectedFile || (targetOptions.length > 0 && !targetId)}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload File
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

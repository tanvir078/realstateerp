import React from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, AlertTriangle, CheckCircle, Info, 
  Trash2, Check, XCircle
} from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: "DANGER" | "WARNING" | "SUCCESS";
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  variant = "DANGER",
  confirmText = "Confirm",
  cancelText = "Cancel"
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantConfig = {
    DANGER: {
      icon: Trash2,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
      confirmBg: "bg-rose-500",
      confirmHover: "hover:bg-rose-600",
      borderColor: "border-rose-500/30"
    },
    WARNING: {
      icon: AlertTriangle,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      confirmBg: "bg-amber-500",
      confirmHover: "hover:bg-amber-600",
      borderColor: "border-amber-500/30"
    },
    SUCCESS: {
      icon: CheckCircle,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      confirmBg: "bg-emerald-500",
      confirmHover: "hover:bg-emerald-600",
      borderColor: "border-emerald-500/30"
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${config.iconBg} rounded-lg ${config.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{title}</h2>
              <p className="text-xs text-[#829B96]">Please confirm your action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829B96] hover:text-white hover:bg-[#1A3530] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#E2E8F0] leading-relaxed">
            {description}
          </p>
          
          {variant === "DANGER" && (
            <div className="flex items-start gap-2 p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg">
              <Info className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-rose-400/90">
                This action cannot be undone. Please be certain before proceeding.
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#1E3E37] bg-[#0B1816]">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:bg-[#1A3530] hover:text-white text-xs h-9 px-4"
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`${config.confirmBg} ${config.confirmHover} text-white font-bold text-xs h-9 px-5 gap-1.5`}
          >
            <Check className="h-3.5 w-3.5" />
            {confirmText}
          </Button>
        </div>

      </div>
    </div>
  );
}

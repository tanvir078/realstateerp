import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  X, Send, Mail, MessageCircle, Phone, 
  FileText, Paperclip, CheckCircle2
} from "lucide-react";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: NotificationData) => void;
  recipientName?: string;
  recipientContact?: string;
  defaultSubject?: string;
  defaultMessage?: string;
}

interface NotificationData {
  channel: "SMS" | "EMAIL" | "WHATSAPP";
  recipientContact: string;
  subject?: string;
  message: string;
  attachPDF: boolean;
}

export default function SendNotificationModal({ 
  isOpen, 
  onClose, 
  onSend,
  recipientName = "",
  recipientContact = "",
  defaultSubject = "",
  defaultMessage = ""
}: SendNotificationModalProps) {
  const [channel, setChannel] = useState<"SMS" | "EMAIL" | "WHATSAPP">("EMAIL");
  const [contact, setContact] = useState(recipientContact);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [attachPDF, setAttachPDF] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    const data: NotificationData = {
      channel,
      recipientContact: contact,
      subject: channel === "EMAIL" ? subject : undefined,
      message,
      attachPDF
    };
    onSend(data);
    onClose();
  };

  const channelConfig = {
    SMS: {
      icon: MessageCircle,
      label: "SMS",
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/30"
    },
    EMAIL: {
      icon: Mail,
      label: "Email",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30"
    },
    WHATSAPP: {
      icon: Phone,
      label: "WhatsApp",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#112421] border border-[#1E3E37] rounded-xl shadow-2xl overflow-hidden text-[#E2E8F0] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3E37] bg-[#0B1816]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10B981]/10 rounded-lg text-[#10B981]">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Send Notification</h2>
              <p className="text-xs text-[#829B96]">
                {recipientName ? `To: ${recipientName}` : "Send to recipient"}
              </p>
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
          
          {/* Channel Selection */}
          <div className="space-y-2">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5 text-[#10B981]" /> Notification Channel <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(channelConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setChannel(key as any)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                      channel === key
                        ? `${config.bgColor} ${config.borderColor} ${config.color} border`
                        : "bg-[#0B1816] border-[#1E3E37] text-[#829B96] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient Contact */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              {channel === "EMAIL" ? (
                <Mail className="h-3.5 w-3.5 text-[#10B981]" />
              ) : (
                <Phone className="h-3.5 w-3.5 text-[#10B981]" />
              )}
              Recipient {channel === "EMAIL" ? "Email" : "Phone"} <span className="text-rose-400">*</span>
            </label>
            <input
              type={channel === "EMAIL" ? "email" : "tel"}
              placeholder={channel === "EMAIL" ? "recipient@example.com" : "0171-234567"}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Subject (Email only) */}
          {channel === "EMAIL" && (
            <div className="space-y-1">
              <label className="text-[#829B96] font-medium flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#10B981]" /> Subject <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg px-3 py-2 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          )}

          {/* Message */}
          <div className="space-y-1">
            <label className="text-[#829B96] font-medium flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-[#10B981]" /> Message <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#0B1816] border border-[#1E3E37] rounded-lg p-2.5 text-white placeholder-[#829B96] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {/* Attach PDF Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#0B1816] border border-[#1E3E37] rounded-lg">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-[#829B96]" />
              <span className="text-[#829B96]">Attach PDF Document</span>
            </div>
            <button
              onClick={() => setAttachPDF(!attachPDF)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                attachPDF ? "bg-[#10B981]" : "bg-[#1E3E37]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  attachPDF ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

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
              onClick={handleSend}
              className="bg-[#10B981] hover:bg-[#0D9668] text-slate-950 font-bold text-xs h-9 px-5 gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Send {channel === "EMAIL" ? "Email" : channel === "SMS" ? "SMS" : "WhatsApp"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

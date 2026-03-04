import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Mail, MessageCircle, X } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  shareUrl: string;
  onClose: () => void;
}

export default function ShareModal({ open, shareUrl, onClose }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!open) setIsCopied(false);
  }, [open]);

  const whatsappLink = useMemo(() => {
    const message = `Check out my 3D bookmark space: ${shareUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [shareUrl]);

  const gmailLink = useMemo(() => {
    const subject = "My 3D Bookmark Space";
    const body = `Check it here: ${shareUrl}`;
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [shareUrl]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setIsCopied(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-200/20 bg-slate-950/95 p-6 text-cyan-50 shadow-[0_24px_80px_rgba(2,6,23,0.8)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Share 3D Space</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close share modal">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-sm text-cyan-100/70">
          Anyone with this link can view your 3D bookmarks in read-only mode.
        </p>

        <div className="mt-4 space-y-3">
          <label className="text-xs uppercase tracking-wider text-cyan-100/60">Share URL</label>
          <Input readOnly value={shareUrl} className="bg-cyan-950/20 border-cyan-200/20 text-cyan-50" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button asChild className="gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <a href={gmailLink}>
              <Mail className="h-4 w-4" /> Gmail
            </a>
          </Button>
          <Button variant="outline" className="gap-2" onClick={copyLink}>
            <Copy className="h-4 w-4" /> Copy Link
          </Button>
        </div>

        {isCopied ? <p className="mt-3 text-sm text-emerald-300">Link Copied!</p> : null}
      </div>
    </div>
  );
}

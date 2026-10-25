import { Copy } from "lucide-react";
import { copyText } from "@/utils/copy";

export default function CopyButton({ text, label = "Copy command" }) {
  return (
    <button className="copy-btn" onClick={() => copyText(text)} aria-label={label} title={label}>
      <Copy size={16} />
    </button>
  );
}

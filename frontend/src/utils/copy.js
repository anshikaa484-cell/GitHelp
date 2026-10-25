import { toast } from "sonner";

export async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const ta = document.createElement("textarea"); // fallback for older browsers
    ta.value = value;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  toast.success("Command copied", { description: value.split("\n")[0] });
}

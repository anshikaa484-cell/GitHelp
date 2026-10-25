import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const empty = { name: "", email: "", category: "", message: "", rating: "" };

// Controlled inputs: every field's value lives in `values` (useState).
export default function Feedback() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Enter your name.";
    if (!v.email.trim()) e.email = "Enter your email.";
    else if (!EMAIL.test(v.email)) e.email = "Enter a valid email, like name@example.com.";
    if (!v.category) e.category = "Choose a category.";
    if (v.message.trim().length < 10) e.message = "Write at least 10 characters.";
    return e;
  };

  const change = (e) => { setSent(false); setValues((v) => ({ ...v, [e.target.name]: e.target.value })); };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return; // invalid: keep values, show errors
    setBusy(true);
    setTimeout(() => { setBusy(false); setSent(true); setValues(empty); }, 600); // no server: handled locally
  };

  const Field = ({ name, label, children }) => (
    <div>
      <label htmlFor={name} className="field-label">{label}</label>
      {children}
      {errors[name] && <p id={`${name}-err`} className="field-error" role="alert">{errors[name]}</p>}
    </div>
  );
  const a11y = (n) => ({ id: n, name: n, value: values[n], onChange: change, "aria-invalid": !!errors[n], "aria-describedby": errors[n] ? `${n}-err` : undefined, className: "field-input" });

  return (
    <div className="page container" data-testid="feedback-page">
      <div className="page-head"><span className="eyebrow">Feedback</span><h1 style={{ marginTop: 16 }}>Tell us what to improve</h1>
        <p>GIThelp has no backend. Your feedback is checked in your browser and <strong>is not sent anywhere</strong>.</p></div>
      {sent && <p className="feedback ok" role="status" data-testid="success"><CheckCircle2 size={16} /> Thanks. Your feedback passed validation (it was not sent to a server).</p>}
      <form className="panel form-grid" onSubmit={submit} noValidate>
        <Field name="name" label="Name"><input {...a11y("name")} autoComplete="name" /></Field>
        <Field name="email" label="Email"><input {...a11y("email")} type="email" autoComplete="email" /></Field>
        <Field name="category" label="Category"><select {...a11y("category")}><option value="">Select one</option><option>Bug</option><option>Content correction</option><option>Feature idea</option><option>Other</option></select></Field>
        <Field name="rating" label="Rating (optional)"><select {...a11y("rating")}><option value="">No rating</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} of 5</option>)}</select></Field>
        <div style={{ gridColumn: "1 / -1" }}><Field name="message" label="Message"><textarea {...a11y("message")} rows={5} /></Field></div>
        <div><button className="btn btn-primary" type="submit" disabled={busy} data-testid="submit">{busy ? "Checking..." : "Send feedback"}</button></div>
      </form>
    </div>
  );
}

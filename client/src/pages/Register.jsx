import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function onSubmit(e) { e.preventDefault(); alert(`Register (demo): ${form.name} / ${form.email}`); }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Register</h2>
      <form className="row g-3" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <div className="col-12">
          <label className="form-label">Name</label>
          <input name="name" className="form-control" value={form.name} onChange={onChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-control" value={form.email} onChange={onChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Password</label>
          <input name="password" type="password" className="form-control" value={form.password} onChange={onChange} required />
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Create Account</button>
        </div>
      </form>
    </div>
  );
}

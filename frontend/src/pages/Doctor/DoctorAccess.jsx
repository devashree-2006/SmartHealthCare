import { useState } from "react";
import { apiRequest } from "../../services/api";

export default function DoctorAccess({ onLogin, onBack }) {
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    qualification: "",
    experience: "",
    hospital: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest(
        registering ? "/doctors/register" : "/doctors/login",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            experience: form.experience === "" ? 0 : Number(form.experience),
          }),
        }
      );
      onLogin(result.doctor);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button type="button" onClick={onBack}>← Choose another portal</button>
      <h1>CareSync</h1>
      <h2>{registering ? "Create Doctor Account" : "Doctor Login"}</h2>
      <p>{registering ? "Create a doctor account to manage patient appointments." : "Sign in to your doctor workspace."}</p>
      <form onSubmit={submit}>
        {registering && (
          <>
            <input name="name" placeholder="Full name" value={form.name} onChange={update} required />
            <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={update} required />
            <input name="phone" placeholder="Phone number" value={form.phone} onChange={update} />
            <input name="qualification" placeholder="Qualification" value={form.qualification} onChange={update} />
            <input name="experience" type="number" min="0" placeholder="Years of experience" value={form.experience} onChange={update} />
            <input name="hospital" placeholder="Hospital" value={form.hospital} onChange={update} />
          </>
        )}
        <input name="email" type="email" placeholder="Email address" value={form.email} onChange={update} required />
        <input name="password" type="password" minLength={registering ? 8 : undefined} placeholder={registering ? "Password (minimum 8 characters)" : "Password"} value={form.password} onChange={update} required />
        {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Please wait..." : registering ? "Create Account" : "Login"}</button>
      </form>
      <p>
        {registering ? "Already registered? " : "New doctor? "}
        <button type="button" onClick={() => { setRegistering((value) => !value); setError(""); }}>
          {registering ? "Login" : "Create an account"}
        </button>
      </p>
    </div>
  );
}

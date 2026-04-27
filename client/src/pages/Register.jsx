import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
  });

  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteCodeError, setInviteCodeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const isValidInviteCode = async (code) => {
    const response = await fetch(`http://localhost:4000/api/inviteCode/checkInviteCode/${code}`);
    const data = await response.json();
    return data.valid;
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
    setIsAdmin(e.target.value === "admin");
  };

  const handleInviteCodeChange = (e) => {
    setInviteCode(e.target.value);
    setInviteCodeError(false);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setEmailError(!validateEmail(e.target.value));
    } else if (e.target.name === "phoneNumber") {
      setPhoneError(!validatePhoneNumber(e.target.value));
    } else if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10,14}$/;
    return phonePattern.test(phoneNumber);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("You must have at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("You must have at least one number.");
    }
    setPasswordErrors(errors);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (isAdmin && !(await isValidInviteCode(inviteCode))) {
      setInviteCodeError(true);
      return;
    }

    fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ ...form, isAdmin }),
    })
      .then((result) => {
        alert("Successfully Registered, Now Login with your details");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setIsFormValid(
      form.firstName &&
      form.lastName &&
      validateEmail(form.email) &&
      form.password &&
      validatePhoneNumber(form.phoneNumber) &&
      form.role &&
      (!isAdmin || inviteCode) &&
      passwordErrors.length === 0
    );
  }, [form, inviteCode, isAdmin, passwordErrors]);

  return (
    <div className="min-h-screen bg-base-200/50 px-4 py-10 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm lg:grid-cols-2">
          <div className="hidden border-r border-base-200 bg-primary/5 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Retail Inventory Platform</p>
              <h1 className="mt-3 text-3xl font-bold text-base-content">Create account</h1>
              <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                Register as admin or customer to access stock operations and reporting dashboards.
              </p>
            </div>
            <div className="rounded-xl border border-base-300 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Secure Onboarding</p>
              <p className="mt-1 text-sm font-medium text-base-content">Invite code required for admin accounts</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-base-content">Sign up</h2>
              <p className="mt-1 text-sm text-base-content/60">Create your account to start managing retail operations.</p>
            </div>

            <form className="space-y-5" onSubmit={registerUser}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">First name</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="input input-bordered input-md w-full border-base-300"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">Last name</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="input input-bordered input-md w-full border-base-300"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email-address" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`input input-bordered input-md w-full ${emailError ? "input-error border-error" : "border-base-300"}`}
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleInputChange}
                />
                {emailError && <p className="mt-1 text-sm text-error">Invalid email address.</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input input-bordered input-md w-full border-base-300"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleInputChange}
                />
                {passwordErrors.length > 0 && (
                  <ul className="mt-2 list-inside list-disc text-sm text-error">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">Phone number</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  pattern="\d{10,14}"
                  required
                  className={`input input-bordered input-md w-full ${phoneError ? "input-error border-error" : "border-base-300"}`}
                  placeholder="10 to 14 digits"
                  value={form.phoneNumber}
                  onChange={handleInputChange}
                />
                {phoneError && <p className="mt-1 text-sm text-error">Invalid phone number.</p>}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">Account role</p>
                <div className="flex items-center gap-6 rounded-lg border border-base-300 p-3">
                  <label className="flex items-center gap-2 text-sm text-base-content">
                    <input type="radio" id="admin" name="role" value="admin" onChange={handleRoleChange} className="radio radio-sm" required />
                    Admin
                  </label>
                  <label className="flex items-center gap-2 text-sm text-base-content">
                    <input type="radio" id="customer" name="role" value="customer" onChange={handleRoleChange} className="radio radio-sm" required />
                    Customer
                  </label>
                </div>
              </div>

              {isAdmin && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-base-content/50">Invite code</label>
                  <input
                    type="text"
                    placeholder="Enter invite code"
                    className={`input input-bordered input-md w-full ${inviteCodeError ? "input-error border-error" : "border-base-300"}`}
                    value={inviteCode}
                    onChange={handleInviteCodeChange}
                  />
                  {inviteCodeError && <p className="mt-1 text-sm text-error">The invite code is invalid.</p>}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full transition-colors duration-200 hover:bg-opacity-90 disabled:btn-disabled"
                disabled={!isFormValid}
                onClick={registerUser}
              >
                Create account
              </button>

              <p className="text-center text-sm text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary transition-colors duration-200 hover:opacity-80">
                  Sign in now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

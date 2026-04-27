import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `http://localhost:${import.meta.env.VITE_API_PORT || "4000"}`;

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authCheck = () => {
    setTimeout(() => {
      fetch(`${API_BASE_URL}/api/login`)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data));
          authContext.signin(data._id, () => {
            if (data.isAdmin) {
              navigate("/");
            } else {
              navigate("/client");
            }
          });
        })
        .catch((err) => {
          alert("Wrong credentials, Try again");
          console.log(err);
        });
    }, 3000);
  };

  const loginUser = (e) => {
    // Cannot send empty data
    if (form.email === "" || form.password === "") {
      alert("To login user, enter details to proceed...");
    } else {
      fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((result) => {
          console.log("User login", result);
        })
        .catch((error) => {
          console.log("Something went wrong ", error);
        });
    }
    authCheck();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-base-200/50 px-4 py-10 font-['Inter','Segoe_UI','Roboto',sans-serif]">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm lg:grid-cols-2">
          <div className="hidden border-r border-base-200 bg-primary/5 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">Retail Inventory Platform</p>
              <h1 className="mt-3 text-3xl font-bold text-base-content">Stock Master</h1>
              <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                Monitor inventory movement, purchases, and sales across all locations in one secure workspace.
              </p>
            </div>
            <div className="rounded-xl border border-base-300 bg-base-100 p-4">
              <p className="text-xs uppercase tracking-wide text-base-content/50">Enterprise Access</p>
              <p className="mt-1 text-sm font-medium text-base-content">Authorized users only</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-base-content">Sign in</h2>
              <p className="mt-1 text-sm text-base-content/60">Use your account credentials to continue.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  className="input input-bordered input-md w-full border-base-300"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleInputChange}
                />
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
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-base-content/70">
                  <input id="remember-me" name="remember-me" type="checkbox" className="checkbox checkbox-sm" />
                  Remember me
                </label>
                <span className="text-sm font-medium text-primary">Forgot password?</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full transition-colors duration-200 hover:bg-opacity-90"
                onClick={loginUser}
              >
                Sign in
              </button>

              <p className="text-center text-sm text-base-content/60">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-primary transition-colors duration-200 hover:opacity-80">
                  Register now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

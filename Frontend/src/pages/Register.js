import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "", // Added role field for admin/customer selection
  });

  const navigate = useNavigate();

  // Handling Input change for registration form.
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Register User
  const registerUser = () => {
    fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((result) => {
        alert("Successfully Registered, Now Login with your details");
        navigate('/login')
        
      })
      .catch((err) => console.log(err));
  };
  // ------------------

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: "#6600FF" }}>
        <div className="w-full max-w-md space-y-8 p-10 rounded-lg bg-white">
          <div>
            <img
              className="mx-auto h-16 w-auto"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nokia_wordmark.svg/2560px-Nokia_wordmark.svg.png"
              alt="Nokia Logo"
            />
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInputChange}
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  name="phoneNumber"
                  type="number"
                  autoComplete="phoneNumber"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                  required
                />
                <label
                  htmlFor="admin"
                  className="block text-sm text-gray-900"
                >
                  Admin
                </label>
                <input
                  type="radio"
                  id="customer"
                  name="role"
                  value="customer"
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                  required
                />
                <label
                  htmlFor="customer"
                  className="block text-sm text-gray-900"
                >
                  Customer
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={registerUser}
              >
                Sign up
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <span
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Already Have an Account, Please
                  <Link to="/login"> Signin now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
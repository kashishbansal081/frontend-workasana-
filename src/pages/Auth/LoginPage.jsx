import { Link } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const LoginPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AppContext);

  const loginHandler = (e) => {
    e.preventDefault();

    if (!userEmail || !userPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    const loginData = {
      email: userEmail,
      password: userPassword,
    };

    fetch(API.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Login successful!");
        setUserEmail("");
        setUserPassword("");
        localStorage.setItem("token", result.token);
        setIsLoggedIn(true);
        navigate("/");
      })
      .catch((error) => {
        toast.error("Error logging in!");
      });
  };

  return (
    <div className="container mt-5 px-3">
      <div
        className="d-flex flex-column align-items-center justify-content-center mx-auto"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h4 className="text-primary mb-3">workasana</h4>

        <h3 className="text-center">Log in to your account</h3>

        <p className="mt-2 text-center">
          Please enter your credentials
        </p>

        <form
          className="w-100"
          onSubmit={loginHandler}
        >
          <label htmlFor="email">Email:</label>
          <br />

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="form-control"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />

          <br />

          <label htmlFor="password">Password:</label>
          <br />

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="form-control"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />

          <br />

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>
        </form>

        <Link
          to="/signup"
          className="btn btn-link mt-3 text-decoration-none text-center"
        >
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
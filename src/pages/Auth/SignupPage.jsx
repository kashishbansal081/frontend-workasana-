import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/Api";

const SignupPage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userName || !userEmail || !userPassword) {
      alert("Please fill in all fields");
      return;
    }

    const userData = {
      name: userName,
      email: userEmail,
      password: userPassword,
    };

    fetch(API.signup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((result) => {
        toast.success("Signup successful!");
        console.log("User created:", result);

        setUserName("");
        setUserEmail("");
        setUserPassword("");

        navigate("/login");
      })
      .catch((error) => {
        toast.error("Error creating user!");
        console.error("Error creating user:", error);
      });
  };

  return (
    <div className="container mt-5 px-3">
      <div
        className="d-flex flex-column align-items-center justify-content-center mx-auto"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h4 className="text-primary mb-3">workasana</h4>

        <h3 className="text-center">Create your account</h3>

        <p className="mt-2 text-center">
          Please enter your details to sign up
        </p>

        <form
          className="w-100"
          onSubmit={submitHandler}
        >
          <label htmlFor="name">Name:</label>
          <br />

          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <br />

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
            Sign Up
          </button>
        </form>

        <Link
          to="/login"
          className="btn btn-link mt-3 text-decoration-none text-center"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
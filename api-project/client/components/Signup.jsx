import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import { userContext } from "./App";

function Signup() {
  const { setUserData } = useContext(userContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { password, verifyPassword, ...rest } = data;

    if (password !== verifyPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, password }),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUserData(createdUser);
        localStorage.setItem("currentUser", JSON.stringify(createdUser));
        navigate("/home");
      } else {
        alert("Error creating user. Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Name"
        className="login-input"
        {...register("name", { required: "Name is required" })}
      />
      {errors.name && <span className="error-message">{errors.name.message}</span>}

      <input
        type="email"
        placeholder="Email"
        className="login-input"
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
        })}
      />
      {errors.email && <span className="error-message">{errors.email.message}</span>}

      <input
        type="text"
        placeholder="Address"
        className="login-input"
        {...register("address", { required: "Address is required" })}
      />
      {errors.address && <span className="error-message">{errors.address.message}</span>}

      <input
        type="tel"
        placeholder="Phone"
        className="login-input"
        {...register("phone", {
          required: "Phone number is required",
          pattern: { value: /^[0-9\-\+]{9,}$/, message: "Invalid phone number" },
        })}
      />
      {errors.phone && <span className="error-message">{errors.phone.message}</span>}

      <input
        type="password"
        placeholder="Password"
        className="login-input"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        })}
      />
      {errors.password && <span className="error-message">{errors.password.message}</span>}

      <input
        type="password"
        placeholder="Verify Password"
        className="login-input"
        {...register("verifyPassword", { required: "Please verify your password" })}
      />
      {errors.verifyPassword && <span className="error-message">{errors.verifyPassword.message}</span>}

      <button type="submit" className="login-button">
        Submit
      </button>

      <button className="switch-signup" onClick={() => navigate("/login")} type="button">
        Already have an account?
      </button>
    </form>
  );
}

export default Signup;

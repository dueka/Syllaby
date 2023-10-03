"use client";
import React, { FormEvent, useReducer, useState } from "react";
import styles from "./register.module.css";

// Define the initial state and reducer function
const initialState = {
  username: "",
  password: "",
};

function registrationReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.fieldName]: action.value };
    default:
      return state;
  }
}

function Register() {
  const [formData, dispatch] = useReducer(registrationReducer, initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", fieldName: name, value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Destructure the values from formData
    const { username, password } = formData;

    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Send all form data
      });

      if (response.ok) {
        console.log("Registration submitted successfully");
        dispatch({ type: "SUBMIT_SUCCESS" });
      } else {
        console.error("Registration submission failed");
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.FormGroup}>
            <div className={styles.Label}>Username</div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.FormGroup}>
            <div className={styles.Label}>Password</div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className={styles.SubmitButton} type="submit">
            Register
          </button>
          {loading && <div>Loading...</div>}
        </form>
      </div>
    </div>
  );
}

export default Register;

"use client";
import React, { FormEvent, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import { registrationReducer } from "./reducer/registrationReducer";

// Define the initial state and reducer function
const initialState = {
  username: "",
  password: "",
};

function Register() {
  const router = useRouter();
  const [formData, dispatch] = useReducer(registrationReducer, initialState);
  const [loading, setLoading] = useState(false);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", fieldName: name, value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
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
              className={styles.Input}
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
              className={styles.Input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <button className={styles.SubmitButton} type="submit">
              Register
            </button>
            or
            <button
              className={styles.SubmitButton}
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            {loading && <div>Loading...</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

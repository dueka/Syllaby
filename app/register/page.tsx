"use client";
import React, { FormEvent, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import { registrationReducer } from "./reducer/registrationReducer";

// Define the initial state and reducer function
const initialState = {
  username: "",
  password: "",
  role: "",
};

function Register() {
  const router = useRouter();
  const [formData, dispatch] = useReducer(registrationReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(`Name: ${name}, Value: ${value}`);
    dispatch({ type: "SET_FIELD", fieldName: name, value });

    if (name === "role") {
      setRoleSelected(value !== "");
    }
  };

  const handleSubmit = async () => {
    const { username, password, role } = formData;
    if (!roleSelected) {
      alert("Please select a role before registering.");
      return; // Prevent registration if the role is not selected
    }
    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.status === 200) {
        console.log("Registration submitted successfully");
        dispatch({ type: "SUBMIT_SUCCESS" });
        router.push("/login");
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
        <form>
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
          <div className={styles.FormGroup}>
            <div className={styles.Label}>Role</div>
            <select
              className={styles.Input}
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option>Select Role</option>
              <option value="Author">Author</option>
              <option value="Collaborator">Collaborator</option>
            </select>
          </div>
        </form>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            className={styles.SubmitButton}
            onClick={() => handleSubmit()}
          >
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
      </div>
    </div>
  );
}

export default Register;

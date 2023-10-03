"use client";
import React, { FormEvent, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../register/register.module.css";
import { loginReducer } from "./reducer/loginReducer";
import { useAuth } from "../auth/auth";

const initialState = {
  username: "",
  password: "",
};

function Login() {
  const router = useRouter();
  const [formData, dispatch] = useReducer(loginReducer, initialState);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", fieldName: name, value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { username, password } = formData;
    console.log("clicied");
    try {
      setLoading(true);
      await login(username, password);
      router.push("/book");
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Login</h2>
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
              Login
            </button>
            or
            <button
              className={styles.SubmitButton}
              onClick={() => router.push("/register")}
            >
              Register
            </button>
            {loading && <div>Loading...</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

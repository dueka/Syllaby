"use client";
import React, { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/register/register.module.css";
import { loginReducer } from "../app/login/reducer/loginReducer";
import { useAuth } from "../app/auth/auth";

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

  const handleSubmit = async () => {
    const { username, password } = formData;
    try {
      setLoading(true);
      const response = await login(username, password);
      if (response && response.status === 200) {
        router.push("/book");
      } else {
        console.error("Login submission failed");
        alert("Login submission failed. Please check your credentials.");
      }
    } catch (error) {
      console.log("Error", error);
      alert("Login submission failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Login</h2>
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
            {loading ? <div>Logging...</div> : "Login"}
          </button>
          or
          <button
            className={styles.SubmitButton}
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginImg from "../../assets/Image1.png";
import { GoogleLogin } from "@react-oauth/google";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!data.email || !data.password) {
      setError("Both email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data
      );
      localStorage.setItem("token", response.data.token);
      alert("Login Successful");
      navigate("/");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/google-login",
        {
          token: credentialResponse.credential,
        }
      );
      console.log("Server response:", response);
      localStorage.setItem("token", response.data.token);
      alert("Google Login Successful");
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    }
  };

  const handleError = (error) => {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 500
    ) {
      setError(error.response.data.message);
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <img src={LoginImg} alt="Login visual" className={styles.image} />
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Log in</h1>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button
              type="submit"
              className={styles.continue_btn}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <div className={styles.signup_prompt}>
              Don't have an account?{" "}
              <Link to="/signup" className={styles.signup_link}>
                Register
              </Link>
            </div>

            <div className={styles.separator}>
              <span>OR</span>
            </div>

            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Google login failed. Please try again.")}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

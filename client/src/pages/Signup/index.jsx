import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import SignupImg from "../../assets/Image1.png";
import styles from "./styles.module.css";

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isChecked) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        data
      );
      alert(response.data.message);
      navigate("/login");
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
      localStorage.setItem("token", response.data.token);
      alert("Google Signup Successful");
      navigate("/");
    } catch (error) {
      setError("Google signup failed. Please try again.");
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
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <form className={styles.signup_form} onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <div className={styles.name_input}>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className={styles.input}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
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
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              value={data.confirmPassword}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}

            <div className={styles.terms}>
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="terms">
                I’ve read and agree with the{" "}
                <Link to="/terms" className={styles.terms_link}>
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className={styles.terms_link}>
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              className={styles.orange_btn}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className={styles.separator}>
              <span>OR</span>
            </div>

            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() =>
                setError("Google signup failed. Please try again.")
              }
            />

            <div className={styles.login_prompt}>
              Already have an account?{" "}
              <Link to="/login" className={styles.login_link}>
                Login
              </Link>
            </div>
          </form>
        </div>
        <div className={styles.right}>
          <img src={SignupImg} alt="Signup" className={styles.signup_image} />
        </div>
      </div>
    </div>
  );
};

export default Signup;

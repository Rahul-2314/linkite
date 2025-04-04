import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../../services/api";
import "./login.css";

import { Zoom, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ onClose , setShowSignup , setIsUser }) {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleClose = () => {
		onClose();
		// navigate("/");
	};

	const switchSignup = () => {
		onClose();
		setShowSignup(true);
	}

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (!username || !password) {
			toast.error("Please fill in all fields!");
			setLoading(false);
			return;
		}

		if(!validateEmail(username)) {
			toast.error("Enter a valid Email");
			setLoading(false);
			return;
		}

		try {
			const token = await loginUser(username, password);
			toast.success("Login Successful!");

			localStorage.setItem("token", token);
			// for extension
			// document.cookie = `token=${token}; path=/; domain=localhost`;

			setIsUser(true);
			setTimeout(() => {
				handleClose();
				// window.location.reload();
				navigate(0);
			}, 1500);
		} catch (error) {
			toast.error(
				error.response?.data?.msg || error.message || "Login failed!"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="form-container">
				<form className="login-form" onSubmit={handleSubmit}>
					<span className="close-btn" onClick={handleClose}>
						<i className="fa-solid fa-xmark"></i>
					</span>
					<h1>Login</h1>
					<label htmlFor="email">
						<b>Email</b>
					</label>
					<input
						type="text"
						placeholder="Enter Email"
						name="email"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
					<label htmlFor="psw">
						<b>Password</b>
					</label>
					<div className="password-container">
						<input
							type={passwordVisible ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="toggle-btn"
						>
							{passwordVisible ? "🙈" : "👁️"}
						</button>
					</div>
					<button type="submit" className="btn" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
					<span className="redirect-signup">
						Don't have an account? <span onClick={switchSignup}>sign-up</span>
					</span>
				</form>
				<strong>
					<ToastContainer position="bottom-right" transition={Zoom} />
				</strong>
			</div>
		</>
	);
}

export default Login;

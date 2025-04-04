import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { loginUser, registerUser , findUser } from "../../services/api"; 
import otpGenerator from "otp-generator";
import "./signup.css";

import { Zoom, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup({ onClose , setShowLogin , setIsUser }) {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");
	const [isOtp, setIsOtp] = useState(false);
	const [otp, setOtp] = useState("");
	const [generatedOtp, setGeneratedOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleClose = () => {
		onClose();
		navigate("/");
	};

	const switchLogin = () => {
		onClose();
		setShowLogin(true);
	};

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const validatePassword = (password) =>
		/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);

	const generateOtp = () => {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		return otp;
	}

	const handleOtp = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Input Validations
		if (!username || !password1 || !password2 || !fullName) {
			toast.error("Please fill in all fields!");
			setLoading(false);
			return;
		}
		if (!validateEmail(username)) {
			toast.error("Enter a valid email!");
			setLoading(false);
			return;
		}
		if (password1 !== password2) {
			toast.error("Passwords do not match!");
			setLoading(false);
			return;
		}
		if(fullName.length >= 20){
			toast.warn("Fullname should less than 20 characters");
			setLoading(false);
			return;
		}
		if (!validatePassword(password1)) {
			toast.error(
				"Password must contain at least 1 uppercase letter, 1 number, and 1 special character!"
			);
			setLoading(false);
			return;
		}

		if ((await findUser(username)).isUser) {
			toast.warning("User already exists!");
			setLoading(false);
			return;
		}

		// Generate OTP and Send Email
		const otpCode = generateOtp();
		setGeneratedOtp(otpCode);

		try {
			await emailjs
				.send(
					"service_alh3g2l",
					"template_jylel9m",
					{
						user_email: username,
						user_name: fullName,
						otp: otpCode,
					},
					"RrmlrFRTpTytzK3DT"
				)
				.then(
					(result) => {
						console.log(result.text);
					},
					(error) => {
						console.log(error.text);
					}
				);
			toast.success("OTP sent to your email!");
			setIsOtp(true);
		} catch (error) {
			toast.error("Failed to send OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// handle registration
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Verify OTP
		if (otp !== generatedOtp) {
			toast.error("Invalid OTP. Please try again!");
			setLoading(false);
			return;
		}

		try {
			const token = await registerUser(fullName, username, password1);
			
			toast.success("Registration successful!");
			localStorage.setItem("token", token);
			setIsUser(true);
			// for extension
			// document.cookie = `token=${token}; path=/; domain=localhost`;

			setTimeout(() => {
				handleClose();
				// window.location.reload();
				navigate(0);
			}, 1500);
		} catch (error) {
			toast.error("Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="form-container">
				<form
					className="signup-form"
					onSubmit={isOtp ? handleSubmit : handleOtp}
				>
					<span className="close-btn" onClick={handleClose}>
						<i className="fa-solid fa-xmark"></i>
					</span>
					<h1>SignUp</h1>
					<input
						type="text"
						placeholder="Enter Full Name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						disabled={isOtp}
						required
					/>
					<input
						type="text"
						placeholder="Enter Email"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						disabled={isOtp}
						required
					/>
					<div className="password-container1">
						<input
							type={passwordVisible ? "text" : "password"}
							placeholder="Enter Password"
							name="password"
							value={password1}
							onChange={(e) => setPassword1(e.target.value)}
							disabled={isOtp}
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
					{!isOtp && (
						<div className="password-container2">
							<input
								type={passwordVisible ? "text" : "password"}
								placeholder="Re-Enter Password"
								name="password"
								value={password2}
								onChange={(e) => setPassword2(e.target.value)}
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
					)}
					{isOtp && (
						<input
							type="text"
							placeholder="Enter OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							required
						/>
					)}
					<button type="submit" className="btn" disabled={loading}>
						{loading
							? isOtp
								? "Registering..."
								: "Sending OTP..."
							: isOtp
							? "Sign Up"
							: "Send OTP"}
					</button>
					<span className="redirect-login">
						Already an user? <span onClick={switchLogin}>Login</span>
					</span>
				</form>
				<strong>
					<ToastContainer position="bottom-right" transition={Zoom} />
				</strong>
			</div>
		</>
	);
}

export default Signup;

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { MdOutlineEmail } from "react-icons/md";
import "./contact.css";

const Contact = () => {
	const [message, setMessage] = useState(false);
	const [error, setError] = useState("");
	const formRef = useRef();

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		const email = e.target.user_email.value;

		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		setMessage(true);
		setError("");
		setMessage(true);
		emailjs
			.sendForm(
				"service_pw8ejyk",
				"template_h700gvr",
				formRef.current,
				"vnLcMczPyPzZsc6Ie"
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				}
			);

		e.target.reset();
	};
	return (
		<section id="contact">
			<h5>Get In Touch</h5>
			<h2>Contact Us</h2>
			<div className="container contact__container">
				<div className="contact__options">
					<article className="contact__option">
						<MdOutlineEmail className="contact__option-icon" />
						<h4>Email</h4>
						<h5>teams.securelink@gmail.com</h5>
						<Link to="mailto: teams.securelink@gmail.com">Send a message</Link>
					</article>
				</div>
				<form ref={formRef} onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Your Full Name"
						name="user_name"
						required
					/>
					<input
						type="text"
						placeholder="Your Email"
						name="user_email"
						required
					/>
					<textarea
						placeholder="Your message"
						rows="7"
						name="message"
						required
					></textarea>
					<button type="submit" className="input-button">
						Send Message
					</button>
					{message && <span className="reply">Thanks, I'll reply ASAP :)</span>}
				</form>
			</div>
		</section>
	);
};

export default Contact;

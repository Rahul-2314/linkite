import React from "react";
import Contact from "../contact/Contact"
import logo from "../../assets/media/linkite-logo.png"
import "./footer.css";

function Footer() {
	let getYear = () => {
		let currentYear = new Date().getFullYear();
		return currentYear;
	};
	
	return (
		<section id="footer">
			<Contact />

			{/* Footer */}
			<footer>
				<div className="footer-content">
					<div className="footer-section-brand">
						{/* <h4>SecureLinks</h4> */}
						<img src={logo} alt="logo" />
						<p>URL shortener with advance analytics and API provider.</p>
					</div>
					<div className="footer-section">
						<h4>Company</h4>
						<ul>
							<li>
								About Us <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
							<li>
								Services <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
							<li>
								Blogs <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
						</ul>
					</div>
					<div className="footer-section">
						<h4>Supports</h4>
						<ul>
							<li>
								Help <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
							<li>
								Contacs Us <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
							<li>
								FAQ <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
						</ul>
					</div>
					<div className="footer-section">
						<h4>Social</h4>
						<ul>
							<li>
								LinkedIn <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
							<li>
								Instagram <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
							<li>
								Facebook <i className="fa-solid fa-caret-up fa-rotate-90"></i>
							</li>
						</ul>
					</div>
				</div>
				<div className="footer-bottom">
					<p>
						Copyright &copy; {getYear()} Linkite. All rights reserved.{" "}
						<span
							style={{
								color: "burlywood",
								fontFamily: "monospace",
								fontWeight: "bold",
								border: "3px solid green",
								paddingInline: "4px",
								borderRadius: "25px",
							}}
						>
							BETA
						</span>
					</p>
					<div className="footer-links">
						<span>Cookies</span>
						<p>.</p>
						<span>Privacy & Policy</span>
					</div>
				</div>
			</footer>
		</section>
	);
}

export default Footer;

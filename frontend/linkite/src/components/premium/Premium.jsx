import React from "react";
import "./premium.css";

export default function Premium() {
	return (
		<section id="premium">
			<div className="premium-header">
				<h1>-- SecureLink Premium --</h1>
				<p className="subtitle">Elevate Your Link Management Experience</p>
			</div>
			<div className="plans">
				<div className="free">
					<div className="plan-header">
						<h2>Free Plan</h2>
						<p className="price">
							&#8377;0<span>/forever</span>
						</p>
					</div>
					<ul>
						<li>Limit: 50 URL per Month</li>
						<li>Basic Analytics</li>
						<li>Standard QR Code</li>
						<li>Extension Support</li>
						<li>Community Support</li>
					</ul>
				</div>

				<div className="premium">
					<div className="plan-header">
						<h2>Premium Plan</h2>
						<p className="price">
							&#8377;499<span>/month | (currently free)</span>
						</p>
					</div>
					<ul>
						<li>Unlimited URL Shortening</li>
						<li>Advanced Analytics</li>
						<li>Premium QR Codes</li>
						<li>Priority API Access</li>
						<li>24/7 Premium Support</li>
						<li>Team Management</li>
					</ul>
					<button className="subscribe">
						Get Premium
						<span className="arrow">→</span>
					</button>
					<div className="badge">Special Offer &#127991;&#65039;</div>
				</div>
			</div>
		</section>
	);
}

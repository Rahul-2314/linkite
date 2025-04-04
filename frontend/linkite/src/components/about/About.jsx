import React,{useEffect} from 'react';
import { Link } from "react-router-dom";
import about_pic from "../../assets/media/about_pic-com.png"
import './about.css'
// import { emojiCursor } from "cursor-effects";
// // new emojiCursor({ emoji: ["🔥", "🐬", "🦆"] });

function About() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
  return (
		<section id="about">
			<div className="about">
				<h2 className="heading">---- About Us ----</h2>
				<h3 className="subheading">We Help Grow Your Business</h3>
				<div className="about-us">
					<div className="left">
						<h4 className="our_story">Our Story</h4>
						<h2 className="about-us-heading">
							Empowering Businesses with Advanced Analytics...
						</h2>
						<p className="about-us-para">
							SecureLink is a top-tier URL shortener offering robust analytics
							and an easy-to-use API for individuals and businesses. It helps
							users create custom short links, generate QR codes, and track
							performance metrics. With premium features, users can handle a
							higher volume of API requests per hour, access advanced analytics,
							and benefit from priority support. The platform is perfect for
							businesses needing reliable, scalable solutions for managing
							large-scale link operations. SecureLink ensures seamless
							integration, helping brands optimize their online presence.
						</p>
					</div>
					<div className="right">
						<img src={about_pic} alt="about-illustration" />
					</div>
				</div>
			</div>
		</section>
	);
}

export default About

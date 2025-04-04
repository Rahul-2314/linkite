import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./mylinks.css";
import { fetchProfileLinks } from "../../services/api";
import { Zoom, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Mylinks({ profile, loading, error }) {
	const [links, setLinks] = useState([]);
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const handleLinks = async () => {
		try {
			const data = await fetchProfileLinks();
			console.log("Fetched Links:", data.links);
			setLinks(data.links || []);
		} catch (error) {
			console.log("Error fetching links:", error);
		}
	};

	const navigate = useNavigate();

	const handleClickAnalytics = (shortUrl) => {
		navigate(`/mylinks/${shortUrl}/analytics`);
	};

	useEffect(() => {
		handleLinks();
	}, []);

	const copyURL = async (shortUrl) => {
		try {
			await navigator.clipboard.writeText(`${API_BASE_URL}/${shortUrl}`);
			toast.success("URL Copied Successfully");
		} catch (err) {
			console.error("Failed to copy URL", err);
		}
	};

	if (error) {
		return (
			<div className="mylinks" style={{ textAlign: "center" }}>
				Error: {error}
			</div>
		);
	}

	return (
		<section id="mylinks">
			<div className="mylinks">
				<h2 className="heading">---- Mylinks : Link History ----</h2>

				{loading ? (
					<div className="loading_loader">
						<i className="fa-solid fa-spinner fa-spin"></i>
					</div>
				) : (
					<div className="scrollable-container">
						<div className="scrollable-content">
							{links.map((link, index) => (
								<div key={index} className="content">
									<p className="sn">{index + 1}.</p>
									<span className="link">
										<a
											href={`${API_BASE_URL}/${link.shortUrl}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<i
												className="fa-solid fa-earth-asia"
												// size="2xs"
												style={{ color: "#4f6d64" }}
											></i>{" "}
											{`${API_BASE_URL}/${link.shortUrl}`}
										</a>
									</span>
									<i
										className="fas fa-copy"
										onClick={() => copyURL(link.shortUrl)}
										style={{ color: "#6d837d" }}
										aria-label="Copy URL"
									></i>
									<p className="clicks">Total Clicks: {link.clicks ?? 0}</p>
									<i
										className="fa-solid fa-circle-right"
										onClick={() => handleClickAnalytics(link.shortUrl)}
										aria-label="URL details"
										style={{ color: "#de8208" }}
									></i>
								</div>
							))}
						</div>
					</div>
				)}
				<strong>
					<ToastContainer position="bottom-right" transition={Zoom} />
				</strong>
			</div>
		</section>
	);
}

export default Mylinks;

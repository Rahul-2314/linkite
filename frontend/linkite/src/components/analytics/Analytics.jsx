import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import "./analytics.css";
import { fetchLinkAnalytics } from "../../services/api";
import { Zoom, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Charts from "./Charts";

function Analytics() {
	const [analytics, setAnalytics] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { shortUrl } = useParams();

	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

	// fetch analytics
	const fetchAnalytics = async () => {
		try {
			const data = await fetchLinkAnalytics(shortUrl);
			console.log(shortUrl);
			console.log(data);
			setAnalytics(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (shortUrl) {
			fetchAnalytics();
		}
	}, [shortUrl]);

	const copyURL = async (state) => {
		try {
			await navigator.clipboard.writeText(`${API_BASE_URL}/${shortUrl}`);
			// if (copyTextRef.current) {
			// 	copyTextRef.current.style.visibility = "visible";
			// 	setTimeout(() => {
			// 		copyTextRef.current.style.visibility = "hidden";
			// 	}, 3000);
			// }
		} catch (err) {
			setError("Failed to copy URL");
		}
	};

	// convert createdAt to date-time format
	const formatDateTime = (dateString) => {
		if (!dateString) return "Invalid Date";

		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "Invalid Date";

		return date.toLocaleString();
	}
	

	return (
		<>
			<div className="analytics-container" style={{ marginInline: "10px" }}>
				<h2
					className="analytics-header"
					style={{
						textAlign: "center",
						color: "burlywood",
						fontSize: "30px",
						fontFamily: "monospace",
					}}
				>
					-- MyAnalytics : Advance Analytics --
				</h2>
				<div
					className="link-details"
					style={{ color: "white", textAlign: "center" }}
				>
					<p className="shortUrl">
						{" "}
						ShortURL : {API_BASE_URL}/{analytics.shortUrl}
					</p>
					<p
						className="longUrl"
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							marginInline: "55px",
						}}
					>
						LongURL : {analytics.originalUrl}
					</p>
					<p className="clickCounts">Click Counts : {analytics.clicks}</p>
					<img
						loading="lazy"
						src={analytics.qrCode}
						alt="QR Code"
						className="qrCode"
					/>
					<p className="createdAt">
						created :&nbsp;&nbsp; <i className="fa-solid fa-calendar-day"></i>{" "}
						{formatDateTime(analytics.createdAt)}
					</p>
				</div>

				<div className="download-data">
					<button>
						Raw Data <i className="fa-solid fa-download"></i>
					</button>
					<button>
						Analytics Report <i className="fa-solid fa-download"></i>
					</button>
				</div>

				<div className="analytics-content">
					<Charts analytics={analytics} />
					<h2 style={{ color: "white", textAlign: "center" }}>
						------------------------------
					</h2>
				</div>

				<strong>
					<ToastContainer position="bottom-right" transition={Zoom} />
				</strong>
			</div>
		</>
	);
}

export default Analytics;

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { shortenUrl, fetchQRCode } from "../../services/api";
import linkanime from "../../assets/media/link-animation-link-com.gif"
import varified from "../../assets/media/orange-checkmark.svg";
// import texture from "../../assets/media/konsis 2.jpg"
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./homepage.css";

import { Zoom, ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Homepage({ isUser , setShowLogin}) {
	const [originalUrl, setOriginalUrl] = useState("");
	const [error, setError] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [qrcode, setQrcode] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const qrRef = useRef(null);
	const copyTextRef = useRef(null);

	// const notify = (type, content) => {
	// 	toast.type(content);
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		// setShortUrl("");
		// setQrcode(""); 

		if(!isUser) {
			setIsLoading(false);
			setShowLogin(true);
			return;
		};

		try {
			const result = await shortenUrl(originalUrl);
			setShortUrl(result.shortUrl);
			setOriginalUrl("");

			// Fetch the QR code for the shortened URL
			const qrCodeResult = await fetchQRCode(result.shortUrl);
			if (qrCodeResult) {
				setQrcode(qrCodeResult);
			} else {
				setError("QR Code not available");
			}
		} catch (err) {
			setShortUrl("");
			setQrcode(""); 
			setError(err.message || "Failed to shorten URL");
		} finally {
			setIsLoading(false);
		}
	};

	const pasteURL = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setOriginalUrl(text);
		} catch (err) {
			setError("Failed to paste URL from clipboard");
		}
	};

	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

	const copyURL = async () => {
		try {
			await navigator.clipboard.writeText(`${API_BASE_URL}/${shortUrl}`);
			if (copyTextRef.current) {
				copyTextRef.current.style.visibility = "visible";
				setTimeout(() => {
					copyTextRef.current.style.visibility = "hidden";
				}, 3000);
			}
		} catch (err) {
			setError("Failed to copy URL");
		}
	};

	const downloadQR = () => {
		const qrImg = qrRef.current;
		if (!qrImg) return;

		const link = document.createElement("a");
		link.href = qrcode; // Use the fetched QR code URL
		link.download = "QRCode.png";
		link.click();
	};

	return (
		<section id="homepage">
			<div className="homepage">
				<div className="main">
					<h2 className="brand-heading">
						Linkite - URL Shortener with advance Analytics
					</h2>
					<div className="input">
						<form onSubmit={handleSubmit}>
							<div className="input-group">
								<input
									type="text"
									className="originalURL"
									id="original-url"
									value={originalUrl}
									onChange={(e) => setOriginalUrl(e.target.value)}
									placeholder="Place your long URL here..."
									required
								/>
								&#32;
								<i
									className="fa-solid fa-paste"
									onClick={pasteURL}
									aria-label="Paste URL"
								></i>
							</div>
							<button type="submit" disabled={isLoading}>
								{isLoading ? "Shortening..." : "Shorten Link"}
								&#32;
								{isLoading ? (
									<i className="fa-solid fa-spinner fa-spin"></i>
								) : (
									<i className="fa-solid fa-paper-plane fa-bounce"></i>
								)}
							</button>
						</form>
						{error && (
							<p className="error-shorten">
								<i className="fa-solid fa-circle-exclamation"></i>
								&#32;{error}
							</p>
						)}
					</div>

					{!error && shortUrl && (
						<>
							<div className="solution">
								<div className="shortURL">
									<p
										className="link"
										id="link"
										onClick={() =>
											window.open(`${API_BASE_URL}/${shortUrl}`, "_blank")
										}
									>
										{API_BASE_URL}/{shortUrl}
									</p>
									<i
										className="fas fa-copy"
										onClick={copyURL}
										aria-label="Copy URL"
									></i>
								</div>

								<div className="qr">
									{qrcode && (
										<img
											loading="lazy"
											src={qrcode}
											alt="QR code"
											ref={qrRef}
											className="qr-code"
										/>
									)}
									<i
										className="fa-solid fa-download"
										onClick={downloadQR}
										aria-label="Download QR Code"
									></i>
								</div>
							</div>
							<div className="verify">
								<img loading="lazy" src={varified} alt="checkmark" />
								<p className="vtext">Verified by Google.</p>
								<p className="copyText" ref={copyTextRef}>
									Copied!
								</p>
							</div>
						</>
					)}
				</div>

				<div className="illustration">
					<img loading="lazy" src={linkanime} alt="illustration" />
				</div>
			</div>
			<strong>
				<ToastContainer
					position="bottom-right"
					transition={Zoom}
					// autoClose={2000}
				/>
			</strong>
		</section>
	);
}

export default Homepage;

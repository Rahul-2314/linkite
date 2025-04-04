const authDiv = document.querySelector(".auth");
const extensionDiv = document.querySelector(".extension");
const shortUrlElem = document.getElementById("shortUrl");
const copybtn = document.querySelectorAll(".copybtn");
const copybtn1 = document.getElementById("copybtn1");
const copybtn2 = document.getElementById("copybtn2");

// fetch tab url
const getCurrentTabUrl = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab?.url || null;
};

// shorten
const API_BASE_URL = "http://localhost:5000";
// const API_BASE_URL = "https://securelink-backend.onrender.com";
const shortenUrl = async (originalUrl) => {
	const authToken = localStorage.getItem("token");
    // const authToken = "";
	if (!authToken) {
		throw new Error("No token found. Please log in again.");
	}

	try {
		const response = await fetch(`${API_BASE_URL}/shorten`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
			body: JSON.stringify({ originalUrl }),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to shorten URL");
		}
		return await response.json();
	} catch (error) {
		console.error("Error shortening URL:", error.message);
		throw error;
	}
};

// copy
const copyUrl = () => {
	const url = shortUrlElem.innerText;
	navigator.clipboard
		.writeText(url)
		.then(() => {
			copybtn1.style.display = "none";
			copybtn2.style.display = "block";
			setTimeout(() => {
				copybtn1.style.display = "block";
				copybtn2.style.display = "none";
			}, 2500);
			console.log("URL copied to clipboard:", url);
		})
		.catch((err) => console.error("Failed to copy URL:", err));
};

// after popup
const popup = async () => {
	const authToken = localStorage.getItem("token");
	console.log("Token :", authToken);
	// const authToken = "";
	if (!authToken) {
		authDiv.style.display = "";
		extensionDiv.style.display = "none";
		return;
	}

	try {
		const currentTabUrl = await getCurrentTabUrl();
		if (!currentTabUrl) {
			throw new Error("Unable to fetch the current tab URL.");
		}

		const data = await shortenUrl(currentTabUrl);
		shortUrlElem.innerText = `https://linkite.in/${data.shortUrl}`;
	} catch (error) {
		// console.error(error.message);
		// alert(error.message);
		console.log("Error: ", error.message);
	}
};

document.addEventListener("DOMContentLoaded", popup);
copybtn.forEach((btn) => btn.addEventListener("click", copyUrl));

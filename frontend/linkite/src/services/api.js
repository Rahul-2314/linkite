import axios from "axios";

const API_BASE_URL =
	import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Axios instance
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 25000,
});

// -------------------------------------------------------------------------------
// -----------------------------(linkAPIs)----------------------------------------

// Shorten URL
export const shortenUrl = async (originalUrl) => {
	const authToken = localStorage.getItem("token");
	console.log(authToken);
	if (!authToken) {
		throw new Error("No token found. Please log in again.");
	}

	try {
		const response = await apiClient.post(
			"/shorten",
			{ originalUrl },
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response?.data?.error || error.message || "Error shortening URL";
		throw new Error(errorMessage);
	}
};

// Fetch QR Code
export const fetchQRCode = async (shortUrl) => {
	const authToken = localStorage.getItem("token");
	if (!authToken) {
		throw new Error("No token found. Please log in again.");
	}

	try {
		const response = await apiClient.get(`/qrcode/${shortUrl}`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data.qrCode;
	} catch (error) {
		const errorMessage =
			error.response?.data?.error ||
			error.message ||
			"Error generating QR code";
		throw new Error(errorMessage);
	}
};

// fetch all links and click counts
export const fetchProfileLinks = async () => {
	const authToken = localStorage.getItem("token");
	if (!authToken) {
		throw new Error("No token found. Please log in again.");
	}

	try {
		const response = await apiClient.get("/profile/links", {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response?.data?.error || error.message || "Error fetching links";
		throw new Error(errorMessage);
	}
};

// fetch detailed analytics
export const fetchLinkAnalytics = async (shortUrl) => {
	if (!shortUrl) {
		throw new Error("Short URL is required.");
	}

	const authToken = localStorage.getItem("token");
	if (!authToken) {
		throw new Error("No token found. Please log in again.");
	}

	try {
		const response = await apiClient.get(`/analytics/${shortUrl}`, {
			headers: { Authorization: `Bearer ${authToken}` },
		});
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.error || error.message || "Error Fetching Analytics";
		throw new Error(errorMessage);
	}
};

// -----------------------------(authAPIs)----------------------------------------

// login
export const loginUser = async (username, password) => {
	try {
		const response = await apiClient.post("/user/login", {
			username,
			password,
		});
		const token = response.data;
		const authToken = token.token;
		return authToken;
	} catch (error) {
		const errorMessage =
			error.response?.data?.msg || error.message || "Error logging in";
		throw new Error(errorMessage);
	}
};

// register user
export const registerUser = async (fullname, username, password) => {
	try {
		const response = await apiClient.post("/user/register", {
			fullname,
			username,
			password,
		});
		const token = response.data.token;
		return token;
	} catch (error) {
		// console.log(error);
		const errorMessage =
			error.response?.data?.msg || "Registration failed. Please try again.";
		throw new Error(errorMessage);
	}
};

// find user
export const findUser = async (username) => {
	try {
		const response = await apiClient.get("/user/find", {
			params: { username },
		});
		return response.data;
	} catch (error) {
		const errorMessage = error.response?.data?.msg || "Error finding user";
		throw new Error(errorMessage);
	}
};

// get user
export const getUser = async () => {
	const authToken = localStorage.getItem("token");
	if (!authToken) {
		throw new Error("No token found. Please log in again.");
	}
	try {
		const response = await apiClient.get("/user/user", {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error) {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/";
		}
		throw new Error(error.response?.data?.msg || "Error fetching user data");
	}
};

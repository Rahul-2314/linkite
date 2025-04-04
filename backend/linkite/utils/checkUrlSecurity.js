const axios = require("axios");
const https = require("https");

async function isConnectionSecure(url) {
	// https check
	if (!url.startsWith("https://")) {
		// console.error("The URL is not using HTTPS");
		return false;
	}

	// HTTPS request to check connection
	try {
		const parsedUrl = new URL(url);
		const agent = new https.Agent({
			rejectUnauthorized: true, // Enforce secure connection
		});

		// verify the connection
		const response = await axios.get(parsedUrl.href, { httpsAgent: agent });
		return response.status === 200; // secure connection
	} catch (error) {
		// console.error("Error verifying secure connection:", error.message);
		return false; // not secure
	}
}

async function checkUrlSecurity(url) {
	const isSecureConnection = await isConnectionSecure(url);
	if (!isSecureConnection) {
		return false; // not secure
	}

	// Google API Key
	const googleApiKey = process.env.GOOGLE_API_KEY;

	// API key check
	if (!googleApiKey) {
		// console.error("Google API Key is missing");
		return false;
	}

	const googleSafeBrowsingUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${googleApiKey}`;

	const requestBody = {
		client: {
			clientId: "securelink",
			clientVersion: "1.0.0",
		},
		threatInfo: {
			threatTypes: [
				"MALWARE",
				"SOCIAL_ENGINEERING",
				"UNWANTED_SOFTWARE",
				"POTENTIALLY_HARMFUL_APPLICATION",
			],
			platformTypes: ["ANY_PLATFORM"],
			threatEntryTypes: ["URL"],
			threatEntries: [{ url }],
		},
	};

	try {
		const response = await axios.post(googleSafeBrowsingUrl, requestBody);
		return !response.data.matches;
	} catch (error) {
		return false;
	}
}

module.exports = checkUrlSecurity;

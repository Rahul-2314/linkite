// routes/linkRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Link = require("../models/Link");
const Analytics = require("../models/Analytics");
const checkUrlSecurity = require("../utils/checkUrlSecurity");
const validUrl = require("valid-url");
const userMiddleware  = require("../Auth/middlewares/User");
const User = require("../Auth/models/User");

// shorten URL
router.post("/shorten", userMiddleware, async (req, res) => {
	const { originalUrl } = req.body;

	if (
		!originalUrl ||
		typeof originalUrl !== "string" ||
		!validUrl.isUri(originalUrl)
	) {
		return res.status(400).json({ error: "Invalid URL" });
	}

	//  URL - is secure?
	const isSecure = await checkUrlSecurity(originalUrl);
	if (!isSecure) {
		return res.status(400).json({ error: "The URL is not safe." });
	}

	try {
		const link = new Link({ originalUrl , user: req.username });
		await link.save();

		res.status(201).json({ shortUrl: link.shortUrl, qrCode: link.qrCode });
	} catch (error) {
		// console.error("Error creating link:", error);
		res.status(500).json({ error: "Failed to create short URL" });
	}
});

// handle redirection
router.get("/:shortUrl", async (req, res) => {
	const { shortUrl } = req.params;

	try {
		const link = await Link.findOne({ shortUrl });
		if (!link) {
			return res.status(404).json({ error: "URL not found" });
		}

		// Increment click count
		link.clicks += 1;
		await link.save();

		//  analytics
		const analytics = new Analytics({
			link: link._id,
			ipAddress: req.ip,
			referrer: req.get("Referrer") || "Direct",
			userAgent: req.get("User-Agent"),
		});
		await analytics.save();

		return res.redirect(link.originalUrl);
	} catch (error) {
		// console.error("Error during redirection:", error);
		res.status(500).json({ error: "Failed to redirect" });
	}
});

// generate QR code 
router.get("/qrcode/:shortUrl", userMiddleware, async (req, res) => {
	const { shortUrl } = req.params;

	try {
		const link = await Link.findOne({ shortUrl });
		if (!link) {
			return res.status(404).json({ error: "URL not found" });
		}

		// directly use qrCode 
		res.json({ qrCode: link.qrCode });
	} catch (error) {
		// console.error("Error retrieving QR code:", error);
		res.status(500).json({ error: "Failed to retrieve QR code" });
	}
});

// get analytics (basic-link click counts)
router.get("/profile/links", userMiddleware, async (req, res) => {
    try {
        const links = await Link.find({ user: req.username })
					.select("id shortUrl originalUrl clicks createdAt")
					.sort({ createdAt: -1 });;

        if (!links.length) {
            return res.status(404).json({ error: "No links found" });
        }

        const formattedLinks = links.map(link => ({
			id: link.id,
            shortUrl: link.shortUrl,
            originalUrl: link.originalUrl,
            clicks: link.clicks,
            createdAt: link.createdAt
        }));

        res.status(200).json({ links: formattedLinks });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve links" });
    }
});


// get analytics details (premium)
router.get("/analytics/:shortUrl", userMiddleware, async (req, res) => {
	try {
		const {shortUrl} = req.params;

		const link = await Link.findOne({shortUrl: shortUrl});
		if(!link){
			return res.status(404).json({msg: "link not found"});
		}

		const analyticsData = await Analytics.find({link: link._id}).sort({clickedAt: -1});

		res.status(200).json({
			shortUrl: link.shortUrl,
			qrCode: link.qrCode,
			originalUrl: link.originalUrl,
			clicks: link.clicks || 0,
			createdAt: link.createdAt,
			analyticsData: analyticsData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({msg: "Internal Server Error"});
	}
});

module.exports = router;

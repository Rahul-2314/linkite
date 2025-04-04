const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
	link: { type: mongoose.Schema.Types.ObjectId, ref: "Link" },

	// metadata
	clickedAt: { type: Date, default: Date.now },
	ipAddress: { type: String, required: true },
	referrer: { type: String, default: null },
	userAgent: { type: String, required: true },

	// device details
	// deviceType: { type: String, default: "Unknown" },
	// os: { type: String, default: "Unknown" },
	// browser: { type: String, default: "Unknown" },
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);

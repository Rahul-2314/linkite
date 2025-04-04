const mongoose = require("mongoose");
const shortid = require("shortid");
const QRCode = require("qrcode");
const User = require("../Auth/models/User");

const LinkSchema = new mongoose.Schema({
	originalUrl: {
		type: String,
		required: true,
	},
	shortUrl: {
		type: String,
		default: shortid.generate,
		unique: true,
	},
	qrCode: {
		type: String,
		unique: true,
	},
	user: {
		type: String,
		required: true,
	},
	clicks: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// middleware
LinkSchema.pre("save", async function (next) {
	const link = this;

	// generate qr data
	if (!link.qrCode) {
		try {
			//  QR code data[base64]
			const BASE_URL = process.env.BASE_URL;
			const userUrl = `${BASE_URL}/${link.shortUrl}`;
			const qrCode = await QRCode.toDataURL(userUrl);
			link.qrCode = qrCode;
		} catch (error) {
			return next(error);
		}
	}

	// save link
	const username = link.user;
	const user = await User.findOne({ username });
	const is_stored = await user.links.includes(link._id);
	if (user && !is_stored) {
		user.links.push(link._id);
		await user.save();
	}

	next();
});

module.exports = mongoose.model("Link", LinkSchema);

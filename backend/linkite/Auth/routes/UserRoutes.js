const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userMiddleware = require("../middlewares/User");
const { JWT_SECRET } = require("../config");

// Login Route
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).json({ msg: "Invalid username or password" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ msg: "Invalid username or password" });
		}

		const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

		res.json({ token });
	} catch (error) {
		res.status(500).json({ msg: "Error logging in" });
	}
});


// Registration Route
router.post("/register", async (req, res) => {
	const { fullname, username, password } = req.body;

	if (!fullname || !username || !password) {
		return res.status(400).json({ msg: "All fields are required" });
	}

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(403).json({ msg: "Username already taken." });
		}

		const newUser = new User({ fullname, username, password });
		await newUser.save();

		const token = jwt.sign({username: newUser.username }, JWT_SECRET, {
			expiresIn: "1h",
		});
		res.status(201).json({ msg: "User registered successfully!", token });

	} catch (error) {
		res.status(400).json({ msg: "Invalid data received in the request." });
	}
});

// find user
router.get("/find", async (req, res) => {
	const {username} = req.query;

	try {
		const existingUser = await User.findOne({ username });
		if(existingUser) {
			return res.status(201).json({ isUser: true });
		}
		return res.status(201).json({ isUser: false });
	}catch (error) {
		res.json(500).json({msg: "Internal error"});
	}
});

// get user routes
router.get("/user", userMiddleware, async (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ msg: "No token provided" });
	}

	try {
		const username = req.username;
		const existingUser = await User.findOne({ username});
		if(existingUser) {
			return res.status(200).json({fullname: existingUser.fullname, username: existingUser.username, links: existingUser.links});
		}
		return res.status(404).json({ msg: "User not found"});
	} catch (error) {
		return res.status(400).json({msg: "Internal Error"});
	}
})

module.exports = router;

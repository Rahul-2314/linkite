const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function userMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ msg: "No token provided" });
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ msg: "Token format invalid" });
	}

	try {
		const decodedValue = jwt.verify(token, JWT_SECRET);
		req.username = decodedValue.username;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res
				.status(401)
				.json({ msg: "Token expired. Please log in again." });
		}
		return res.status(403).json({ msg: "Invalid token" });
	}
}

module.exports = userMiddleware;

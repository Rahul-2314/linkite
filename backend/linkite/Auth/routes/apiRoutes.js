const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

router.post("/send-otp", async (req, res) => {
	try {
		const { email, name, otp } = req.body;

		if (!email || !name || !otp) {
			return res.status(400).json({
				success: false,
				message: "Email, name and OTP are required",
			});
		}

		const mailOptions = {
			from: `"Your App Name" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "Your OTP Verification Code",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				</head>

				<body style="
					margin:0;
					padding:0;
					background:#f4f7fb;
					font-family:Arial, Helvetica, sans-serif;
				">

					<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
						<tr>
							<td align="center">

								<table
									width="100%"
									cellpadding="0"
									cellspacing="0"
									style="
										max-width:600px;
										background:#ffffff;
										border-radius:18px;
										overflow:hidden;
										box-shadow:0 8px 30px rgba(0,0,0,0.08);
									"
								>

									<!-- Header -->
									<tr>
										<td style="
											background:linear-gradient(135deg,#667eea,#764ba2);
											padding:35px 30px;
											text-align:center;
										">
											<h1 style="
												margin:0;
												color:#ffffff;
												font-size:30px;
												letter-spacing:1px;
											">
												Welcome! 👋
											</h1>

											<p style="
												margin:10px 0 0;
												color:#eeeeff;
												font-size:15px;
											">
												Let's verify your email address
											</p>
										</td>
									</tr>

									<!-- Content -->
									<tr>
										<td style="padding:40px 35px;">

											<p style="
												margin:0 0 15px;
												color:#333333;
												font-size:18px;
											">
												Hi <strong>${name}</strong>,
											</p>

											<p style="
												margin:0 0 25px;
												color:#666666;
												font-size:15px;
												line-height:1.7;
											">
												Thanks for signing up! Use the verification
												code below to complete your registration.
											</p>

											<!-- OTP -->
											<table
												width="100%"
												cellpadding="0"
												cellspacing="0"
											>
												<tr>
													<td align="center">
														<div style="
															display:inline-block;
															background:#f3f0ff;
															border:2px dashed #764ba2;
															border-radius:14px;
															padding:18px 35px;
															letter-spacing:10px;
															font-size:34px;
															font-weight:bold;
															color:#5a3d91;
														">
															${otp}
														</div>
													</td>
												</tr>
											</table>

											<p style="
												margin:25px 0 5px;
												text-align:center;
												color:#777777;
												font-size:14px;
											">
												Enter this code in the signup page.
											</p>

											<p style="
												margin:0;
												text-align:center;
												color:#999999;
												font-size:13px;
											">
												Please don't share this code with anyone.
											</p>

										</td>
									</tr>

									<!-- Footer -->
									<tr>
										<td style="
											background:#f8f9fc;
											padding:22px;
											text-align:center;
										">
											<p style="
												margin:0;
												color:#999999;
												font-size:12px;
											">
												If you didn't request this verification code,
												you can safely ignore this email.
											</p>

											<p style="
												margin:10px 0 0;
												color:#bbbbbb;
												font-size:11px;
											">
												© 2026 Your App Name
											</p>
										</td>
									</tr>

								</table>

							</td>
						</tr>
					</table>

				</body>
				</html>
			`,
		};

		await transporter.sendMail(mailOptions);

		return res.status(200).json({
			success: true,
			message: "OTP sent successfully",
		});
	} catch (error) {
		console.error("Nodemailer error:", error);

		return res.status(500).json({
			success: false,
			message: "Failed to send OTP",
		});
	}
});

module.exports = router;

import React, { useState, useEffect } from "react";
import {
	AreaChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Area,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";

function Charts({ analytics }) {
	const [clickData, setClickData] = useState([]);
	const [deviceData, setDeviceData] = useState([]);

	useEffect(() => {
		if (analytics && analytics.analyticsData) {
			// Convert timestamps into dates and count clicks per day
			const formattedClicks = analytics.analyticsData.map((item) => ({
				name: new Date(item.clickedAt).toLocaleDateString(),
				clicks: 1,
			}));

			// Aggregate clicks per day
			const aggregatedClicks = formattedClicks.reduce((acc, item) => {
				const existing = acc.find((entry) => entry.name === item.name);
				if (existing) {
					existing.clicks += 1;
				} else {
					acc.push(item);
				}
				return acc;
			}, []);

			setClickData(aggregatedClicks.reverse());

			// Process device analytics
			// const deviceCounts = analytics.analyticsData.reduce((acc, entry) => {
			// 	const deviceType = entry.userAgent || "Unknown";
			// 	acc[deviceType] = (acc[deviceType] || 0) + 1;
			// 	return acc;
			// }, {});
            const deviceCounts = analytics.analyticsData.reduce(
							(acc, entry) => {
								const userAgent = entry.userAgent || "Unknown";

								let deviceType = "Other";
								if (userAgent.includes("Windows")) deviceType = "Windows";
								else if (userAgent.includes("Macintosh")) deviceType = "Mac";
								else if (
									userAgent.includes("Linux") &&
									!userAgent.includes("Android")
								)
									deviceType = "Linux";
								else if (userAgent.includes("Android")) deviceType = "Android";
								else if (
									userAgent.includes("iPhone") ||
									userAgent.includes("iPad")
								)
									deviceType = "iOS";

								acc[deviceType] = (acc[deviceType] || 0) + 1;
								return acc;
							},
							{}
						);

			const formattedDevices = Object.entries(deviceCounts).map(
				([name, value]) => ({
					name,
					value,
				})
			);

			setDeviceData(formattedDevices);
		}
	}, [analytics]);

	// Colors for Pie Chart
	const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];

	return (
		<div
			className="charts-container"
			style={{
				backgroundColor: "whitesmoke",
				padding: "25px",
				margin: "75px",
				borderRadius: "10px",
				fontWeight: "bold",
			}}
		>
			{/* Area Chart: Click Analytics */}
			<div className="areachart">
				<h2 style={{ color: "navy" }}>--- Engagement Over Time ---</h2>
				<h3
					style={{ textAlign: "center", color: "#333", marginBottom: "15px" }}
				>
					Click Analytics
				</h3>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart
						data={clickData}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis dataKey="name" />
						<YAxis />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="clicks"
							stroke="#8884d8"
							fillOpacity={1}
							fill="url(#colorClicks)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* Pie Chart: Device Analytics */}
			<div
				className="piechart"
				// style={{ textAlign: "center", marginTop: "40px" }}
			>
				<h2 style={{ color: "navy" }}>--- Device Information ---</h2>
				<PieChart width={400} height={300}>
					<Pie
						data={deviceData}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						outerRadius={80}
						fill="#8884d8"
						label
					>
						{deviceData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</PieChart>
			</div>

            {/* Radarchart : location information */}
            <div className="radarchart">
                <h2 style={{color:"navy"}}>---Location Information---</h2>
                
            </div>
		</div>
	);
}

export default Charts;

import { useState, useEffect } from "react";
import { getUser } from "../services/api";

const userProfile = () => {
	const [profile, setProfile] = useState({
		fullname: "",
		username: "",
		links: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await getUser();
				setProfile({
					fullname: response.fullname,
					username: response.username,
					links: response.links,
				});
			} catch (error) {
				setError("Error fetching profile");
				localStorage.removeItem("token");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	return { profile, loading, error };
};

export default userProfile;

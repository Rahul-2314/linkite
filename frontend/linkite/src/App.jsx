import { useState, useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Homepage from './components/homepage/Homepage'
import Footer from './components/footer/Footer'
import './App.css'
import Mylinks from './components/mylinks/Mylinks'
import About from './components/about/About'
import Premium from './components/premium/Premium'
import Signup from './components/signup/Signup'
import userProfile from './hooks/userProfile'
import {Routes, Route, useNavigate } from "react-router-dom";
import Analytics from './components/analytics/Analytics'
import Profile from './components/profile/Profile'

function App() {
  const [isUser, setIsUser] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  const { profile, loading, error } = userProfile();

  const checkTokenExpiration = () => {
		const token = localStorage.getItem("token");
		if (token) {
			const decoded = JSON.parse(atob(token.split(".")[1]));
			if (decoded.exp * 1000 < Date.now()) {
				localStorage.removeItem("token");
				setIsUser(false);
				setShowLogin(true);
				navigate("/");
			}
		}
	};
	const fetchToken = () => {
		const token = localStorage.getItem("token");

		if(!token) {
			setIsUser(false);
			setShowLogin(true);
		}
	}
	useEffect(() => {
		checkTokenExpiration();
		fetchToken();
	}, []);


  return (
		<>
			<Navbar
				isUser={isUser}
				setIsUser={setIsUser}
				showLogin={showLogin}
				setShowLogin={setShowLogin}
				profile={profile}
			/>
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Homepage isUser={isUser} setShowLogin={setShowLogin} />
							<About />
						</>
					}
				/>
				<Route path="/about" element={<About />} />
				<Route
					path="/mylinks"
					element={
						<Mylinks profile={profile} loading={loading} error={error} />
					}
				/>
				<Route path="/premium" element={<Premium />} />
				<Route path="/mylinks/:shortUrl/analytics" element={<Analytics />} />
				<Route
					path="/profile"
					element={
						<Profile
							onClose={() => setShowProfile(false)}
							fullname={profile.fullname}
							username={profile.username}
						/>
					}
				/>
				{/* <Route
						path="/signup"
						element={
							<Signup
								onClose={() => setShowSignup(false)}
								setShowLogin={setShowLogin}
								setIsUser={setIsUser}
							/>
						}
					/> */}
			</Routes>
			<Footer />
		</>
	);
}

export default App

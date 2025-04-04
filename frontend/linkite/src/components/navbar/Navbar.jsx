import React,{useState,useEffect} from 'react'
import { Link } from "react-router-dom";
import logo from '../../assets/media/linkite-logo.png'
import "@fortawesome/fontawesome-free/css/all.min.css";
import './navbar.css'
import Login from '../login/Login'
import Signup from '../signup/Signup';
import Profile from '../profile/Profile';
// import userProfile from "../../hooks/userProfile";
import { useNavigate } from 'react-router-dom';

function Navbar({isUser , setIsUser , showLogin , setShowLogin, profile}) {
	// const [showLogin, setShowLogin] = useState(showLogin);
	const [showSignup, setShowSignup] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	// const [isUser, setIsUser] = useState(isUser);
	// const { profile, loading, error } = userProfile();

	const handleLoginClick = () => {
		setShowLogin(true);
	};
	const handleSignupClick = () => {
		setShowSignup(true);
	};
	const handleProfileClick = () => {
		setShowProfile(true);
	};

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
		const token = localStorage.getItem("token");
		if(token !== null){
			setIsUser(true);
		}else {
			setIsUser(false);
			handleLoginClick();
		}
	}, []);


	const logout = () => {
		localStorage.removeItem("token");;
		setIsUser(false);
		navigate("/");
		// window.location.reload();
		navigate(0);
	}

  return (
		<nav className="navbar" aria-label="main-navigation">
			<div className="container-fluid">
				<div className="nav-logo">
					<Link to="/">
						<img src={logo} alt="logo" />
					</Link>
				</div>
				<div className="nav-links">
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link to="/" className="nav-link">
								Home
							</Link>
						</li>
						<li
							className="nav-item"
							onClick={!isUser ? () => setShowLogin(true) : null}
						>
							<Link to="/mylinks" className="nav-link">
								My Links
							</Link>
						</li>
						<li className="nav-item">
							<Link to="" className="nav-link">
								APIs
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/about" className="nav-link">
								About
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/premium" className="nav-link" id="nav-premium">
								<i className="fas fa-chess-queen" aria-hidden="true"></i>
								&#32;Premium
							</Link>
						</li>
					</ul>
					{isUser ? (
						<div className="profile" aria-label="Profile">
							<span className="profile-img" onClick={handleProfileClick}>
								<i className="fa-solid fa-user"></i>
							</span>
							{showProfile && (
								<Profile
									onClose={() => setShowProfile(false)}
									fullname={profile.fullname}
									username={profile.username}
								/>
							)}
							<button className="log-out" onClick={logout}>
								Logout
							</button>
						</div>
					) : (
						<div className="auth-buttons" aria-label="sign-in">
							<button className="sign-up" onClick={handleSignupClick}>
								Sign-Up
							</button>
							{showSignup && (
								<Signup
									onClose={() => setShowSignup(false)}
									setShowLogin={setShowLogin}
									setIsUser={setIsUser}
								/>
							)}
							<button className="log-in" onClick={handleLoginClick}>
								Log-In
							</button>
							{showLogin && (
								<Login
									onClose={() => setShowLogin(false)}
									setShowSignup={setShowSignup}
									setIsUser={setIsUser}
								/>
							)}
						</div>
					)}
					;
				</div>
			</div>
		</nav>
	);
}

export default Navbar

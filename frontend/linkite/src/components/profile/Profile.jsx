import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/api";
import "./profile.css";

function Profile({ onClose , fullname , username }) {
	const navigate = useNavigate();

	const handleClose = () => {
		onClose();
		// navigate("/");
	};

	return (
		<>
			<div className="profile-container">
				<div className="profile-page">
					<h1 className="user-icon">
						<i className="fa-solid fa-user fa-bounce"></i>
					</h1>
					<h1>Profile</h1>
					<span className="close-btn" onClick={handleClose}>
						<i className="fa-solid fa-xmark"></i>
					</span>

					<div className="profile-details">
						<div className="fullname">
							<h2 className="header">Fullname : </h2>
							{fullname? (<h4 className="response_data">{fullname}</h4>)
							:(<i className="fa-solid fa-spinner fa-spin"></i>)}
						</div>
						<div className="username">
							<h2 className="header">Username : </h2>
							{/* <h4 className="response_data">{username}</h4> */}
							{username? (<h4 className="response_data">{username}</h4>)
							:(<i className="fa-solid fa-spinner fa-spin"></i>)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Profile;

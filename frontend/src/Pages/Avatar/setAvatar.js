import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./avatar.css";
import { Button } from "react-bootstrap";
import { setAvatarAPI } from "../../utils/ApiRequest.js";

const SetAvatar = () => {
  const navigate = useNavigate();

  const toastOptions = { position: "bottom-right", autoClose: 2000, theme: "dark" };

  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  // ✅ 9 FIXED avatars (male, female, neutral)
  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=male1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=male2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=male3",

    "https://api.dicebear.com/7.x/avataaars/svg?seed=female1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=female2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=female3",

    "https://api.dicebear.com/7.x/avataaars/svg?seed=neutral1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=neutral2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=neutral3",
  ];

  useEffect(() => {
    if (!localStorage.getItem("user")) navigate("/login");
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const { data } = await axios.post(setAvatarAPI, {
        userId: user._id,
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;

        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Avatar selected successfully", toastOptions);

        navigate("/");
      } else {
        toast.error("Error setting avatar", toastOptions);
      }
    } catch (err) {
      toast.error("Server error", toastOptions);
    }
  };

  return (
    <div className="avatarPage">
      <div className="avatarCard">
        <div className="avatarTop">
          <h1>Choose Your Avatar</h1>
        </div>

        <div className="avatarBottom">
          <div className="avatarContainer">
            {avatars.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`avatar-${index}`}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              />
            ))}
          </div>

          <Button className="primaryBtn" onClick={setProfilePicture}>
            Set Profile Picture
          </Button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SetAvatar;
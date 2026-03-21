import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./avatar.css";

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [selected, setSelected] = useState(null);

  // ✅ Check user login (runs once)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
    }
  }, []);

  // ✅ Load avatars
  useEffect(() => {
    const data = [];
    for (let i = 0; i < 9; i++) {
      data.push(`https://api.dicebear.com/7.x/adventurer/svg?seed=${i}`);
    }
    setAvatars(data);
  }, []);

  // ✅ Submit avatar
  const handleSubmit = async () => {
    if (selected === null) {
      alert("Please select an avatar");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await axios.post(
        "https://expense-backend-2k8h.onrender.com/api/auth/setAvatar",
        {
          userId: user._id,
          avatarImage: avatars[selected],
        }
      );

      console.log("API Response:", response.data);

      if (response.data.isSet) {
        // ✅ save locally
        user.avatarImage = response.data.avatarImage;
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ navigate to home
        navigate("/");
      } else {
        alert("Failed to set avatar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="avatarPage">
      <div className="avatarCard">
        <h3>Choose Avatar</h3>

        <div className="avatarGrid">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className={`avatarItem ${
                selected === index ? "active" : ""
              }`}
              onClick={() => setSelected(index)}
            >
              <img src={avatar} alt="avatar" />
            </div>
          ))}
        </div>

        <Button className="primaryBtn mt-3" onClick={handleSubmit}>
          Set Avatar
        </Button>
      </div>
    </div>
  );
};

export default SetAvatar;
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HashRouter as Router } from "react-router-dom";
import "./avatar.css";

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [selected, setSelected] = useState(null);

  // ✅ Check login only (NO LOOP)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
    }
  }, []);

  // ✅ Generate avatars
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
    alert("Select avatar");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  try {
    console.log("Sending request...");

    const { data } = await axios.post(
      "https://expense-backend-2k8h.onrender.com/api/auth/setAvatar",
      {
        userId: user._id,
        avatarImage: avatars[selected],
      }
    );

    console.log("Response:", data); // 👈 CHECK THIS

    if (data.isSet) {
      console.log("Saving avatar & navigating...");

      user.avatarImage = data.avatarImage;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/"); // 👈 SHOULD RUN
    } else {
      alert("Error setting avatar");
    }
  } catch (err) {
    console.error("ERROR:", err);
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
              className={`avatarItem ${selected === index ? "active" : ""}`}
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
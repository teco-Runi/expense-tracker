import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./avatar.css";

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [selected, setSelected] = useState(null);

  // ✅ Redirect logic
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
    }

    if (user?.avatarImage) {
      navigate("/");
    }
  }, [navigate]);

  // ✅ NO API CALL → NO CORS
  useEffect(() => {
    const data = [];

    for (let i = 0; i < 9; i++) {
      data.push(`https://api.dicebear.com/7.x/adventurer/svg?seed=${i}`);
    }

    setAvatars(data);
  }, []);

  const handleSubmit = () => {
    if (selected === null) return alert("Select avatar");

    const user = JSON.parse(localStorage.getItem("user"));
    user.avatarImage = avatars[selected];

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/");
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
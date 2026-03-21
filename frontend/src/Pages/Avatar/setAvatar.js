import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./avatar.css";

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 9; i++) {
        const res = await axios.get(
          `https://api.multiavatar.com/${Math.round(Math.random() * 1000)}`
        );
        data.push(res.data);
      }
      setAvatars(data);
    };

    fetchAvatars();
  }, []);

  const handleSubmit = () => {
    if (selected === null) return alert("Please select an avatar");
    navigate("/");
  };

  return (
    <div className="avatarPage">
      <div className="avatarCard">
        <h3 className="title">Choose Your Avatar</h3>

        <div className="avatarGrid">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className={`avatarItem ${selected === index ? "active" : ""}`}
              onClick={() => setSelected(index)}
              dangerouslySetInnerHTML={{ __html: avatar }}
            />
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
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import spinner from "../../assets/gg.gif";
import "./avatar.css";
import { Button } from "react-bootstrap";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const {
  uniqueNamesGenerator,
  colors,
  animals,
  countries,
  names,
  languages,
} = require("unique-names-generator");

const SetAvatar = () => {
  const sprites = [
    "adventurer",
    "micah",
    "avataaars",
    "bottts",
    "initials",
    "adventurer-neutral",
    "big-ears",
    "big-ears-neutral",
    "big-smile",
    "croodles",
    "identicon",
    "miniavs",
    "open-peeps",
    "personas",
    "pixel-art",
    "pixel-art-neutral",
  ];

  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedSprite, setSelectedSprite] = useState(sprites[0]);

  const randomName = () =>
    uniqueNamesGenerator({
      dictionaries: [animals, colors, countries, names, languages],
      length: 2,
    });

  const [imgURL, setImgURL] = useState(
    Array(4)
      .fill(0)
      .map(() => `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`)
  );

  useEffect(() => {
    if (!localStorage.getItem("user")) navigate("/login");
  }, [navigate]);

  const handleSpriteChange = (e) => {
    const sprite = e.target.value;
    setSelectedSprite(sprite);
    setLoading(true);

    const imgData = Array(4)
      .fill(0)
      .map(() => `https://api.dicebear.com/7.x/${sprite}/svg?seed=${randomName()}`);

    setImgURL(imgData);
    setLoading(false);
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const { data } = await axios.post(`${setAvatarAPI}/${user._id}`, {
        image: imgURL[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Avatar selected successfully", toastOptions);
        navigate("/");
      } else {
        toast.error("Error setting avatar, try again", toastOptions);
      }
    } catch (err) {
      toast.error("Server error, try again", toastOptions);
    }
  };

  const particlesInit = useCallback(async (engine) => await loadFull(engine), []);
  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <div className="avatarPage">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            links: { enable: false },
            move: { enable: true, speed: 2 },
            life: {
              duration: { sync: false, value: 3 },
              count: 0,
              delay: { random: { enable: true, minimumValue: 0.5 }, value: 1 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <div className="avatarCard">
        <div className="avatarTop">
          <h1>Choose Your Avatar</h1>
        </div>

        <div className="avatarBottom">
          {loading ? (
            <img src={spinner} alt="Loading..." style={{ width: "80px", margin: "20px auto", display: "block" }} />
          ) : (
            <>
              <div className="avatarContainer">
                {imgURL.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`avatar-${index}`}
                    className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                    onClick={() => setSelectedAvatar(index)}
                  />
                ))}
              </div>

              <select
                onChange={handleSpriteChange}
                className="form-select"
                value={selectedSprite}
              >
                {sprites.map((sprite, index) => (
                  <option key={index} value={sprite}>
                    {sprite}
                  </option>
                ))}
              </select>

              <Button className="primaryBtn mt-3" onClick={setProfilePicture}>
                Set as Profile Picture
              </Button>
            </>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SetAvatar;
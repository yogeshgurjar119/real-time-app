import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as THREE from "three";

const LobbyScreen = () => {
  const [email, setEmail] = useState("ro@gmail.com");
  const [room, setRoom] = useState("23");
  const socket = useSocket();
  const navigate = useNavigate();
  const threeRef = useRef(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (email && room) {
        socket.emit("room:join", { email, room });
      }
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      toast.success("Joined room");
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 5;
    camera.position.x = -4;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (threeRef.current) {
      threeRef.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    scene.add(cube);


    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div
        ref={threeRef}
        style={{
          position: "fixed", // Changed to fixed so it covers the entire viewport
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed", // Changed to fixed to keep the form in view
          top: "160px",
          right: "50px",
          left : "20px",
          width: "300px",
          // backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          zIndex: 1,
        }}
      >
        <h1>Lobby</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <label htmlFor="room">Room ID</label>
          <input
            type="text"
            id="room"
            name="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter your roomId"
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <button type="submit" style={{ width: "100%" }}>
            JOIN
          </button>
        </form>
      </div>
    </>
  );
};

export default LobbyScreen;

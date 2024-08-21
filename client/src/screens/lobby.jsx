import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LobbyScreen = () =>{
    const [email,setEmail] = useState("ro@gmail.com");
    const [room,setRoom] = useState("23");
    const socket = useSocket();
    // console.log(socket);
    const navigate = useNavigate();
    const handleSubmit = useCallback((e) =>{
        e.preventDefault();
        if(email && room){
            socket.emit("room:join", { email, room });
        }
      
    },[email,room,socket]);

    const handleJoinRoom = useCallback((data)=>{
        const {email,room} = data;
        toast.success("Joined room");
        navigate(`/room/${room}`);
    },[navigate])


    useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
          socket.off("room:join", handleJoinRoom);
        };
      }, [socket, handleJoinRoom]);
    return (
        <div>
            <h1> Lobby </h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email"> Email ID</label>
                <input type="email" id="email" name="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter your email" /> 
                <br />        
                <label htmlFor="room"> Room ID</label>
                <input type="text" id="room" name="room" value={room} onChange={(e)=> setRoom(e.target.value)} placeholder="Enter your roomId" /> 
                <br />     
                <br />        

                <button> JOIN</button>
            </form>
        </div>
    );
}


export default LobbyScreen;
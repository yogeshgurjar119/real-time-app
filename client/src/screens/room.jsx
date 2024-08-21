import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";
import  ReactPlayer from 'react-player';
const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [stream, setStream] = useState(null);



  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room with ${id}`);
    setRemoteSocketId(id);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    }
  }, [socket, handleUserJoined])

  const handleCall = useCallback(async() => {
    const  stream = await navigator.mediaDevices.getUserMedia({
      audio : true,
      video : true
    })
    setStream(stream);
  }, []);
  // useEffect(() => {
  //   if (remoteSocketId) {
  //     console.log(`User joined with socket id: ${remoteSocketId}`);
  //   }
  // }, [remoteSocketId])

  return (
    <div>
        <h1>Room Page</h1>
        <span>{remoteSocketId  ? "Connected" : "Not in room"}</span>
        {remoteSocketId && <button onClick={handleCall}> CALL</button> }
     {stream && <ReactPlayer height="300px" width="500px" url={stream} />}
     {stream && (
      <>
      <h1>
        My Stream
      </h1>
      <ReactPlayer
      playing
      muted
      height="100px"
      width="100px"
      />
      </>
     )}
    </div>
  )
}

export default RoomPage;
// JoinCreateChat.jsx
import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  // State to  store user input (room ID and username)
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  // context to manage global chat state 
  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();

  // Input change handler 
  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

//  BACKEND CONNECTION: Join existing room function
  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined..");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    }
  }

// BACKEND CONNECTION: Create new room function   
  async function createRoom() {
    if (validateForm()) {
      console.log(detail);
      try { // Calls SpringBoot API to create new room 
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !!");

        // Update global state and navigate to chat
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room already exists !!");
        } else {
          toast("Error in creating room");
        }
      }
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        {/* Chat Icon */}
        <div style={{ marginBottom: '24px' }}>
          <img 
            src={chatIcon} 
            alt="Chat application icon"
            style={{ 
              width: '80px', 
              height: '80px',
              margin: '0 auto',
              display: 'block'
            }}
          />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '32px',
          margin: '0 0 32px 0'
        }}>
          Join Room / Create Room ..
        </h1>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Name Input */}
          <div style={{ textAlign: 'left' }}>
            <label 
              htmlFor="userName"
              style={{
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}
            >
              Your name
            </label>
            <input
              onChange={handleFormInputChange}
              value={detail.userName}
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your name"
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#1f2937',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Room ID Input */}
          <div style={{ textAlign: 'left' }}>
            <label 
              htmlFor="roomId"
              style={{
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}
            >
              Room ID / New Room ID
            </label>
            <input
              name="roomId"
              onChange={handleFormInputChange}
              value={detail.roomId}
              type="text"
              id="roomId"
              placeholder="Enter the room ID"
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#1f2937',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            marginTop: '24px' 
          }}>
            <button
              onClick={joinChat}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Join Room
            </button>
            <button
              onClick={createRoom}
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;


// Provides UI for users to enter room ID and username
// Connects to Spring Boot APIs to create or join rooms
// Handles backend validation errors
// Updates global state and navigates to chat on success
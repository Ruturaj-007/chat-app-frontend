// ChatPage.jsx - Main Chat Interface 

import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => { // Global state from context 
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);
  
  // Local component state 
  const [messages, setMessages] = useState([]); // chat messages 
  const [input, setInput] = useState("");       // current message input 
  const inputRef = useRef(null);                // Websocket client 
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // BACKEND CONNECTION: load msg history on page load 
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {
        console.log("Error loading messages:", error);
      }
    }
    if (connected) {
      loadMessages();
    }
  }, [connected, roomId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Initialize WebSocket connection for real time chat 
  useEffect(() => {
    const connectWebSocket = () => {
      // create websocket connection to springboot
      const sock = new SockJS(`${baseURL}/chat`); // connect to /chat endpoint 
      const client = Stomp.over(sock); // use STOMP protocol 

      // Establish connection 
      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat!");

        // BACKEND CONNECTION : Subscribe to room messages 
        // Listen for new messages in this specific room 
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log("Received message:", message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket(); // connect websocket when user joins the room 
    }
  }, [roomId, connected]);

  // Send message function to spirng boot 
  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log("Sending message:", input);

      // Create msg object 
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      // send msg to Spring Boot via websocket 
      stompClient.send(
        `/app/sendMessage/${roomId}`, // SpringBoot msg endpoint 
        {},                           // Headers empty   
        JSON.stringify(message)       // Msg data as JSON 
      );
      setInput("");                   // Clear input field 
    }
  };

  // Disconnect the webSocket connection and logout 
  function handleLogout() {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#1e293b',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header - matching instructor's style */}
      <header style={{
        backgroundColor: '#1e293b',
        padding: '12px 20px',
        borderBottom: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
            Room : <span style={{ color: '#60a5fa' }}>{roomId}</span>
          </h1>
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
            User : <span style={{ color: '#34d399' }}>{currentUser}</span>
          </h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* Main Chat Area - matching instructor's blue-gray gradient */}
      <main
        ref={chatBoxRef}
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
          padding: '20px',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          {messages.map((message, index) => (
            <div
              key={`${message.timeStamp}-${index}`}
              style={{
                display: 'flex',
                marginBottom: '16px',
                justifyContent: message.sender === currentUser ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '320px',
                  padding: '12px',
                  borderRadius: '16px',
                  backgroundColor: message.sender === currentUser ? '#22c55e' : '#374151',
                  color: 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <img
                    style={{ 
                      height: '32px', 
                      width: '32px', 
                      borderRadius: '50%',
                      flexShrink: 0
                    }}
                    src="https://avatar.iran.liara.run/public/43"
                    alt={`${message.sender}'s avatar`}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      margin: '0 0 4px 0',
                      color: message.sender === currentUser ? '#dcfce7' : '#d1d5db'
                    }}>
                      {message.sender}
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      margin: '0 0 4px 0',
                      lineHeight: '1.4'
                    }}>
                      {message.content}
                    </p>
                    <p style={{ 
                      fontSize: '10px', 
                      margin: 0,
                      color: message.sender === currentUser ? '#bbf7d0' : '#9ca3af'
                    }}>
                      {timeAgo(message.timeStamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Container - Fixed at Bottom matching instructor's style */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '16px 20px',
        borderTop: '1px solid #374151'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '100%',
          margin: '0 auto'
        }}>
          <button 
            onClick={() => console.log('Attach file clicked')}
            style={{
              backgroundColor: '#8b5cf6',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
          >
            <MdAttachFile size={20} />
          </button>
          
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your message here..."
            style={{
              flex: 1,
              backgroundColor: '#374151',
              color: 'white',
              border: '1px solid #4b5563',
              padding: '12px 16px',
              borderRadius: '25px',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#4b5563'}
          />
          
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: '#22c55e',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
          >
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

// Message History: Loads existing messages via HTTP API
// Real-time Chat: Connects via WebSocket for live messaging
// Send Messages: Sends new messages to Spring Boot via STOMP
// Auto-scroll: Automatically scrolls to show new messages
// Logout: Properly disconnects WebSocket connection


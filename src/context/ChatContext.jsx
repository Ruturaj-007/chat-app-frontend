import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");           // Current room id 
  const [currentUser, setCurrentUser] = useState(""); // current username  
  const [connected, setConnected] = useState(false);  // Connection status

  return (
    <ChatContext.Provider
      value={{
        roomId,         // State values
        currentUser,    
        connected,
        setRoomId,      // State setters 
        setCurrentUser,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
// Custom hook to use chat context     
const useChatContext = () => useContext(ChatContext);
export default useChatContext;

// Manages global application state
// Shares room ID, username, and connection status across components
// Prevents prop drilling

import { httpClient } from "../config/AxiosHelper";

// BACKEND CONNECTION: Creates a new chat room
export const createRoomApi = async (roomDetail) => {
    // HTTP POST request to Spring Boot endpoint: /api/v1/rooms
  const respone = await httpClient.post(`/api/v1/rooms`, roomDetail, {
    headers: {
      "Content-Type": "text/plain", // sending room id as a plain txt
    },
  });
  return respone.data;  // returns room data from backend 
};

// BACKEND CONNECTION: Joins an existing chat room
export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

// BACKEND CONNECTION: Fetches chat history/messages
export const getMessagess = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};

// createRoomApi: Calls Spring Boot to create a new chat room
// joinChatApi: Validates if a room exists before joining
// getMessagess: Loads chat history when user enters a room
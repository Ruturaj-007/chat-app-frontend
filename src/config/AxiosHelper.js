// AxiosHelper.js
import axios from "axios";

// BACKEND CONNECTION: Base URL for Spring Boot server
export const baseURL = "http://boot-app:8080";   // use service name instead of localhost

// BACKEND CONNECTION: Pre-configured HTTP client for API calls
export const httpClient = axios.create({
  baseURL: baseURL,
});




// AxiosHelper.js
// import axios from "axios";
// BACKEND CONNECTION: Base URL for Spring Boot server
// export const baseURL = "http://localhost:8080";

// BACKEND CONNECTION: Pre-configured HTTP client for API calls
// export const httpClient = axios.create({
//   baseURL: baseURL, // all API rquests will use this url
// });

// Sets up the connection endpoint to your Spring Boot backend
// Creates a reusable HTTP client for making API requests
// All REST API calls will go to http://localhost:8080

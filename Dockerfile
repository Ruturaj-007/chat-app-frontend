# Use Node.js to build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Set NODE_OPTIONS to fix crypto issue
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the React app (creates dist folder)
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# Stage 3: Run backend server
FROM node:14-alpine as backend

# Set working directory for backend
WORKDIR /app/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force --silent

# Copy source files
COPY . .


# Expose port 3000 for backend
EXPOSE 3001

# Start the backend server
CMD ["node", "server.js"]

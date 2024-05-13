# Stage 1: Build react app
FROM node:14-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force --silent

# Copy source files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve react app using Nginx
FROM nginx:alpine as frontend

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Copy build files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8000
EXPOSE 8000

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]


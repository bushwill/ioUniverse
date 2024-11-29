# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy all project files, including p5.js
COPY . .

# Install http-server for serving static files
RUN npm install -g http-server

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["http-server", ".", "-p", "8080"]
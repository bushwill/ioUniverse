# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the client-side files to the container
COPY . .

# Install http-server to serve the static files
RUN npm install -g http-server

# Expose port 8080 for the client-side app
EXPOSE 8080

# Start the http-server to serve the static files
CMD ["http-server", ".", "-p", "8080"]
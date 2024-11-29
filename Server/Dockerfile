# Use a lightweight Node.js image
# Use a lightweight Node.js base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the application code into the container
COPY . .

# Expose the port for the server
EXPOSE 3000

# Run the server
CMD ["node", "app.js"]
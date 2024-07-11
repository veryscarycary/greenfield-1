# Use the official Node.js image from Docker Hub
FROM node:14

ENV DOCKER="true"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to work directory
COPY . .

# # Expose the debugging port
# EXPOSE 9229

# CMD [ "node", "--inspect=0.0.0.0:9229", "server/index.js" ]
# Expose the port on which the app runs
EXPOSE 3000

# Command to run the application
CMD ["node", "server/index.js"]
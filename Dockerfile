#Using Node.js runtime as the base image
FROM node:18.15.0

# Setting the working directory in the container
WORKDIR /app

# This copys package.json and package-lock.json to the container
COPY package*.json ./

# Installs the application's dependencies
RUN npm install

# Copys the entire application to the container
COPY . .

# Expose the port where application runs
EXPOSE 8080

# command to run the application
CMD ["node", "app.js"]  
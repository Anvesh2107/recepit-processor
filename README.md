Running the Node.js Application
To run the Node.js application, follow these steps:

1)Install Node.js:

Download Node.js from the official website: https://nodejs.org/

2)Install Application Dependencies:

Open the directory where app.js file is located, open a terminal or command prompt and run the following command to install the application's dependencies:

npm install
This command will read the package.json file and install the necessary dependencies.

3)Run Node.js Application:

Once the dependencies are installed,start Node.js application by running the following command:
node app.js
This command will execute app.js script, and application will start.Message indicating that the server is running, as specified in the terminal:
Server is running on port 8080
Node.js application is now running and listening on port 8080 on local machine.

4)Access Node.js Application:

Open  web browser and navigate to http://localhost:8080 to access  Node.js application. If application exposes an API, Use tools like curl or Postman to make API requests.

RUNNING DOCKER

1)Build the Docker Image
Navigate to the project's root directory using terminal.

cd receipt-processor

2)Build a Docker image for the application by executing the following command:

docker build -t receipt-api .

This command creates a Docker image with the name "receipt-api."

3) Run the Docker Container
   
Start a Docker container from the image built. Ensure to map port 8080 from the container to the host.

docker run -p 8080:8080 receipt-api
The application is now running inside a Docker container and is accessible at http://localhost:8080.
4) Access the Application
Open a web browser and navigate to http://localhost:8080 to use the application.

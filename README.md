# Real time chat application

This is a node.js chat application in its early stages, powered by Sock.io, Express and MongoDB that provides the main functionalities you'd expect from a chat app, such as private messages, groups, etc.

# Features

-   Authentication.
-   Private messaging.
-   Group messaging.
-   Ability to update profile.
-   Other awesome features yet to be implemented.

# Setup

1. Open your terminal and clone this repo using `git clone https://github.com/akram-idrissi/Chat-App.git`.
2. Create .env file from .env.example file and adjust database parameters.
3. For `ACCESS_SECRET_TOKEN` and `REFRESH_SECRET_TOKEN`, run the following code in your terminal:

    ```
    >> node
    // run this line twice to get two different keys
    >> require("crypto").randomBytes(64).toString('hex');
        c27e33dc5e79604a12f794de3fb741ca2888750d9b906c0c66828585bbda0d2e
        064af3226acabb0a570a081adfc871e98293064a4be45840dda33c25ff322d9b
    ```

4. Go to the root directory and run `npm install` to install all dependecies.
5. Once the dependencies are installed, run `npm start` to start the server.
6. Open a browser of your choice at `http://127.0.0.1:5000`.

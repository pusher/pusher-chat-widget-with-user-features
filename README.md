# pusher-chat-widget-with-user-features

This is a demo of a real-time chat widget powered by NodeJS and Pusher Channels. You can read about how it was created on Pusher's blog.

## Prerequisites

- An IDE of your choice like Visual Studio Code.
- Node.js (version >= 10.x) installed on your computer.
- NMP
- Running MySQL database.
- Basic knowledge of JavaScript (ES6 syntax).
- Basic knowledge of using a CLI tool or terminal.
- Pusher application. Create one here.

## Getting Started

To get started with the project, make sure you have all the prerequisites above.

Clone the project to your machine.

### Set up the database

Use the following command to connect to your MySQL database:

```shell
 mysql -uroot -p
```

In this tutorial we use the default MySQL server configuration and connect as a root user with no password.
This is done for tutorial purposes only and must be changed for the production environment.

Execute queries from the `eventdb.sql` file by running:

```shell
 \. /full/path/to/the/pusher-event-chat/server/eventdb.sql
```

### Dependencies setup

1. Create Pusher Channels App.
1. Enable client events.
1. Update the Pusher keys in the `variable.env`, `public/landing/app.js` and `public/admin/admin.js` files.
1. Run the command to install dependencies:

    ```shell
    npm install pusher dotenv express express-session body-parser mysql js-sha512 jsdom -- save
    ```
  
## Running the app

To test the app, we need to start up our server by executing the command below, from the `./server` directory:

 ``` shell
    node server.js
```

The app should be running now and can be accessed through `http://localhost:3000`.

1. Open at least 3 different browser windows.
1. Login as an admin in the one window and as a regular participant in the rest. You also may login using the same credentials in the multiple windows to check how the demo app works with multiple connections of the same user.
1. Now you can play around with the chat. Chat with different users. Send messages from the Admin dashboard.
1. Choose one active participant and click `Send a Warning`. Check browser windows for the warned user, you should see alerts there.
1. Choose one active participant and click `Terminate User Connections`. Go and check browser windows for the chosen user. Chat window should be unavailable.
    > Users can join chat again after the page refresh. You will have to modify your server code to terminate that session and to prevent further logins from that user.

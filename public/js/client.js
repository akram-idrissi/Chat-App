var socket = io();

// display list of connected users
socket.on("usersList", (connectedUsers) => {
    $("#active-users").html(" ");
    for (let i = 0; i < connectedUsers.length; i++) {
        addToOnlineUsers(connectedUsers[i]);
    }
});

socket.on("usersList-self", (connectedUsers, socketID) => {
    console.log(`self ${connectedUsers} and ${socketID}`);
    $("#active-users").html(" ");
    for (let i = 0; i < connectedUsers.length; i++) {
        addToOnlineUsers(connectedUsers[i], socketID);
    }
});

// send a private message
$("#form").submit((event) => {
    event.preventDefault();

    let input = $("#input");
    let text = input.val();
    let receiver = $("#topbar-user").attr("data-ref");

    if (text && receiver) {
        socket.emit("client-msg", text, receiver);
        input.val("");
    }
});

socket.on("sender", (message) => {
    displayMessage(message);
});

socket.on("server-msg", (message) => {
    let notification = $(`#${message.sender.socketID}`);
    let attribute = $("#topbar-user").attr("data-ref");

    if (!attribute || attribute != message.sender.socketID) {
        if (notification) {
            notificationValue = notification.html();
            if (!notificationValue) {
                notification.html(1);
            } else {
                notification.html(Number(notificationValue) + 1);
            }
        }
    } else {
        displayMessage(message, false);
    }
});

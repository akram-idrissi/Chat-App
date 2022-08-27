var socket = io();

// display info of connected user
socket.on("user", (user) => {
    displayOnlineUser(user);
    socket.emit("onlineUsers", user);
});

// display list of connected users
socket.on("onlineUsers", (onlineUsers) => {
    $("#members").html("");
    // removing the current user from the online users list
    // to prevent him to send a msg to himself
    onlineUsers = onlineUsers = onlineUsers.filter(function (item) {
        return item._id != $("#h-d").val();
    });
    onlineUsers.map((onlineUser) => addToOnlineUsers(onlineUser));
});

// send a message
$("#form").submit((event) => {
    // preventing the form to auto reload
    event.preventDefault();

    // getting data
    let input = $("#input");
    let text = input.val();
    let receiverID = $("#topbar-user").attr("data-ref");

    // if text and receiverid are not empty
    if (text && receiverID) {
        socket.emit("to-receiver", text, receiverID);
        displayMessage({
            text: text,
            sender: { image: $(".pr-pic").attr("src") },
        });
    }
    input.val("");
});

socket.on("to-receiver", (message) => {
    /* 
        check whethere the receiver container is empty or not
        if so a message will be displayed in the message section 
        otherwise a notification will show up 
    */
    let senderNotif = $(`#${message.sender._id}`);
    let receiverID = $("#topbar-user").attr("data-ref");

    if (!receiverID || receiverID != message.sender.socketID) {
        if (senderNotif) {
            senderNotif.addClass("px-2 py-1");
            let notificationValue = senderNotif.html();
            if (!notificationValue) {
                senderNotif.html(1);
            } else {
                senderNotif.html(Number(notificationValue) + 1);
            }
        }
    } else {
        displayMessage(message, false);
    }
});

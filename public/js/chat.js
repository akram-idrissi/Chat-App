var socket = io();

// display info of connected user
socket.on("user", (user) => {
    displayOnlineUser(user);
    socket.emit("onlineUsers", user);
});

// getting back saved data
socket.on("re-populate", () => {
    const messages = JSON.parse(window.localStorage.getItem("messages"));
    const receiver = JSON.parse(window.localStorage.getItem("receiver"));
    const onlineUsers = JSON.parse(window.localStorage.getItem("online-users"));

    $("#members").html("");
    $("#msg-container").html("");
    $("#receiver-container").html("");

    console.log("receiver ", receiver);
    console.log("onlineUsers ", onlineUsers);
    console.log("messages ", messages);

    populate(messages, receiver, onlineUsers);
});

// display list of connected users
socket.on("onlineUsers", (onlineUsers) => {
    $("#members").html("");
    // removing the current user from the online users list
    // to prevent him to send a msg to himself
    onlineUsers = onlineUsers = onlineUsers.filter(function (item) {
        return item._id != $("#h-d").val();
    });

    // saving in localstorage for futuer uses
    window.localStorage.setItem("online-users", JSON.stringify(onlineUsers));
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

const populate = (messages, receiver, onlineUsers) => {
    // populate receiver
    if (receiver && typeof receiver !== "undefined")
        $("#receiver-container").html(receiver);

    // populate online users
    if (onlineUsers && typeof onlineUsers !== "undefined") {
        onlineUsers.map((user) => {
            appendOnlineUser(user);
        });
    }

    // populate messages
    if (messages && typeof messages !== "undefined") {
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            if (message.receiver._id == $("#topbar-rid").val()) {
                displayMessage(message);
                continue;
            } else {
                displayMessage(message, false);
                continue;
            }
        }
    }
};

const appendOnlineUser = (user) => {
    let element = `<button data-sid="${user.socketID}" onclick="displayReceiver(this)" class="on-user block focus:outline-none w-11/12 mx-auto mb-3 p-3 hover:bg-tenth rounded-xl transition duration-500" data-uid="${user._id}">
        <div class="flex justify-between items-center">
            <div class="text-lg text-main flex justify-between items-center">
                <img id="leftbar-img" class="w-10 h10 rounded-xl" src="${user.image}" alt="active-people-profile">
                <span id="leftbar-username" class="ml-4">${user.name}</span>
            </div>
            <div
                id="${user._id}" class="notification flex items-center justify-center text-xs text-main text-center bg-nineth rounded-md"></div>
        </div>
    </button>
    `;

    $("#members").append(element);
};

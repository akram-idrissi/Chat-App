function regularTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const strTime = `${hours}:${minutes} ${ampm}`;

    return strTime;
}

function addToOnlineUsers(user) {
    if (!user) return;
    let elment = `
        <button data-id="${user.id}" data-socket="${user.socketID}" onclick="displayReceiver(this)" class="list-group-item list-group-item-action border-0">
            <div id="${user.socketID}" class="notification badge bg-success float-right"></div>
            <div class="d-flex align-items-start">
                <img id="leftbar-img" src="${user.image}"
                    class="rounded-circle mr-1" alt="${user.name}" width="40" height="40">
                <div id="leftbar-username" class="flex-grow-1 ml-3">
                    ${user.name}
                </div>
            </div>
        </button>
        `;
    $("#active-users").append(elment);
}

function displayReceiver(element) {
    $("#msg-container").html("");
    let receiverID = $(element).attr("data-socket");
    $(`.notification`).html("");
    $("#topbar-user").attr("data-ref", receiverID);
    $("#topbar-img").attr("src", $(element).find("#leftbar-img").attr("src"));
    $("#topbar-username").html($(element).find("#leftbar-username").html());

    socket.emit("load-msgs", receiverID);
}

socket.on("private-msgs", (messages, socketID) => {
    console.log(messages);
    let receiverID = $("#topbar-user").attr("data-ref");
    if (messages == "null") return;
    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        if (message.sender.socketID == receiverID) {
            displayMessage(message, false);
            continue;
        } else if (message.sender.socketID == socketID) {
            displayMessage(message);
            continue;
        }
    }
});

function displayMessage(message, self = true) {
    let cssClass = self ? "chat-message-right pb-4" : "chat-message-left pb-4";
    let sender = self ? "You" : message.sender.name;

    let child = `
        <div class="${cssClass}">
            <div>
                <img src="${message.sender.image}"
                    class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">${regularTime(
                    new Date()
                )}</div>
            </div>  
            <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                <div class="font-weight-bold mb-1">${sender}</div>
                ${message.text}
            </div>
        </div>`;

    $("#msg-container").append(child);
}

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
        <button data-socket="${user.socketID}" onclick="displayReceiver(this)" class="block focus:outline-none w-11/12 mx-auto mb-3 p-3 hover:bg-tenth rounded-xl transition duration-500">
            <div class="flex justify-between items-center">
                <div class="text-lg text-main flex justify-between items-center">
                    <img id="leftbar-img" class="w-10 h10 rounded-xl" src="${user.image}" alt="active-people-profile">
                    <span id="leftbar-username" class="ml-4">${user.name}</span>
                </div>
                <div
                    id="${user.socketID}" class="notification badge"></div>
            </div>
        </button>
        `;
    $("#members").append(elment);
}

function displayReceiver(element) {
    
    $("#msg-container").html("");
    $("#topbar-user").html("");
    let receiverID = $(element).attr("data-socket");
    $("#topbar-user").attr("data-ref", receiverID);
    $(element).find(`.notification`).html("");
    $(element).find(`.notification`).attr("class", "notification badge");
    let image = $(element).find("#leftbar-img").attr("src");
    let username = $(element).find("#leftbar-username").html();
    $("#input").attr(
        "placeholder",
        `Message with ${$(element).find("#leftbar-username").html()}`
    );

    let child = `
        <div class="flex items-center">
            <div class="w-10 h-10 mr-4 relative flex flex-shrink-0">
                <img id="topbar-img" class="rounded-lg w-full h-full object-cover"
                    src="${image}" alt="" />
            </div>
            <div class="text-sm">
                <p id="topbar-username" class="font-bold">${username}</p>
            </div>
        </div>
    `;

    $("#topbar-user").append(child);
    socket.emit("load-msgs", receiverID);
}

socket.on("private-msgs", (messages, socketID) => {
    try {
        let receiverID = $("#topbar-user").attr("data-ref");
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
    } catch (error) {}
});

function displayMessage(message, self = true) {
    let child = `<div class="flex flex-row justify-end">
    <div class="messages text-sm text-white">
        <div>
            <div class="text-right">
                <span class="name inline-block text-md">You</span>
            </div>

            <p
                style="background-color: #387aff;"
                class="message p-3 my-1 text-white rounded-lg rounded-tr-none max-w-xs lg:max-w-md"
            >
                ${message.text}
            </p>

            <div class="flex justify-between items-center">
                <span class="time inline-block text-xs text-fourth">
                    ${regularTime(new Date())}
                </span>
                
            </div>
        </div>
    </div>
    <div class="image w-8 h-8 relative flex flex-shrink-0 ml-4">
        <img
            class="rounded-lg w-full h-full object-cover"
            src="${message.sender.image}"
            alt=""
        />
    </div>
</div>`;

    if (!self) {
        child = `
        <div class="flex flex-row justify-start">
        <div class="w-8 h-8 relative flex flex-shrink-0 mr-4">
            <img
                class="rounded-lg w-full h-full object-cover"
                src="${message.sender.image}"
                alt=""
            />
        </div>
        <div class="messages">
            <div>
                <div>
                    <span class="name inline-block text-md">
                        ${message.sender.name}
                    </span>
                </div>
                <p class="message p-3 bg-fith text-eleventh my-1 rounded-lg rounded-tl-none max-w-xs lg:max-w-md">
                    ${message.text}
                </p>
                <div class="flex justify-between items-center">
                    <span class="time inline-block text-xs text-fourth">
                        ${regularTime(new Date())}
                    </span>
                    
                </div>
            </div>
        </div>
    </div>
        `;
    }

    $("#msg-container").append(child);
}

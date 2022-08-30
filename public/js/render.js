function regularTime(date) {
    let hours = date[0];
    let minutes = date[1];
    const ampm = hours >= 12 ? "pm" : "am";

    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const strTime = `${hours}:${minutes} ${ampm}`;

    return strTime;
}

function displayOnlineUser(user) {
    if (!user) return;
    const u = `
    <div class="p-4 flex justify-between items-center bg-fith rounded-xl mb-5">
        <input id="h-s" type="hidden" value="${user.socketID}">   
        <input id="h-d" type="hidden" value="${user._id}">   
        <div class="flex">
            <img class="pr-pic w-14 h-14 rounded-xl mr-3" src="${user.image}"
                alt="profile picture" srcset="">
            <div class="w-24">
                <p title="${user.name}" class="u-name truncate text-white text-md font-sans mb-1">${user.name}</p>
                <span class="flex items-center text-xs text-fourth w-56">
                    <span class="inline-block mr-1 w-3 h-3 rounded-full" style="background-color: #54d396"></span>
                    <span>Active for chat</span>
                </span>
            </div>
        </div>
        <div x-data={show:false}>
            <button @click="show=!show"  @click.outside="show=false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
            </button>

            <div  x-show="show" x-cloak class="w-28 absolute -right-12 top-36 rounded-md shadow-xl bg-fith focus:outline-none">
                <div class="py-1" role="none">
                    <button id="profile" onclick="showProfile()" class="text-white block w-full text-left px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Profile</button>
                    <form method="POST" action="/auth/logout">
                        <button type="submit" class="text-white block w-full text-left px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Log out</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;

    $(".online-user").html(u);
}

function addToOnlineUsers(user) {
    if (!user) return;
    let elment = `
        <button data-sid="${user.socketID}" onclick="displayReceiver(this)" class="on-user block focus:outline-none w-11/12 mx-auto mb-3 p-3 hover:bg-tenth rounded-xl transition duration-500" data-uid="${user._id}">
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

    $("#members").append(elment);
}

function displayReceiver(element) {
    // clearing containers bedore displaying information
    $("#topbar-user").html("");
    $("#msg-container").html("");
    $(element).find(`.notification`).html("");

    // getting data
    let receiverSID = $(element).attr("data-sid");
    let receiverUID = $(element).attr("data-uid");
    let image = $(element).find("#leftbar-img").attr("src");
    let username = $(element).find("#leftbar-username").html();

    // setting the placeholder in the input field
    $("#input").attr("placeholder", `Message with ${username}`);

    // setting helper attributes
    $("#topbar-user").attr("data-ref", receiverSID);
    $("#topbar-user").attr("data-uef", $(element).attr("data-uid"));
    $(element)
        .find(`.notification`)
        .attr(
            "class",
            "flex items-center justify-center text-xs text-main text-center bg-nineth rounded-md"
        );

    let child = `
        <button id="arrow-left" class="mr-4 focus:outline-none lg:hidden md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
        </button>
        <div class="flex items-center">
            <div class="w-10 h-10 mr-4 relative flex flex-shrink-0" >
                <input type="hidden" id="topbar-rid" value="${receiverUID}">
                <img id="topbar-img" class="rounded-lg w-full h-full object-cover"
                    src="${image}" alt="" />
            </div>
            <div class="text-sm">
                <p id="topbar-username" class="font-bold">${username}</p>
            </div>
        </div>
    `;

    $("#topbar-user").append(child);
    socket.emit("load-msgs", receiverSID);
}

socket.on("load-msgs", (messages, sender, receiver) => {
    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        if (message.sender._id == receiver._id) {
            displayMessage(message, false);
            continue;
        } else if (message.sender._id == sender._id) {
            displayMessage(message);
            continue;
        }
    }
});

function displayMessage(message, self = true) {
    let child = null;
    if (self) {
        child = `
            <div class="right msg flex flex-row justify-end mb-4">
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
                                ${regularTime(message.sentAt.split("T")[1])}
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
    }

    if (!self) {
        child = `
            <div class="left msg flex flex-row justify-start mb-4">
                <div class="image w-8 h-8 relative flex flex-shrink-0 mr-4">
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
                                ${regularTime(message.sentAt.split("T")[1])}
                            </span>
                            
                        </div>
                    </div>
                </div>
            </div>
            `;
    }

    $("#msg-container").append(child);
    let msgContainer = document.getElementById("msg-container");
    msgContainer.scrollTo(0, msgContainer.scrollHeight);
}

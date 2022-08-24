const reset = () => {
    $("#password").val("");
    $(".input").prop("disabled", false);
};

const loginErrorMsg = `
<div x-data="{show:true}" x-init="setTimeout(() => show=false, 3000)" x-show="show" 
class="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
role="alert">
    <div class="w-full">
        <span class="w-80 text-center inline-block font-medium">Credentials provided are invalid</span>
    </div>
</div>
`;

let registerErrorMsg = `
<div class="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
    role="alert">
    <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor"
        viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"></path>
    </svg>
    <span class="sr-only">Danger</span>
    <div>
        <span class="font-medium">Ensure that these requirements are met:</span>
        <ul class="mt-1.5 ml-4 text-red-700 list-disc list-inside">
            <li>Required 30 characters or fewer. Letters, digits and @/./+/-/_ only.</li>
            <li>Required Letters (upper and lower), digits and /./-/_ only.</li>
            <li>Required 8 characters or more, letters digits and symbols</li>
        </ul>
    </div>
</div>
`;

const sendReq = (url, type, data, errorMsg, location) => {
    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: "json",
        success: function (data, status, xhr) {
            console.log(data);
            if (data.error) {
                reset();
                $(".error").html(errorMsg);
            } else {
                window.localStorage.setItem("name", data.name);
                window.location = location;
            }
        },
        error: function (xhr, status, err) {
            reset();
        },
    });
};

let form = $("#form");

if (form && form != "undefined") {
    let action = form.attr("data-type");
    form.submit((event) => {
        event.preventDefault();
        $(".input").prop("disabled", true);

        if (action === "login") {
            sendReq(
                "login",
                "post",
                { email: $("#email").val(), email: $("#password").val() },
                loginErrorMsg,
                "/chat"
            );

            return;
        }

        sendReq(
            "register",
            "post",
            {
                name: $("#name").val(),
                email: $("#email").val(),
                password: $("#password").val(),
            },
            registerErrorMsg,
            "login"
        );
    });
}

const getAvatar = (element) => {
    $("li").children("span").removeClass();

    $(element)
        .children("span")
        .addClass("relative -top-2.5 inline-block w-7 h-0.5 bg-blue-500");

    $("#av").val($(element).find(".av").attr("src"));
};

const reset = () => {
    $("#password").val("");
    $(".input").prop("disabled", false);
};

const renderMsg = (msg) => {
    return `
    <div x-data="{show:true}" x-init="setTimeout(() => show=false, 5000)" x-show="show"
        class="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
        role="alert">
        <div class="w-full">
            <span class="error-text text-center inline-block font-medium">${msg}</span>
        </div>
    </div>
    `;
};

const sendReq = (url, type, data, location) => {
    $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: "json",
        success: function (data, status, xhr) {
            console.log(data);
            if (data.error) {
                reset();
                $(".error").html(renderMsg(data.msg));
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

const form = $("#form");

if (form && form != "undefined") {
    let action = form.attr("data-type");
    form.submit((event) => {
        event.preventDefault();
        $(".input").prop("disabled", true);

        if (action === "login") {
            sendReq(
                "login",
                "post",
                { email: $("#email").val(), password: $("#password").val() },
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
                image: $("#av").val(),
            },
            "login"
        );
    });
}

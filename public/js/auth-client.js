const reset = () => {
    $("#password").val("");
    $(".input").prop("disabled", false);
};

const errorMsg = `
<div x-data="{show:true}" x-init="setTimeout(() => show=false, 3000)" x-show="show" 
class="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
role="alert">
    <div class="w-full">
        <span class="w-80 text-center inline-block font-medium">Credentials provided are invalid</span>
    </div>
</div>

`;

let form = $("#form");

if (form && form != "undefined") {
    form.submit((event) => {
        event.preventDefault();

        $(".input").prop("disabled", true);
        $.ajax({
            url: "login",
            type: "post",
            data: {
                email: $("#email").val(),
                password: $("#password").val(),
            },
            dataType: "json",
            success: function (data, status, xhr) {
                if (data.error) {
                    reset();
                    $(".error").html(errorMsg);
                } else {
                    window.localStorage.setItem("name", data.name);
                    window.location = "/chat";
                }
            },
            error: function (xhr, status, err) {
                reset();
            },
        });
    });
}

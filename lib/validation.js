// validation of form fields
function inputValidator(req, pattern = false) {
    const nameRegex = "[a-zA-Z0-9@\\\\.\\\\_]{4,20}";
    const emailRegex = /^\w+([\.-]?\w+)+@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex =
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ .,;:!?+\\-_*/&#|@])[a-zA-Z0-9 .,;:!?+\\-_*/&#|@]{8,64}";

    let { name, email, password, image } = req.body;

    // validation for registration
    if (pattern) {
        if ([name, email, password, image].some((field) => !field))
            return "All fields are required";

        if (!name.match(nameRegex))
            return "Name must be 4 to 20 characters.Letters, digits and . _ only.";
        if (!email.match(emailRegex))
            return "Email must include Letters (upper and lower), digits and /./-/_ only.";
        if (!password.match(passRegex))
            return "Password must be at least 8 characters, letters digits and symbols";
        if (!image || typeof image === "undefined")
            return "Please choose an avatar";
    }
    // validation for login
    else {
        if ([email, password].some((field) => !field))
            return "All fields are required";
    }

    return true;
}

module.exports = { inputValidator };

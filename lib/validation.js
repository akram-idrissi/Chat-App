// validation of form fields
function inputValidator(req, pattern = false) {
    const nameRegex = "[a-zA-Z0-9@\\\\.\\\\_]{4,20}";
    const emailRegex = /^\w+([\.-]?\w+)+@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex =
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ .,;:!?+\\-_*/&#|@])[a-zA-Z0-9 .,;:!?+\\-_*/&#|@]{8,64}";

    let { name, email, password } = req.body;

    // validation for registration
    if (pattern) {
        if ([name, email, password].some((field) => !field)) return false;
        if (
            !name.match(nameRegex) ||
            !email.match(emailRegex) ||
            !password.match(passRegex)
        )
            return false;
    }
    // validation for login
    else {
        if ([email, password].some((field) => !field)) return false;
    }

    return true;
}

module.exports = { inputValidator };

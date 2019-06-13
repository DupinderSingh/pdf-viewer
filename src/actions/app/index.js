import history from '../../index';

export function forwardTo(location) {
    history.push(location)
}

export function checkValidation(e) {
    if (e.target.checkValidity()) {
        if (e.target.type === "select-one") {
            e.target.parentElement.classList.remove("has-error");
            e.target.parentElement.classList.remove("personal-select-with-error");
            e.target.parentElement.classList.add("personal-select-without-error");
        } else {
            e.target.parentElement.classList.remove("has-error");
        }
    } else {
        e.target.parentElement.classList.add("has-error");
        e.target.parentElement.classList.add("personal-select-with-error");
        e.target.parentElement.classList.remove("personal-select-without-error");
        if (e.target.type === "select-one") {
        } else {
            e.target.parentElement.classList.add("has-error");
        }
    }
}

export function authApi() {
    return process.env.REACT_APP_AUTH_API
}

import history from '../../index';
import {authApi as auth} from '../app/index';
import {logout} from "../account";
const AUTH_API = auth();

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

export function refreshId() {
    // eslint-disable-next-line no-unused-vars
    let status = "";
    const config = {
        method: "GET",
        // headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    };
    return dispatch => {
        fetch(AUTH_API + '/refresh-api?id='+localStorage.getItem("id"), config)
            .then(function (res) {
                status = res.status;
                return res.json()
            })
            .then(function (res) {
                    if (res.error) {
                        dispatch(logout());
                    }
                },
                function () {
                    dispatch(logout());
                });
    }
}


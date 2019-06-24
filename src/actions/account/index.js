import {
    CHANGE_LOGIN_FORM,
    CLEAR_OTP,
    GENERATE_QR_CODE_PAGE_LOADING,
    LOGIN_ACCOUNT_FAILURE,
    LOGIN_ACCOUNT_REQUEST,
    LOGIN_ACCOUNT_SUCCESS,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    SAVE_QR_CODE,
    SEND_OTP_FAILURE,
    SEND_OTP_REQUEST,
    SEND_OTP_SUCCESS,
    SWITCH_PHONE_TO_VERIFY_OTP,
    IP_ADDRESS_REQUEST, IP_ADDRESS_SUCCESS, IP_ADDRESS_FAILURE,
    LOGOUT_ACCOUNT_REQUEST, LOGOUT_ACCOUNT_SUCCESS, LOGOUT_ACCOUNT_FAILURE, CLEAR_LOGOUT_API_RESPONSE,
    GET_COUNTRY_CODE_REQUEST, GET_COUNTRY_CODE_SUCCESS, GET_COUNTRY_CODE_FAILURE
} from '../../types/account';
import {POST_WITHOUT_TOKEN} from "../../middleware/without_token/post-api";
import {authApi} from '../app/index';
import {CALL_POST_API} from "../../middleware/token/post-api";
import {GET_API_WITHOUT_TOKEN} from "../../middleware/without_token/get-api";

const AUTH_API = authApi();

export function login() {
    return {type: LOGIN_SUCCESS}
}

export function getIpAddress(body) {
    return {
        [POST_WITHOUT_TOKEN]: {
            endpoint: AUTH_API + '/ip-address',
            types: [IP_ADDRESS_REQUEST, IP_ADDRESS_SUCCESS, IP_ADDRESS_FAILURE],
            body: JSON.stringify(body)
        }
    }
}


export function getCountryCode() {
    return {
        [GET_API_WITHOUT_TOKEN]: {
            endpoint: AUTH_API + '/country-code',
            types: [GET_COUNTRY_CODE_REQUEST, GET_COUNTRY_CODE_SUCCESS, GET_COUNTRY_CODE_FAILURE]
        }
    }
}

export function sendOtp(body) {
    return {
        [POST_WITHOUT_TOKEN]: {
            endpoint: AUTH_API + '/otp-verify',
            types: [SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE],
            body: JSON.stringify(body)
        }
    }
}

export function loginAccount(body) {
    return {
        [POST_WITHOUT_TOKEN]: {
            endpoint: AUTH_API + '/check-mobile-id',
            types: [LOGIN_ACCOUNT_REQUEST, LOGIN_ACCOUNT_SUCCESS, LOGIN_ACCOUNT_FAILURE],
            body: JSON.stringify(body)
        }
    }
}


export function logoutAccount(body) {
    return {
        [CALL_POST_API]: {
            endpoint: AUTH_API + '/user-logout',
            types: [LOGOUT_ACCOUNT_REQUEST, LOGOUT_ACCOUNT_SUCCESS, LOGOUT_ACCOUNT_FAILURE],
            body: body
        }
    }
}

export function logout() {
    return {type: LOGOUT_SUCCESS}
}
export function clearLogoutApiResponse() {
    return {type: CLEAR_LOGOUT_API_RESPONSE}
}
export function generateQrCodeLoading(status) {
    return {type: GENERATE_QR_CODE_PAGE_LOADING, status}
}

export function saveQrCode(qr) {
    return {type: SAVE_QR_CODE, qr}
}

export function changeLoginForm(newState) {
    return {type: CHANGE_LOGIN_FORM, newState}
}

export function switchPhoneToVerifyOtp(status) {
    return {type: SWITCH_PHONE_TO_VERIFY_OTP, status}
}

export function clearOtp() {
    return {type: CLEAR_OTP}
}

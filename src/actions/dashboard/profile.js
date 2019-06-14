import {
    CHANGE_PROFILE_STATE,
    CLEAR_PROFILE_API_RESPONSE,
    GET_PROFILE_FAILURE,
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    UPDATE_PROFILE_INFO_FAILURE,
    UPDATE_PROFILE_INFO_REQUEST,
    UPDATE_PROFILE_INFO_SUCCESS,
    UPDATE_PROFILE_PHOTO_FAILURE,
    UPDATE_PROFILE_PHOTO_REQUEST,
    UPDATE_PROFILE_PHOTO_SUCCESS
} from "../../types/dashboard/profile";
import {authApi} from '../app/index';
import {GET_API} from "../../middleware/token/get-api";
import {CALL_POST_API} from "../../middleware/token/post-api";

const AUTH_API = authApi();

export function getProfile() {
    return {
        [GET_API]: {
            endpoint: AUTH_API + '/user-profile?id=' + localStorage.getItem("id"),
            types: [GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, GET_PROFILE_FAILURE]
        }
    }
}

export function clearProfileApiResponse() {
    return {type: CLEAR_PROFILE_API_RESPONSE}
}

export function changeProfileState(newState) {
    return {type: CHANGE_PROFILE_STATE, newState}
}

export function f() {
    /*
    * check the condition everytime there is click as well as not click
    * when clicked storing the current elements as well as check the status
    * */
}
export function updateProfileInfo(body) {
    return {
        [CALL_POST_API]: {
            endpoint: AUTH_API + '/updateProfile',
            types: [UPDATE_PROFILE_INFO_REQUEST, UPDATE_PROFILE_INFO_SUCCESS, UPDATE_PROFILE_INFO_FAILURE],
            body: body
        }
    }
}

export function updateProfilePic(file, removePic) {
    let status = "", config = {};
    if (removePic) {
         config = {
            method: "POST",
            // headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`},
            body: JSON.stringify({type: false, id: localStorage.getItem("id")})
        };
    }
    else {
        let formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'true');
        formData.append('id', localStorage.getItem("id"));
        config = {
            method: "POST",
            // headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`},
            body: formData
        };
        formData.append('id', localStorage.getItem("id"));
    }
    return dispatch => {
        dispatch(updateProfilePhotoRequest());
        fetch(AUTH_API + '/updateProfilePhoto', config)
            .then(function (res) {
                status = res.status;
                return res.json()
            })
            .then(function (res) {
                    if (status === 200 && !res.error) {
                        dispatch(updateProfilePhotoSuccess({data: {error: false, message: res.message}, status: 200}));
                    } else {
                        dispatch(updateProfilePhotoFailure({data: {error: true, message: res.message}, status: status}))
                    }
                },
                function () {
                    dispatch(updateProfilePhotoFailure({
                        data: {message: removePic ? "Error while removing profile photo." : "Error while updating profile.", error: true},
                        status: 500
                    }))
                })
    }
}


export function updateProfilePhotoRequest() {
    return {type: UPDATE_PROFILE_PHOTO_REQUEST}
}

export function updateProfilePhotoSuccess(response) {
    return {type: UPDATE_PROFILE_PHOTO_SUCCESS, response}
}

export function updateProfilePhotoFailure(response) {
    return {type: UPDATE_PROFILE_PHOTO_FAILURE, response}
}

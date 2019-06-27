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
import {getUserSessionId} from "../../services/user";

const AUTH_API = authApi();

export function getProfile() {
    return {
        [GET_API]: {
            endpoint: AUTH_API + '/user-profile?id=' + getUserSessionId(),
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

export function updateProfileInfo(body) {
    return {
        [CALL_POST_API]: {
            endpoint: AUTH_API + '/updateProfile',
            types: [UPDATE_PROFILE_INFO_REQUEST, UPDATE_PROFILE_INFO_SUCCESS, UPDATE_PROFILE_INFO_FAILURE],
            body: body
        }
    }
}

export function updateProfilePic(file, removePic, country) {
    if (removePic) {
        return {
            [CALL_POST_API]: {
                endpoint: AUTH_API + '/removeProfilePhoto',
                types: [UPDATE_PROFILE_INFO_REQUEST, UPDATE_PROFILE_INFO_SUCCESS, UPDATE_PROFILE_INFO_FAILURE],
                body: {id: getUserSessionId(), country}
            }
        }
    } else {
        let status = "", config = {};
        let formData = new FormData();
        formData.append('image', file);
        formData.append('type', '1');
        config = {
            method: "POST",
            // headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`},
            body: formData
        };
        formData.append('id', getUserSessionId());
        formData.append('country', country);
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
                            data: {
                                message: removePic ? "Error while removing profile photo." : "Error while updating profile.",
                                error: true
                            },
                            status: 500
                        }))
                    })
        }
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

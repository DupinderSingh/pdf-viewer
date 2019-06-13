import {
    CLEAR_PROFILE_API_RESPONSE,
    GET_PROFILE_FAILURE,
    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    CHANGE_PROFILE_STATE,
    UPDATE_PROFILE_INFO_REQUEST, UPDATE_PROFILE_INFO_SUCCESS, UPDATE_PROFILE_INFO_FAILURE,
    UPDATE_PROFILE_PHOTO_REQUEST, UPDATE_PROFILE_PHOTO_SUCCESS, UPDATE_PROFILE_PHOTO_FAILURE
} from "../../types/dashboard/profile";

const initialState = {
    profile: {
        "user_id": "",
        "name": "",
        "mobile_data": "",
        "photo": "",
        "email": ""
    },
    getProfilePageLoading: false,
    getProfileStatus: "",
    getProfileError: "",
    getProfileMessage: "",
    updateProfileInfoPageLoading: false,
    updateProfileInfoStatus: "",
    updateProfileInfoError: "",
    updateProfileInfoMessage: "",
    updateProfilePhotoPageLoading: false,
    updateProfilePhotoStatus: "",
    updateProfilePhotoError: "",
    updateProfilePhotoMessage: ""
};

export default function profileReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE_REQUEST:
            return Object.assign({}, state, {
                getProfilePageLoading: true,
                updateProfileInfoStatus: "",
                updateProfileInfoError: "",
                updateProfileInfoMessage: "",
                updateProfilePhotoStatus: "",
                updateProfilePhotoError: "",
                updateProfilePhotoMessage: ""
            });
        case GET_PROFILE_SUCCESS:
            if (!action.response.data.error) {
                return Object.assign({}, state, {
                    getProfilePageLoading: false,
                    getProfileStatus: 200,
                    getProfileError: false,
                    profile: action.response.data.profile,
                    getProfileMessage: ""
                });
            } else {
                return Object.assign({}, state, {
                    getProfilePageLoading: false,
                    getProfileStatus: 200,
                    getProfileError: true,
                    profile: {
                        "user_id": "",
                        "name": "",
                        "mobile_data": "",
                        "photo": "",
                        "email": ""
                    },
                    getProfileMessage: action.response.data.message
                });
            }
        case GET_PROFILE_FAILURE:
            return Object.assign({}, state, {
                getProfilePageLoading: false,
                getProfileStatus: action.response.status,
                getProfileError: true,
                profile: {
                    "user_id": "",
                    "name": "",
                    "mobile_data": "",
                    "photo": "",
                    "email": ""
                },
                getProfileMessage: action.response.data.message
            });
        case CLEAR_PROFILE_API_RESPONSE:
            return Object.assign({}, state, {
                getProfileStatus: "",
                getProfileError: "",
                getProfileMessage: "",
                updateProfileInfoStatus: "",
                updateProfileInfoError: "",
                updateProfileInfoMessage: "",
                profile: {
                    "user_id": "",
                    "name": "",
                    "mobile_data": "",
                    "photo": "",
                    "email": ""
                }
            });
        case CHANGE_PROFILE_STATE:
            return Object.assign({}, state, {
                profile: action.newState,
                updateProfileInfoStatus: "",
                updateProfileInfoError: "",
                updateProfileInfoMessage: "",
                updateProfilePhotoStatus: "",
                updateProfilePhotoError: "",
                updateProfilePhotoMessage: ""
            });
        case UPDATE_PROFILE_INFO_REQUEST:
            return Object.assign({}, state, {
                updateProfileInfoPageLoading: true
            });
        case UPDATE_PROFILE_INFO_SUCCESS:
            return Object.assign({}, state, {
                updateProfileInfoPageLoading: false,
                updateProfileInfoStatus: 200,
                updateProfileInfoError: action.response.data.error,
                updateProfileInfoMessage: action.response.data.message
            });
        case UPDATE_PROFILE_INFO_FAILURE:
            return Object.assign({}, state, {
                updateProfileInfoPageLoading: false,
                updateProfileInfoStatus: action.response.status,
                updateProfileInfoError: true,
                updateProfileInfoMessage: action.response.data.message
            });

        case UPDATE_PROFILE_PHOTO_REQUEST:
                return Object.assign({}, state, {
                    updateProfilePhotoPageLoading: true
                });
        case UPDATE_PROFILE_PHOTO_SUCCESS:
            return Object.assign({}, state, {
                updateProfilePhotoPageLoading: false,
                updateProfilePhotoStatus: 200,
                updateProfilePhotoError: false,
                updateProfilePhotoMessage: action.response.data.message
            });
        case UPDATE_PROFILE_PHOTO_FAILURE:
            return Object.assign({}, state, {
                updateProfilePhotoPageLoading: false,
                updateProfilePhotoStatus: action.response.status,
                updateProfilePhotoError: true,
                updateProfilePhotoMessage: action.response.data.message
            });
        default:
            return state
    }
}
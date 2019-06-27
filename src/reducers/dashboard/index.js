import {
    GET_PDF_FOLDER_STRUCTURE_FAILURE,
    GET_PDF_FOLDER_STRUCTURE_REQUEST,
    GET_PDF_FOLDER_STRUCTURE_SUCCESS,
    UPDATE_FILE,
    DISPLAY_IMAGE, CHANGE_SEARCH_TEMPLATE,
    CLEAR_FILE_FOLDER_DATA
} from "../../types/dashboard";
import {getUserSessionId} from "../../services/user";

const initialState = {
    getPdfFolderStructurePageLoading: false,
    getPdfFolderStructureStatus: "",
    getPdfFolderStructureError: "",
    getPdfFolderStructureMessage: "",
    directory: [],
    commonPath: "document/" + getUserSessionId(),
    back: false,
    file: {
        type: "",
        value: "",
        required: [{src: "", alt: "", downloadUrl: ""}]
    },
    imageVisible: false,
    searchTemplate: ""
};

export default function dashboardReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PDF_FOLDER_STRUCTURE_REQUEST:
            return Object.assign({}, state, {
                getPdfFolderStructurePageLoading: true
            });
        case GET_PDF_FOLDER_STRUCTURE_SUCCESS:
            if (!action.response.data.error) {
                return Object.assign({}, state, {
                    getPdfFolderStructurePageLoading: false,
                    getPdfFolderStructureStatus: 200,
                    getPdfFolderStructureError: false,
                    getPdfFolderStructureMessage: "",
                    directory: action.response.data.document,
                    back: action.response.data.back,
                    commonPath: action.response.data.commonPath
                });
            } else {
                return Object.assign({}, state, {
                    getPdfFolderStructurePageLoading: false,
                    getPdfFolderStructureStatus: 200,
                    getPdfFolderStructureError: true,
                    getPdfFolderStructureMessage: action.response.data.message,
                    directory: [],
                    back: false,
                    commonPath: "document/" + getUserSessionId()
                });
            }
        case GET_PDF_FOLDER_STRUCTURE_FAILURE:
            return Object.assign({}, state, {
                getPdfFolderStructurePageLoading: false,
                getPdfFolderStructureStatus: action.response.status,
                getPdfFolderStructureError: true,
                getPdfFolderStructureMessage: action.response.data.message,
                directory: [],
                back: false,
                commonPath: "document/" + getUserSessionId()
            });
        case UPDATE_FILE:
            return Object.assign({}, state, {
                file: {
                    type: action.ext,
                    value: action.value,
                    required: action.required
                }
            });
        case DISPLAY_IMAGE:
            return Object.assign({}, state, {
                imageVisible: action.status
            });
        case CHANGE_SEARCH_TEMPLATE:
            return Object.assign({}, state, {
              searchTemplate: action.value
            });
        case CLEAR_FILE_FOLDER_DATA:
            return Object.assign({}, state, {
                getPdfFolderStructureStatus: "",
                getPdfFolderStructureError: "",
                getPdfFolderStructureMessage: "",
                directory: [],
                commonPath: "document/" + getUserSessionId(),
                back: false,
                file: {
                    type: "",
                    value: "",
                    required: [{src: "", alt: "", downloadUrl: ""}]
                },
                imageVisible: false,
                searchTemplate: ""
            });
        default:
            return state
    }
}

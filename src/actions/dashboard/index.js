import {GET_API} from "../../middleware/token/get-api";
import {
    GET_PDF_FOLDER_STRUCTURE_FAILURE,
    GET_PDF_FOLDER_STRUCTURE_REQUEST,
    GET_PDF_FOLDER_STRUCTURE_SUCCESS,
    UPDATE_FILE,
    DISPLAY_IMAGE,
    CHANGE_SEARCH_TEMPLATE,
    CLEAR_FILE_FOLDER_DATA
} from "../../types/dashboard/index.js";
import {authApi} from "../app";
import {getUserId} from "../../services/user";

const AUTH_API = authApi();

export function getPdfFolderStructure(back, path, search, file_name) {
  return {
      [GET_API]: {
          endpoint: AUTH_API + '/file-record-fetch?user_id=' + getUserId() + '&file_path=' + path + "&back=" + back + "&search=" + search + "&file_name=" + file_name,
          types: [GET_PDF_FOLDER_STRUCTURE_REQUEST, GET_PDF_FOLDER_STRUCTURE_SUCCESS, GET_PDF_FOLDER_STRUCTURE_FAILURE]
      }
  }
}

export function updateFile(ext, value, required) {
    return {type: UPDATE_FILE, ext, value, required}
}
export function displayImage(status) {
    return {type: DISPLAY_IMAGE, status}
}
export function changeSearchTemplate(value) {
    return {type: CHANGE_SEARCH_TEMPLATE, value}
}
export function clearFileFolderData() {
    return {type: CLEAR_FILE_FOLDER_DATA}
}

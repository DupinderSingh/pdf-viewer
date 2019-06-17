import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import FolderFile from '../../components/dashboard/folder-file';
import SearchPdf from "../../components/dashboard/search-pdf";
import {clearFileFolderData} from "../../actions/dashboard";

class UploadTemplate extends Component {
    componentWillMount() {
        this.props.dispatch(clearFileFolderData());
    }

    render() {
        return (
            <section id="content" className="content">
                <SearchPdf/>
                <FolderFile/>
            </section>
        )
    }
}


const mapStateToProps = (state) => {
    const {getPdfFolderStructurePageLoading, getPdfFolderStructureStatus, getPdfFolderStructureError, getPdfFolderStructureMessage} = state.dashboardReducer;
    return {
        getPdfFolderStructurePageLoading,
        getPdfFolderStructureStatus,
        getPdfFolderStructureError,
        getPdfFolderStructureMessage
    };
};
export default withRouter(connect(mapStateToProps)(UploadTemplate))




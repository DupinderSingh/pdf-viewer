import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import FolderFile from '../../components/dashboard/folder-file';
import SearchPdf from "../../components/dashboard/search-pdf";
import {clearFileFolderData} from "../../actions/dashboard";
import ReactNotification from "react-notifications-component";

class UploadTemplate extends Component {
    componentWillMount() {
        this.props.dispatch(clearFileFolderData());
    }

    render() {
        return (
            <section id="content" className="content">
                <SearchPdf/>
                <FolderFile/>
                <ReactNotification ref={this.notificationDOMRef} />
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




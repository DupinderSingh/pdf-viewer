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
            <section className="content">
                <SearchPdf/>
                <FolderFile/>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {state}
};
export default withRouter(connect(mapStateToProps)(UploadTemplate))




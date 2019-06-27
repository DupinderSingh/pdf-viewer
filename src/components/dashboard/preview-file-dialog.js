/*eslint-disable*/
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Button from "../app/button";

class PreviewFileDialogBox extends Component {
    closeDialog() {
        document.getElementById("previewFile").style.display = "none";
        document.getElementById("previewFile").classList.remove("in")
    }

downloadImage(e, img) {
  e.preventDefault();
    setTimeout(() => {
      const response = {
        file: img.toString(),
      };
      window.location.href = response.file;
    }, 100);
}
    render() {
        return (
            <form>
                <div className="modal fade" id="previewFile" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">{this.props.heading}</h5>
                                <button type="button" className="close" onClick={this.closeDialog.bind(this)} data-dismiss="filePreviewModal"
                                        aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body display-file-outer">
                                <img className="file-image-inner" src={this.props.image} alt="file"
                                     onError={() => (this.src = require("../../images/corrupt-file.png"))}/>
                            </div>
                            <div className="modal-footer">
                                <a id="download_image">
                                    <Button type="button" className="btn btn-primary"
                                    onClick={(e)=> this.downloadImage(e, this.props.image)}
                                            text={"Download"}/>
                                </a>
                                <button type="button" style={{marginLeft: "20px"}}
                                        className="btn btn-secondary"
                                        onClick={this.closeDialog.bind(this)}
                                        data-dismiss="filePreviewModal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => {
    return {state}
}
export default withRouter(connect(mapStateToProps)(PreviewFileDialogBox))

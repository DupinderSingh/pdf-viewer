import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Viewer from 'react-viewer';
import 'intersection-observer'
import 'react-viewer/dist/index.css';
import 'react-image-lightbox/style.css';
import {displayImage, getPdfFolderStructure, updateFile} from "../../actions/dashboard";
import Error from "../app/error";
import PreviewFileDialogBox from "../dashboard/preview-file-dialog";
// import Loader from "../app/spinner/loader";
// import coverImage from '../../images/background.jpg';
import {removeBlurEffect} from "../../actions/app";
import {getUserSessionId} from "../../services/user";

class FolderFile extends Component {
    componentDidMount() {
        this.props.dispatch(getPdfFolderStructure(false, this.props.commonPath, false, ""));

    }

    refreshDocuments() {
        this.props.dispatch(getPdfFolderStructure(false, "document/" + getUserSessionId(), false, ""));
    }

    updateImageVisible(status, ext, value) {
        const required = [{src: value, alt: value, downloadUrl: value}];
        this.props.dispatch(updateFile(ext, value, required));
        this.props.dispatch(displayImage(status));
        // window.setTimeout(() => {
        //     document.getElementById("previewFile").style.display = "block";
        //     document.getElementById("previewFile").classList.add("in")
        // }, 400)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.searchTemplate !== nextProps.searchTemplate) {
            nextProps.dispatch(getPdfFolderStructure(false, "document/" + getUserSessionId(), true, nextProps.searchTemplate))
        }
        if (!nextProps.getPdfFolderStructurePageLoading) {
            if (((!nextProps.getPdfFolderStructurePageLoading) && (nextProps.getPdfFolderStructureStatus === 200) && (!nextProps.getPdfFolderStructureError))) {
                // if (!!document.getElementById('myContent')) {
                //     document.getElementById('myContent').scrollIntoView({
                //         behavior: 'smooth'
                //     });
                // }
                if (!!document.getElementsByClassName("my-content")[0]) {
                    document.getElementsByClassName("my-content")[0].scrollTo(0, 0);
                }
            }
        }
    }

    // requireImage(image) {
    //     switch (image.split(".")[image.split(".").length - 1]) {
    //         case "pdf":
    //             return this.src = require("../../images/pdf.png");
    //         case "jpg":
    //             return this.src = require("../../images/jpg.png");
    //         case "jpeg":
    //             return this.src = require("../../images/jpg.png");
    //         case "png":
    //             return this.src = require("../../images/png.png");
    //         default:
    //             return this.src = require("../../images/corrupt-file.png");
    //     }
    // }

    getStructure(type, back, path) {
        if (type === "folder") {
            this.props.dispatch(getPdfFolderStructure(back, path, false, ""));
        }
    }

    render() {
        return (
            <div className="row" style={{marginTop: "20px"}}>
                {
                    <div className="col-md-12 folder-file-outer">
                        <div className="col-md-9 files-folders-title">
                            <h2>Documents
                            </h2>
                        </div>
                        <div className="col-md-2 refresh-button-outer">
                            {
                                this.props.back &&
                                <span className="btn-group-lg">
                                                          <button type="button"
                                                                  onClick={() => this.getStructure("folder", true, this.props.commonPath)}
                                                                  className="btn btn-danger bmd-btn-fab">
                                                            <i className="fa fa-arrow-left"></i>
                                                          </button>
                                                        </span>
                            }
                            {

                                <span className="btn-group-lg">
                                                          <button type="button"
                                                                  style={{cursor: "pointer"}}
                                                                  onClick={this.refreshDocuments.bind(this)}
                                                                  className="btn btn-danger bmd-btn-fab">
                                                            <i className="fa fa-refresh"></i>
                                                          </button>
                                                        </span>
                            }
                        </div>
                    </div>
                }
                <div className="loading-outer">
                    {/*{*/}
                    {/*    this.props.getPdfFolderStructurePageLoading &&*/}
                    {/*    <div className="folder-file-loading">*/}
                    {/*        <Loader isPageLoading={true}/>*/}
                    {/*    </div>*/}
                    {/*}*/}
                    {
                        ((this.props.getPdfFolderStructureStatus === 200) && (!this.props.getPdfFolderStructureError)) &&
                        <div className="folder-file">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 folder-file-outer">
                                        <div className="col-md-12 my-content" id="myContent">
                                            <div className="col-md-12 files-folders-outer">
                                                {
                                                    this.props.directory.length > 0 &&
                                                    this.props.directory.map((structure, index) => (
                                                        <div key={index} className="files-folders">
                                                            <div className="folder-file-display-outer">
                                                                {
                                                                    structure.type === "folder" &&
                                                                    (
                                                                        !!structure.value.split(".")[(structure.value.split(".")).length - 1]
                                                                            ?
                                                                            (
                                                                                (
                                                                                    structure.value.split(".")[(structure.value.split(".")).length - 1] === "png" ||
                                                                                    structure.value.split(".")[(structure.value.split(".")).length - 1] === "jpg" ||
                                                                                    structure.value.split(".")[(structure.value.split(".")).length - 1] === "jpeg" ||
                                                                                    structure.value.split(".")[(structure.value.split(".")).length - 1] === "pdf"
                                                                                ) ?
                                                                                    (
                                                                                        <img
                                                                                            className={"folder-file-display-image blur-image"}
                                                                                            onLoad={removeBlurEffect.bind(this)}
                                                                                            onError={() => (this.src = require("../../images/corrupt-folder.png"))}
                                                                                            src={structure.value}
                                                                                            onClick={() => this.getStructure(structure.type, false, this.props.commonPath + "/" + structure.currentPath)}
                                                                                            alt={"folder pic"}
                                                                                        />
                                                                                    )
                                                                                    :
                                                                                    (
                                                                                        <img
                                                                                            className="folder-file-display-image blur-image"
                                                                                            onLoad={removeBlurEffect.bind(this)}
                                                                                            src={require("../../images/folder.png")}
                                                                                            onClick={() => this.getStructure(structure.type, false, this.props.commonPath + "/" + structure.currentPath)}

                                                                                            alt={"folder pic"}
                                                                                        />
                                                                                    )

                                                                            )
                                                                            :
                                                                            (
                                                                                <img
                                                                                    className="folder-file-display-image blur-image"
                                                                                    onLoad={removeBlurEffect.bind(this)}
                                                                                    src={require("../../images/folder.png")}
                                                                                    onClick={() => this.getStructure(structure.type, false, this.props.commonPath + "/" + structure.currentPath)}

                                                                                    alt={"folder pic"}
                                                                                />
                                                                            )
                                                                    )
                                                                }
                                                                {
                                                                    structure.type === "file" &&
                                                                    (
                                                                        structure.value.split(".")[structure.value.split(".").length - 1] === "pdf"
                                                                            ?
                                                                            (
                                                                                <a href={structure.value}
                                                                                   className="folder-file-display-image"
                                                                                   target="_blank"
                                                                                   rel="noopener noreferrer">
                                                                                    <img
                                                                                        className="folder-file-display-image blur-image"
                                                                                        onLoad={removeBlurEffect.bind(this)}
                                                                                        onError={() => (this.src = require("../../images/corrupt-file.png"))}
                                                                                        src={require("../../images/pdf.png")}
                                                                                        alt={"file pic"}
                                                                                    />
                                                                                </a>
                                                                            )
                                                                            :
                                                                            (
                                                                                <img
                                                                                    className="folder-file-display-image blur-image"
                                                                                    onLoad={removeBlurEffect.bind(this)}
                                                                                    onError={() => (this.src = require("../../images/corrupt-file.png"))}
                                                                                    src={structure.value}
                                                                                    onClick={() => this.updateImageVisible(true, structure.value.split(".")[structure.value.split(".").length - 1], structure.value)}
                                                                                    data-toggle="filePreviewModal"
                                                                                    data-target="#previewFile"
                                                                                    data-backdrop={false}
                                                                                    alt={"file pic"}
                                                                                />
                                                                            )
                                                                    )
                                                                }
                                                            </div>
                                                            <h5 className="card-title">{structure["type"] === "folder" ?
                                                                (!!structure.value.split(".")[(structure.value.split(".")).length - 1] && (
                                                                        structure.value.split(".")[(structure.value.split(".")).length - 1] === "png" ||
                                                                        structure.value.split(".")[(structure.value.split(".")).length - 1] === "jpg" ||
                                                                        structure.value.split(".")[(structure.value.split(".")).length - 1] === "jpeg" ||
                                                                        structure.value.split(".")[(structure.value.split(".")).length - 1] === "pdf")
                                                                ) ? structure["fileFolderName"] : structure["value"]
                                                                :
                                                                (!!(structure["value"].split(".")[structure["value"].split(".").length - 1]) && !!(structure["value"].split(".")[structure["value"].split(".").length - 2]) ? ((structure["value"].split(".")[structure["value"].split(".").length - 2]).includes("/") ? (structure["value"].split(".")[structure["value"].split(".").length - 2]).split("/")[(structure["value"].split(".")[structure["value"].split(".").length - 2]).split("/").length - 1] : (structure["value"].split(".")[structure["value"].split(".").length - 2])) + "." + structure["value"].split(".")[structure["value"].split(".").length - 1] : "")}</h5>
                                                        </div>
                                                    ))
                                                }
                                                {
                                                    this.props.directory.length === 0 &&

                                                    <div className="empty-display-image-outer" style={{cursor: "default", textAlign: "center", width: "100%"}}>
                                                            <img className="empty-display-image blur-image"
                                                                 onLoad={removeBlurEffect.bind(this)}
                                                                 src={require("../../images/empty.png")}
                                                                 alt={"no documents found"}
                                                                 style={{cursor: "default"}}
                                                            />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Viewer
                                visible={this.props.imageVisible}
                                onClose={() => this.updateImageVisible(false, this.props.file.type, this.props.file.value)}
                                downloadable={true}
                                images={this.props.file.required}
                            />
                            <PreviewFileDialogBox
                                heading={(!!(this.props.file.value.split(".")[this.props.file.value.split(".").length - 1]) && !!(this.props.file.value.split(".")[this.props.file.value.split(".").length - 2]) ? ((this.props.file.value.split(".")[this.props.file.value.split(".").length - 2]).includes("/") ? (this.props.file.value.split(".")[this.props.file.value.split(".").length - 2]).split("/")[(this.props.file.value.split(".")[this.props.file.value.split(".").length - 2]).split("/").length - 1] : (this.props.file.value.split(".")[this.props.file.value.split(".").length - 2])) + "." + this.props.file.value.split(".")[this.props.file.value.split(".").length - 1] : "")}
                                image={this.props.file.value}
                            />
                        </div>
                    }
                    {/*{*/}
                    {/*    ((!this.props.getPdfFolderStructurePageLoading) && (this.props.getPdfFolderStructureStatus === 200) && (!this.props.getPdfFolderStructureError) && (this.props.directory.length === 0)) &&*/}
                    {/*    <div className="folder-file">*/}
                    {/*        <div className="card-body">*/}
                    {/*            <div className="row">*/}
                    {/*                <div className="col-md-12 folder-file-outer">*/}
                    {/*                  <div className="no-document-found-outer">*/}
                    {/*                      <img className="no-document-found-inner"*/}
                    {/*                           src={require("../../images/nothing-found.png")}*/}
                    {/*                           alt={"no documents"}*/}
                    {/*                      />*/}
                    {/*                    </div>*/}
                    {/*               </div>*/}
                    {/*          </div>*/}
                    {/*      </div>*/}
                    {/*  </div>*/}
                    {/*}*/}
                    {
                        (!this.props.getPdfFolderStructurePageLoading && this.props.getPdfFolderStructureError) &&
                        <Error status={(this.props.getPdfFolderStructureStatus).toString()}
                               message={this.props.getPdfFolderStructureMessage}/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {searchTemplate, imageVisible, file, directory, back, commonPath, getPdfFolderStructurePageLoading, getPdfFolderStructureStatus, getPdfFolderStructureError, getPdfFolderStructureMessage} = state.dashboardReducer;
    return {
        getPdfFolderStructurePageLoading,
        getPdfFolderStructureStatus,
        getPdfFolderStructureError,
        getPdfFolderStructureMessage,
        file, directory, back, commonPath,
        imageVisible,
        searchTemplate
    };
};
export default withRouter(connect(mapStateToProps)(FolderFile))

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Button from "./button";

class DialogBox extends Component {
    closeDialog() {
        document.getElementById("dialogBox").style.display = "none";
        document.getElementById("dialogBox").classList.remove("in")
    }

    render() {
        return (
            <form onSubmit={this.props.react.bind(this)}>
                <div className="modal fade" id="dialogBox" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">{this.props.heading}</h5>
                            </div>
                            <div className="modal-body">
                                {this.props.primaryBody}
                            </div>
                            <div className="modal-footer">
                                <Button type="button" className="btn btn-secondary"
                                        onClick={this.closeDialog.bind(this)}
                                        text="Close"/>
                                <Button type="submit" className="btn btn-primary"
                                        text={this.props.status}/>
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
export default withRouter(connect(mapStateToProps)(DialogBox))
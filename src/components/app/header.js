/* eslint-disable*/
import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
// import {NotificationContainer} from "react-notifications";
import {notify} from "../../components/app/notification";
import DialogBox from "./dialogbox";
import {clearLogoutApiResponse, logout, logoutAccount} from '../../actions/account/index';
import ReactNotification from "react-notifications-component";

class Header extends Component{
    constructor(props) {
        super(props);
        this.notificationDOMRef = React.createRef();
    }

    signout(e) {
        e.preventDefault();
        this.props.dispatch(logoutAccount({user_id: getUserId()}));
    }
    openDialog() {
        window.setTimeout(()=> {
            document.getElementById("dialogBox").style.display = "block";
            document.getElementById("dialogBox").classList.add("in")
        }, 400)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.logoutAccountStatus !== "" && nextProps.logoutAccountError !== "") {
            if (nextProps.logoutAccountStatus === 200) {
                if (!nextProps.logoutAccountError) {
                    nextProps.dispatch(clearLogoutApiResponse());
                    notify(this.notificationDOMRef, "success", nextProps.logoutAccountMessage);
                    nextProps.dispatch(logout());
                }
                else {
                    nextProps.dispatch(clearLogoutApiResponse());
                    notify(this.notificationDOMRef, "danger", nextProps.logoutAccountMessage);
                }
            }
            else {
                nextProps.dispatch(clearLogoutApiResponse());
                notify(this.notificationDOMRef, "danger", nextProps.logoutAccountMessage);
            }
        }
    }

    render() {
        return(
            <header className="main-header">
                <Link to="/dashboard" className="logo">
                    <span className="logo-mini"><b>P</b>SCAN</span>
                    <span className="logo-lg"><img src={require("../../images/pdf-logo.png")} alt="" class="img-fluid logo-image"/></span>
                    <span className="logo-hide"><img src={require("../../images/pdf-logo.png")} alt="" class="img-fluid logo-pic"/></span>
                </Link>
                <nav className="navbar navbar-static-top">
                    <a href="javascript:void(0)" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li className="dropdown messages-menu">
                                <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-envelope-o"></i>
                                    <span className="label label-success">4</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">You have 4 messages</li>
                                    <li>
                                        <ul className="menu">
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <div className="pull-left">
                                                        <img src={require("../../images/user2-160x160.jpg")} className="img-circle"
                                                             alt="User Image"/>
                                                    </div>
                                                    <h4>
                                                        Support Team
                                                        <small><i className="fa fa-clock-o"></i> 5 mins</small>
                                                    </h4>
                                                    <p>Why not buy a new awesome theme?</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <div className="pull-left">
                                                        <img src={require("../../images/user3-128x128.jpg")} className="img-circle"
                                                             alt="User Image"/>
                                                    </div>
                                                    <h4>
                                                        AdminLTE Design Team
                                                        <small><i className="fa fa-clock-o"></i> 2 hours</small>
                                                    </h4>
                                                    <p>Why not buy a new awesome theme?</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <div className="pull-left">
                                                        <img src={require("../../images/user4-128x128.jpg")} className="img-circle"
                                                             alt="User Image"/>
                                                    </div>
                                                    <h4>
                                                        Developers
                                                        <small><i className="fa fa-clock-o"></i> Today</small>
                                                    </h4>
                                                    <p>Why not buy a new awesome theme?</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <div className="pull-left">
                                                        <img src={require("../../images/user3-128x128.jpg")} className="img-circle"
                                                             alt="User Image"/>
                                                    </div>
                                                    <h4>
                                                        Sales Department
                                                        <small><i className="fa fa-clock-o"></i> Yesterday</small>
                                                    </h4>
                                                    <p>Why not buy a new awesome theme?</p>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <div className="pull-left">
                                                        <img src={require("../../images/user4-128x128.jpg")} className="img-circle"
                                                             alt="User Image"/>
                                                    </div>
                                                    <h4>
                                                        Reviewers
                                                        <small><i className="fa fa-clock-o"></i> 2 days</small>
                                                    </h4>
                                                    <p>Why not buy a new awesome theme?</p>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="javascript:void(0)">See All Messages</a></li>
                                </ul>
                            </li>
                            <li className="dropdown notifications-menu">
                                <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-bell-o"></i>
                                    <span className="label label-warning">10</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">You have 10 notifications</li>
                                    <li>
                                        <ul className="menu">
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-users text-aqua"></i> 5 new members joined today
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-warning text-yellow"></i> Very long description
                                                    here that may not fit into the
                                                    page and may cause design problems
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-users text-red"></i> 5 new members joined
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-shopping-cart text-green"></i> 25 sales made
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <i className="fa fa-user text-red"></i> You changed your username
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="footer"><a href="javascript:void(0)">View all</a></li>
                                </ul>
                            </li>
                            <li className="dropdown tasks-menu">
                                <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-flag-o"></i>
                                    <span className="label label-danger">9</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="header">You have 9 tasks</li>
                                    <li>
                                        <ul className="menu">
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <h3>
                                                        Design some buttons
                                                        <small className="pull-right">20%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                        <div className="progress-bar progress-bar-aqua"
                                                             style={{width: "20%"}}
                                                             aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                            <span className="sr-only">20% Complete</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <h3>
                                                        Create a nice theme
                                                        <small className="pull-right">40%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                        <div className="progress-bar progress-bar-green"
                                                             style={{width: "40%"}} role="progressbar"
                                                             aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                            <span className="sr-only">40% Complete</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <h3>
                                                        Some task I need to do
                                                        <small className="pull-right">60%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                        <div className="progress-bar progress-bar-red"
                                                             style={{width: "60%"}} role="progressbar"
                                                             aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                            <span className="sr-only">60% Complete</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <h3>
                                                        Make beautiful transitions
                                                        <small className="pull-right">80%</small>
                                                    </h3>
                                                    <div className="progress xs">
                                                        <div className="progress-bar progress-bar-yellow"
                                                             style={{width: "80%"}} role="progressbar"
                                                             aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                            <span className="sr-only">80% Complete</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="footer">
                                        <a href="javascript:void(0)">View all tasks</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="dropdown user user-menu">
                                <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                                    {
                                        (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError && !!this.props.profile.photo) &&
                                        <img src={this.props.profile.photo} className="user-image"
                                        onError={() => this.src = require("../../images/avatar.png")}
                                        alt="User Image"/>
                                    }
                                    {
                                        (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError && this.props.profile.photo === "") &&
                                        <img src={require("../../images/avatar.png")} className="user-image"
                                        onError={() => this.src = require("../../images/avatar.png")}
                                        alt="User Image"/>
                                    }
                                    {
                                      (!this.props.getProfilePageLoading && this.props.getProfileError) &&
                                        <img src={require("../../images/avatar.png")} className="user-image"
                                        alt="User Image"/>
                                    }
                                        <span className="hidden-xs">
                                            {
                                                (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError) &&
                                                    this.props.profile.name
                                            }
                                        </span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="user-header">
                                        {
                                            (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError && !!this.props.profile.photo) &&
                                            <img src={this.props.profile.photo} className="img-circle"
                                                  onError={() => this.src = require("../../images/avatar.png")}
                                                 alt="User Image"/>
                                        }
                                        {
                                            (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError && this.props.profile.photo === "") &&
                                            <img src={require("../../images/avatar.png")} className="img-circle"
                                            onError={() => this.src = require("../../images/avatar.png")}
                                                 alt="User Image"/>
                                        }
                                        {
                                          (!this.props.getProfilePageLoading && this.props.getProfileError) &&
                                            <img src={require("../../images/avatar.png")} className="user-image"
                                            alt="User Image"/>
                                        }
                                    </li>
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            <Link href="javascript:void(0)" to="/profile" className="btn btn-default btn-flat">Profile</Link>
                                        </div>
                                        <button type="button" className="pull-right btn btn-primary"
                                                data-toggle="modal"
                                                onClick={this.openDialog.bind(this)}
                                                data-target="#dialogBox"
                                                data-backdrop={false}>
                                            Signout
                                        </button>
                                        {/*<div className="pull-right">*/}
                                        {/*    <a href="javascript:void(0)"*/}
                                        {/*       data-toggle="modal"*/}
                                        {/*       data-target="#dialogBox"*/}
                                        {/*       className="btn btn-default btn-flat">Sign out</a>*/}
                                        {/*</div>*/}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
                <DialogBox
                    heading="Sign Out"
                    primaryBody="Are you sure you want to Sign Out current session ?"
                    react={this.signout}
                    status="Signout"/>
                <ReactNotification ref={this.notificationDOMRef} />
            </header>
        )
    }
}
const mapStateToProps = state => {
    const {logoutAccountPageLoading, logoutAccountStatus, logoutAccountError, logoutAccountMessage} = state.accountReducer;
    const {profile, getProfilePageLoading, getProfileStatus, getProfileError, getProfileMessage} = state.profileReducer;
    return {logoutAccountPageLoading, logoutAccountStatus, logoutAccountError, logoutAccountMessage,
        profile, getProfilePageLoading, getProfileStatus, getProfileError, getProfileMessage}
};

export default withRouter(connect(mapStateToProps)(Header))

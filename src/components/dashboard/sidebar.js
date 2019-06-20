/*eslint-disable*/
import React, {Component} from "react";
import {withRouter, Link} from 'react-router-dom';
import {connect} from "react-redux";
// import {NotificationContainer} from "react-notifications";
import {notify} from "../app/notification";
import DialogBox from "../app/dialogbox";
import {clearLogoutApiResponse, logout, logoutAccount} from '../../actions/account/index';
import ReactNotification from "react-notifications-component";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.notificationDOMRef = React.createRef();
    }
  signout(e) {
      e.preventDefault();
      this.props.dispatch(logoutAccount({user_id: localStorage.getItem("id")}));
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
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <div className="user-panel" onClick={() => this.props.history.push("/profile")}>
                    {/* <div ClassName="logo-main" style={{textAlign: "center", padding: "5px"}}><img src={require("../../images/pdf-logo.png")} alt="" class="img-fluid logo-image"/></div> */}
                        <div className="pull-left image">
                            {
                                (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError && !!this.props.profile.photo) &&
                                <img onError={() => this.src = require("../../images/avatar.png")} src={this.props.profile.photo} className="img-circle"
                                     alt="User"/>
                            }
                            {
                                (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError && this.props.profile.photo === "") &&
                                <img style={{cursor: "pointer"}} src={require("../../images/avatar.png")} className="img-circle"
                                     alt="User"/>
                            }
                            {
                                (!this.props.getProfilePageLoading && this.props.getProfileError) &&
                                <img src={require("../../images/avatar.png")} className="img-circle"
                                     alt="User"/>
                            }
                        </div>
                        <div className="pull-left info">
                            <p>
                                {
                                    (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError) &&
                                    this.props.profile.name
                                }
                            </p>
                            <a href="#">{
                                (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError) &&
                                this.props.profile.email
                            }</a>
                        </div>
                    </div>

                    <ul className="sidebar-menu" data-widget="tree">

                        <li>
                            <Link to="/dashboard">
                                <i className="fa fa-home"/>
                                <span>Home</span>

                            </Link>
                        </li>
                        <li>
                            <Link to="/profile">
                                <i className="fa fa-user"/> <span>Profile</span>

                            </Link>
                        </li>

                    </ul>
                </section>
                <div className="logout-outer">
                  <i data-toggle="modal"
                  onClick={this.openDialog.bind(this)}
                  data-target="#dialogBox"
                  data-backdrop={false}
                  className="fa fa-sign-out logout-inner"></i>
                </div>
                <DialogBox
                    heading="Sign Out"
                    primaryBody="Are you sure you want to Sign Out current session ?"
                    react={this.signout}
                    status="Signout"/>
                <ReactNotification ref={this.notificationDOMRef} />
            </aside>
        )
    }
}
const mapStateToProps = state => {
  const {logoutAccountPageLoading, logoutAccountStatus, logoutAccountError, logoutAccountMessage} = state.accountReducer;
    const {profile, getProfilePageLoading, getProfileStatus, getProfileError, getProfileMessage} = state.profileReducer;
    return {logoutAccountPageLoading, logoutAccountStatus, logoutAccountError, logoutAccountMessage,
      profile, getProfilePageLoading, getProfileStatus, getProfileError, getProfileMessage}
};

export default withRouter(connect(mapStateToProps)(Sidebar))

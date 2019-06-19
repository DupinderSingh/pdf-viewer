import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from '../../../../components';
import styles from './styles';
import Input from "../../../../components/app/input";
import {
  changeProfileState,
  getProfile,
  updateProfileInfo
} from "../../../../actions/dashboard/profile";
import {checkValidation} from "../../../../actions/app";
import {notify} from "../../../../components/app/notification";
import ReactNotification from "react-notifications-component";

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.updateProfileInfoStatus !== "" && nextProps.updateProfileInfoError !== "") {
      if (nextProps.updateProfileInfoStatus === 200) {
        if (!nextProps.updateProfileInfoError) {
          nextProps.dispatch(changeProfileState({
            "user_id": "",
            "name": "",
            "mobile_data": "",
            "photo": nextProps.profile.photo,
            "email": ""
          }));
          nextProps.dispatch(getProfile());
          notify('success', nextProps.updateProfileInfoMessage);
        } else {
          nextProps.dispatch(changeProfileState(nextProps.profile));
          notify('danger', nextProps.updateProfileInfoMessage);
        }
      } else {
        nextProps.dispatch(changeProfileState(nextProps.profile));
        notify('danger', nextProps.updateProfileInfoMessage);
      }
    }


    if (nextProps.updateProfilePhotoStatus !== "" && nextProps.updateProfilePhotoError !== "") {
      if (nextProps.updateProfilePhotoStatus === 200) {
        if (!nextProps.updateProfilePhotoError) {
          nextProps.dispatch(changeProfileState({
            "user_id": nextProps.profile.user_id,
            "name": nextProps.profile.name,
            "mobile_data": nextProps.profile.mobile_data,
            "photo": "",
            "email": nextProps.profile.email
          }));
          nextProps.dispatch(getProfile());
          notify('success', nextProps.updateProfilePhotoMessage);
        } else {
          nextProps.dispatch(changeProfileState(nextProps.profile));
          notify('danger', nextProps.updateProfilePhotoMessage);
        }
      } else {
        nextProps.dispatch(changeProfileState(nextProps.profile));
        notify('danger', nextProps.updateProfilePhotoMessage);
      }
    }
  }
  handleChange(e) {
    const target = e.target;
    checkValidation(e);
    if (target.value === "") {
      target.required = false;
    } else {
      target.required = true;
      checkValidation(e);
    }
    this.props.dispatch(changeProfileState(Object.assign(this.props.profile, {[target.name]: target.value})))
  }
  handleSubmit(e) {
    e.preventDefault();
      const allElements = document.querySelectorAll(".profile-info-form .form-group input");
      for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].value === "") {
          allElements[i].required = false
        } else {
          allElements[i].required = true
        }
      }
      if (e.target.checkValidity()) {
        this.props.dispatch(updateProfileInfo({
          id: localStorage.getItem("id"),
          name: this.props.profile.name,
          email: this.props.profile.email,
          phone_no: this.props.profile.mobile_data
        }));
        // hit the api  to send the data......
      } else {
        const invalidInputs = document.querySelectorAll(".profile-info-form .form-group input:invalid");
        for (let i = 0; i < invalidInputs.length; i++) {
          invalidInputs[i].parentElement.classList.add("has-error");
        }
      }
  }
  render() {
    const { classes, className, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
            <Portlet
                {...rest}
                className={rootClassName}
            >
              <PortletHeader>
                <PortletLabel
                    subtitle="The information can be edited"
                    title="Profile"
                />
              </PortletHeader>
              <PortletContent noPadding>
                <form
                    autoComplete="off"
                    className="profile-info-form" onSubmit={this.handleSubmit.bind(this)}
                    noValidate={true}
                >
                  <div className={classes.field}>

                    <div className="form-group">
                      <Input type="text"
                             name="user_id"
                             value={this.props.user_id}
                             required={false}
                             disabled={true}
                             className="form-control"/>
                    </div>

                    <div className="form-group">
                      <Input type="text"
                             id="name"
                             name="name"
                             value={this.props.name}
                             onChange={this.handleChange.bind(this)}
                             minLength={3}
                             maxLength={50}
                             pattern={"^[^-\\s]([a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                             required={false}
                             className="form-control"
                             placeholder="Name"/>
                      <p className="with-error">Please enter last name (Min 3
                        characters
                        required, no white space allowed).</p>
                    </div>


                    <div className="form-group">
                      <Input type="text"
                             name="mobile_data"
                             value={this.props.mobile_data}
                             onChange={this.handleChange.bind(this)}
                             pattern="[0-9]{10,10}"
                             required={false}
                             className="form-control"
                             placeholder="Phone Number"/>
                      <p className="with-error">Please enter valid Phone number.</p>
                    </div>


                    <div className="form-group">
                      <Input type="email"
                             name="email"
                             value={this.props.email}
                             onChange={this.handleChange.bind(this)}
                             required={false}
                             className="form-control"
                             placeholder="Email Address"/>
                      <p className="with-error">Please enter valid Email Address.</p>
                    </div>
                  </div>

                <PortletFooter className={classes.portletFooter}>
                  <button type="submit"
                          className="btn btn-primary btn-block btn-flat">Update
                    Profile
                  </button>
                </PortletFooter>
                </form>
              </PortletContent>
              <ReactNotification ref={this.notificationDOMRef} />
            </Portlet>
    );
  }
}

AccountDetails.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state) => {
  const {
    profile, getProfilePageLoading, getProfileStatus, getProfileError, getProfileMessage,
    updateProfileInfoPageLoading,
    updateProfileInfoStatus,
    updateProfileInfoError,
    updateProfileInfoMessage,
    updateProfilePhotoPageLoading,
    updateProfilePhotoStatus,
    updateProfilePhotoError,
    updateProfilePhotoMessage
  } = state.profileReducer;
  const {user_id, name, mobile_data, photo, email} = profile;
  return {
    profile,
    user_id,
    name,
    mobile_data,
    photo,
    email,
    getProfilePageLoading,
    getProfileStatus,
    getProfileError,
    getProfileMessage,
    updateProfileInfoPageLoading,
    updateProfileInfoStatus,
    updateProfileInfoError,
    updateProfileInfoMessage,
    updateProfilePhotoPageLoading,
    updateProfilePhotoStatus,
    updateProfilePhotoError,
    updateProfilePhotoMessage
  }
};
export default withRouter(connect(mapStateToProps)(withStyles(styles)(AccountDetails)))
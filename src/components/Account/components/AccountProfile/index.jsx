import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Avatar, Typography, Button, LinearProgress } from '@material-ui/core';

// Shared components
import { Portlet, PortletContent, PortletFooter } from '../../../../components';

// Component styles
import styles from './styles';
import {checkValidation} from "../../../../actions/app";
import {changeProfileState, updateProfilePic} from "../../../../actions/dashboard/profile";
import createNotification from "../../../app/notification";
import {connect} from "react-redux";

class AccountProfile extends Component {
  uploadPic(e, removePic) {
    e.preventDefault();
    const target = e.target;
    if (removePic) {
      this.props.dispatch(updateProfilePic({}, true));
    }
    else {
      checkValidation(e);
      const photo = document.getElementById("photo").files[0];
      const ext = target.value.match(/\.(.+)$/)[1];
      switch (ext) {
        case 'jpg':
          return this.props.dispatch(updateProfilePic(photo, false));
        case 'jpeg':
          return this.props.dispatch(updateProfilePic(photo, false));
        case 'png':
          return this.props.dispatch(updateProfilePic(photo, false));
        default:
          return createNotification('error', 'Only png, jpg, jpeg files supported.');
      }
      this.props.dispatch(changeProfileState(Object.assign(this.props.profile, {[target.name]: target.value})))
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
        <PortletContent>
          <div className={classes.details}>
            <div className={classes.info}>
              <Typography variant="h2">{this.props.profile.name}</Typography>
              <Typography
                className={classes.locationText}
                variant="body1"
              >
                Rm. Valcea, Romania
              </Typography>
              <Typography
                className={classes.dateText}
                variant="body1"
              >
                4:32PM (GMT-4)
              </Typography>
            </div>
            <Avatar
              className={classes.avatar}
              src={this.props.profile.photo}
            />
          </div>
          <div className={classes.progressWrapper}>
            <Typography variant="body1">Profile Completeness: 70%</Typography>
            <LinearProgress
              value={70}
              variant="determinate"
            />
          </div>
        </PortletContent>
        <PortletFooter>
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
          >
            <input type="file" id="photo" name="photo"
                   onChange={(e) => this.uploadPic(e, false)}/>
            Upload picture
          </Button>
          <Button variant="text" onClick={(e) => this.uploadPic(e, true)}>Remove picture</Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

AccountProfile.propTypes = {
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
export default withRouter(connect(mapStateToProps)(withStyles(styles)(AccountProfile)))

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Material helpers
// Material components
import {LinearProgress, Typography, withStyles} from '@material-ui/core';
// Shared components
import {Portlet, PortletContent, PortletFooter} from '../../../../components';
// Component styles
import styles from './styles';
import {checkValidation} from "../../../../actions/app";
import {changeProfileState, updateProfilePic} from "../../../../actions/dashboard/profile";
import createNotification from "../../../app/notification";
import {connect} from "react-redux";

class AccountProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: 0
        }
    }

    uploadPic(e, removePic) {
        e.preventDefault();
        const target = e.target;
        if (removePic) {
            this.props.dispatch(updateProfilePic({}, true));
        } else {
            checkValidation(e);
            const photo = document.getElementById("photo").files[0];
            const ext = e.currentTarget.value.match(/\.(.+)$/)[1];
            this.props.dispatch(changeProfileState(Object.assign(this.props.profile, {[target.name]: target.value})));
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
        }
    }

    componentDidMount() {
        if (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError && !this.props.edit) {
            this.setState({profile: 0});
            let profile = 0;
            if (!!this.props.profile.email) {
                profile = profile + 20;
            }
            if (!!this.props.profile.name) {
                profile = profile + 20;
            }
            if (!!this.props.profile.mobile_data) {
                profile = profile + 20;
            }
            if (!!this.props.profile.photo) {
                profile = profile + 20;
            }
            this.setState({profile});
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!nextProps.getProfilePageLoading && nextProps.getProfileStatus === 200 && !nextProps.getProfileError && !nextProps.edit) {
            this.setState({profile: 0});
            let profile = 0;
            if (!!nextProps.profile.email) {
                profile = profile + 20;
            }
            if (!!nextProps.profile.name) {
                profile = profile + 20;
            }
            if (!!nextProps.profile.mobile_data) {
                profile = profile + 20;
            }
            if (!!nextProps.profile.photo) {
                profile = profile + 20;
            }
            this.setState({profile});
        }
    }

    render() {
        const {classes, className, ...rest} = this.props;

        const rootClassName = classNames(classes.root, className);

        return (
            <Portlet
                {...rest}
                className={rootClassName}
            >
                <PortletContent>
                    <div className={classes.details}>
                        <div className={classes.info} style={{width: '50%', float: 'left'}}>
                            <Typography variant="h2">{this.props.profile.name}</Typography>
                            <Typography
                                className={classes.locationText}
                                variant="body1">{this.props.profile.email}
                            </Typography>
                            <Typography
                                className={classes.dateText}
                                variant="body1"
                            >
                            </Typography>
                        </div>
                        {/*<Avatar*/}
                        {/*    className={classes.avatar}*/}
                        {/*    src={this.props.profile.photo}*/}
                        {/*/>*/}

                        <div className="MuiAvatar-root AccountProfile-avatar-116 MuiAvatar-colorDefaul t">

                            <img
                                className="img-circle"
                                style={{
                                    cursor: "pointer",
                                    maxWidth: "110px",
                                    borderRadius: "100%",
                                    height: "100px",
                                    width: "100px"
                                }}
                                src={!!this.props.profile.photo ? this.props.profile.photo : require("../../../../images/avatar.png")}
                                onError={() => this.src = require("../../../../images/avatar.png")}
                                alt="User"/>

                        </div>
                        <div className={classes.progressWrapper}>
                            <Typography variant="body1">Profile Completeness: {this.state.profile}%</Typography>
                            <LinearProgress
                                value={this.state.profile}
                                variant="determinate"
                            />
                        </div>
                    </div>
                </PortletContent>
                <PortletFooter>
                    <button
                        style={{cursor: "pointer"}}
                        className="MuiButtonBase-root MuiButton-root AccountProfile-uploadButton-363 MuiButton-text MuiButton-textPrimary add-blue"
                        tabIndex="0" type="button"><span style={{cursor: "pointer"}} className="MuiButton-label"><span
                        className="MuiButton-label"><label style={{cursor: "pointer"}} htmlFor="photo"
                                                           className="blue-butn">Upload picture</label>
                        <input type="file" id="photo" name="photo"
                               style={{display: "none", cursor: "pointer"}}
                               onChange={(e) => this.uploadPic(e, false)}/>
                        </span>
                        </span>
                        <span
                            className="MuiTouchRipple-root"></span></button>

                    <button className="MuiButtonBase-root MuiButton-root MuiButton-text remove-red" tabIndex="0"
                            type="button" onClick={(e) => this.uploadPic(e, true)}>
                        <span className="MuiButton-label">Remove picture</span><span
                        className="MuiTouchRipple-root"></span></button>

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
        updateProfilePhotoMessage,
        edit
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
        updateProfilePhotoMessage,
        edit
    }
};
export default withRouter(connect(mapStateToProps)(withStyles(styles)(AccountProfile)))

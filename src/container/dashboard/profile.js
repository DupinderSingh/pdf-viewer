/*eslint-disable*/
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Error from "../../components/app/error";
import {
    changeEditState,
    changeTempProfileState,
    clearProfileApiResponse,
    getProfile,
    updateProfileInfo,
    updateProfilePic
} from "../../actions/dashboard/profile";
import Input from "../../components/app/input";
import {checkValidation} from "../../actions/app";
import createNotification from "../../components/app/notification";

class Profile extends Component {
    componentWillMount() {
        this.props.dispatch(clearProfileApiResponse());
        this.props.dispatch(getProfile())
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.updateProfileInfoStatus !== "" && nextProps.updateProfileInfoError !== "") {
            if (nextProps.updateProfileInfoStatus === 200) {
                if (!nextProps.updateProfileInfoError) {
                    nextProps.dispatch(changeTempProfileState({
                        "user_id": "",
                        "name": "",
                        "mobile_data": "",
                        "photo": nextProps.profile_temp.photo,
                        "email": ""
                    }))
                    nextProps.dispatch(getProfile());
                    createNotification('success', nextProps.updateProfileInfoMessage);
                } else {
                    nextProps.dispatch(changeTempProfileState(nextProps.profile_temp));
                    createNotification('error', nextProps.updateProfileInfoMessage);
                }
            } else {
                nextProps.dispatch(changeTempProfileState(nextProps.profile_temp));
                createNotification('error', nextProps.updateProfileInfoMessage);
            }
        }


        if (nextProps.updateProfilePhotoStatus !== "" && nextProps.updateProfilePhotoError !== "") {
            if (nextProps.updateProfilePhotoStatus === 200) {
                if (!nextProps.updateProfilePhotoError) {
                    nextProps.dispatch(changeTempProfileState({
                        "user_id": nextProps.profile_temp.user_id,
                        "name": nextProps.profile_temp.name,
                        "mobile_data": nextProps.profile_temp.mobile_data,
                        "photo": "",
                        "email": nextProps.profile_temp.email
                    }));
                    nextProps.dispatch(getProfile());
                    createNotification('success', nextProps.updateProfilePhotoMessage);
                    nextProps.dispatch(changeEditState(false))
                } else {
                    nextProps.dispatch(changeTempProfileState(nextProps.profile_temp));
                    createNotification('error', nextProps.updateProfilePhotoMessage);
                    nextProps.dispatch(changeEditState(true))
                }
            } else {
                nextProps.dispatch(changeTempProfileState(nextProps.profile_temp));
                createNotification('error', nextProps.updateProfilePhotoMessage);
                nextProps.dispatch(changeEditState(true))
            }
        }
    }

    handleChange(e) {
        const target = e.target;
        checkValidation(e);
        if (target.type !== "file") {
            if (target.value === "") {
                target.required = false;
            } else {
                target.required = true;
                checkValidation(e);
            }
        } else {
            const photo = document.getElementById("photo").files[0];
            const ext = target.value.match(/\.(.+)$/)[1];
            switch (ext) {
                case 'jpg':
                    return this.props.dispatch(updateProfilePic(photo));
                case 'jpeg':
                    return this.props.dispatch(updateProfilePic(photo));
                case 'png':
                    return this.props.dispatch(updateProfilePic(photo));
                default:
                    return createNotification('error', 'Only png, jpg, jpeg files supported.');

            }
        }
        this.props.dispatch(changeTempProfileState(Object.assign(this.props.profile_temp, {[target.name]: target.value})))
    }

    goBack() {
        this.props.dispatch(changeEditState(false));
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.edit) {
            const allElements = document.querySelectorAll(".profile-info-form .form-group input");
            for (let i = 0; i < allElements.length; i++) {
                if (allElements[i].value === "") {
                    allElements[i].required = false
                } else {
                    allElements[i].required = true
                }
            }
            if (e.target.checkValidity()) {
                this.props.dispatch(changeEditState(false));
                this.props.dispatch(updateProfileInfo({
                    id: localStorage.getItem("id"),
                    name: this.props.profile_temp.name,
                    email: this.props.profile_temp.email,
                    phone_no: this.props.profile_temp.mobile_data
                }));
                // hit the api  to send the data......
            } else {
                const invalidInputs = document.querySelectorAll(".profile-info-form .form-group input:invalid");
                for (let i = 0; i < invalidInputs.length; i++) {
                    invalidInputs[i].parentElement.classList.add("has-error");
                }
            }
        } else {
            this.props.dispatch(changeTempProfileState(Object.assign(this.props.profile_temp, this.props.profile)));
            this.props.dispatch(changeEditState(true))
        }
    }

    render() {
        return (
            <div>
                {
                    (!this.props.getProfilePageLoading && this.props.getProfileStatus === 200 && !this.props.getProfileError) &&
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card card-primary card-outline">
                                <div className="card-body box-profile" style={{padding: "10px"}}>
                                    <div className="text-center">
                                        {
                                            !this.props.edit &&
                                            <img className="profile-user-img img-fluid img-circle"
                                                 src={!!this.props.profile.photo ? this.props.profile.photo : require("../../images/avatar.png")}
                                                 onError={() => this.src = require("../../images/avatar.png")}
                                                 alt="User profile"/>
                                        }
                                        {
                                            this.props.edit &&
                                            <div className="upload-photo-wrapper" style={{cursor: "pointer"}}>
                                                <span className="image-after">
                                                  <img className="profile-user-img img-fluid img-circle"
                                                       src={(!!this.props.profile.photo ? this.props.profile.photo : require("../../images/avatar.png"))}
                                                       onError={() => this.src = require("../../images/avatar.png")}
                                                       alt="User profile"/>
                                                       <i className="fa fa-camera"/>
                                                 </span>
                                                <input type="file" id="photo" name="photo"
                                                       onChange={this.handleChange.bind(this)}/>
                                            </div>
                                        }
                                    </div>
                                    {
                                        !this.props.edit &&
                                        <h3 className="profile-username text-center">{this.props.profile.name}</h3>
                                    }
                                    {
                                        this.props.edit &&
                                        <h3 className="profile-username text-center">{this.props.name}</h3>
                                    }
                                    <div className="col-md-offset-2 col-md-8">
                                      <form className="profile-info-form" onSubmit={this.handleSubmit.bind(this)}
                                            noValidate={true}>
                                          <ul className="list-group list-group-unbordered mb-3"
                                              style={{marginTop: "50px"}}>
                                              <li className="list-group-item">
                                                  <b style={{display: this.props.edit ? "none" : "inline"}}>User Id</b>
                                                  {
                                                      !this.props.edit &&
                                                      <a style={{marginLeft: "15px"}} href="javascript:void(0)"
                                                         className="float-right">{this.props.profile.user_id}</a>
                                                  }
                                                  {
                                                      this.props.edit &&
                                                      <div className="form-group">
                                                          <Input type="text"
                                                                 name="user_id"
                                                                 value={this.props.user_id}
                                                                 required={false}
                                                                 disabled={true}
                                                                 className="form-control"/>
                                                      </div>

                                                  }
                                              </li>
                                              <li className="list-group-item" style={{borderBottom: this.props.edit ? "" : "1px solid #ddd"}}>
                                                  <b style={{display: this.props.edit ? "none" : "inline"}}>Name</b>
                                                  {
                                                      !this.props.edit &&
                                                      <a style={{marginLeft: "15px"}} href="javascript:void(0)"
                                                         className="float-right">{this.props.profile.name}</a>
                                                  }
                                                  {
                                                      this.props.edit &&
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
                                                  }
                                              </li>
                                              <li className="list-group-item" style={{borderBottom: this.props.edit ? "none" : "1px solid #ddd"}}>
                                                  <b style={{display: this.props.edit ? "none" : "inline"}}>Phone Number</b>
                                                  {
                                                      !this.props.edit &&
                                                      <a style={{marginLeft: "15px"}} href="javascript:void(0)"
                                                         className="float-right">{this.props.profile.mobile_data}</a>
                                                  }
                                                  {
                                                      this.props.edit &&
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
                                                  }
                                              </li>
                                              <li className="list-group-item" style={{borderBottom: this.props.edit ? "none" : "1px solid #ddd"}}>
                                                  <b style={{display: this.props.edit ? "none" : "inline"}}>Email Address</b>
                                                  {
                                                      !this.props.edit &&
                                                      <a style={{marginLeft: "15px"}} href="javascript:void(0)"
                                                         className="float-right">{this.props.profile.email}</a>
                                                  }
                                                  {
                                                      this.props.edit &&
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
                                                  }
                                              </li>
                                          </ul>
                                          {
                                              this.props.edit &&
                                              <div className="row">
                                                  <div className="col-md-12">
                                                      <div className="col-md-8">
                                                          <button type="submit"
                                                                  className="btn btn-primary btn-block btn-flat">Update
                                                              Profile
                                                          </button>
                                                      </div>
                                                      <div className="col-md-4">
                                                          <button type="button"
                                                                  onClick={this.goBack.bind(this)}
                                                                  className="btn btn-primary btn-block btn-flat">Cancel
                                                          </button>
                                                      </div>
                                                  </div>
                                              </div>
                                          }
                                          {
                                              !this.props.edit &&
                                              <button type="button" onClick={this.handleSubmit.bind(this)}
                                                      className="btn btn-primary btn-block">Edit</button>
                                          }
                                      </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    (!this.props.getProfilePageLoading && this.props.getProfileError) &&
                    <Error status={(this.props.getProfileStatus).toString()}
                           message={this.props.getProfileMessage}/>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        profile, edit, profile_temp, getProfilePageLoading, getProfileStatus, getProfileError, getProfileMessage,
        updateProfileInfoPageLoading,
        updateProfileInfoStatus,
        updateProfileInfoError,
        updateProfileInfoMessage,
        updateProfilePhotoPageLoading,
        updateProfilePhotoStatus,
        updateProfilePhotoError,
        updateProfilePhotoMessage
    } = state.profileReducer;
    const {user_id, name, mobile_data, photo, email} = profile_temp;
    return {
        profile,
        edit,
        user_id,
        name,
        mobile_data,
        photo,
        email,
        profile_temp,
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
}
export default withRouter(connect(mapStateToProps)(Profile))

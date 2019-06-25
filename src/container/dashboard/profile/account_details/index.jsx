import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {Portlet, PortletContent, PortletFooter, PortletHeader, PortletLabel} from '../../../../components';
import styles from './styles';
import {checkValidation, countries} from "../../../../actions/app";
import Input from "../../../../components/app/input";
import {changeProfileState, getProfile, updateProfileInfo} from "../../../../actions/dashboard/profile";
import {notify} from "../../../../components/app/notification";
import ReactNotification from "react-notifications-component";
import ReactTelInput from "react-telephone-input";
import {getCountryCode} from "../../../../actions/account";

let phone = null;
const countriesData = countries();

class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.notificationDOMRef = React.createRef();
    }

    componentDidMount() {
        phone = document.querySelector('input[type=tel]');
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!nextProps.getProfilePageLoading) {
            phone = document.querySelector('input[type=tel]');
        }
        if (!nextProps.getProfilePageLoading && nextProps.getProfileStatus === 200 && !nextProps.getProfileError) {
            if (!!nextProps.profile.country && nextProps.mobile_data === "+") {
                let mobile_data = "";
                for (let i in countriesData) {
                    if (!!countriesData[i].alpha2Code) {
                        if (countriesData[i].alpha2Code.toLowerCase() === nextProps.profile.country) {
                            if (countriesData[i].callingCodes.length > 0) {
                                mobile_data = "+" + countriesData[i].callingCodes[0];
                            }
                        }
                    }
                }
                nextProps.dispatch(changeProfileState(Object.assign(nextProps.profile, {
                    mobile_data,
                    country: nextProps.profile.country
                })));
                phone = document.querySelector('input[type=tel]');
            }
            if (this.props.mobile_data !== nextProps.mobile_data) {
                let mobile_data = !!nextProps.mobile_data ? nextProps.mobile_data : "";
                    for (let i in countriesData) {
                        if (countriesData[i].callingCodes.length > 0) {
                            if (mobile_data.toString() === "+" + countriesData[i].callingCodes[0].toString()) {
                                nextProps.dispatch(changeProfileState(Object.assign(nextProps.profile, {
                                    country: countriesData[i].alpha2Code.toLowerCase()
                                })));
                            }
                        }

                }
                phone = document.querySelector('input[type=tel]');
            }
            if (nextProps.profile.country === "" && nextProps.mobile_data === "") {
                nextProps.dispatch(getCountryCode());
            }
        }
        if (this.props.country !== nextProps.country) {
            if (!!nextProps.country) {
                nextProps.dispatch(changeProfileState(Object.assign(nextProps.profile, {country: nextProps.country})));
                window.setTimeout(() => {
                    phone = document.querySelector('input[type=tel]');
                }, 500)
            }
        }
        if (nextProps.updateProfileInfoStatus !== "" && nextProps.updateProfileInfoError !== "") {
            if (nextProps.updateProfileInfoStatus === 200) {
                if (!nextProps.updateProfileInfoError) {
                    nextProps.dispatch(changeProfileState({
                        "user_id": "",
                        "name": "",
                        "mobile_data": "",
                        "country": "",
                        "photo": nextProps.profile.photo,
                        "email": ""
                    }));
                    nextProps.dispatch(getProfile());
                    notify(this.notificationDOMRef, 'success', nextProps.updateProfileInfoMessage);
                } else {
                    nextProps.dispatch(changeProfileState(nextProps.profile));
                    notify(this.notificationDOMRef, 'danger', nextProps.updateProfileInfoMessage);
                }
            } else {
                nextProps.dispatch(changeProfileState(nextProps.profile));
                notify(this.notificationDOMRef, 'danger', nextProps.updateProfileInfoMessage);
            }
        }


        if (nextProps.updateProfilePhotoStatus !== "" && nextProps.updateProfilePhotoError !== "") {
            if (nextProps.updateProfilePhotoStatus === 200) {
                if (!nextProps.updateProfilePhotoError) {
                    nextProps.dispatch(changeProfileState({
                        "user_id": nextProps.profile.user_id,
                        "name": nextProps.profile.name,
                        "mobile_data": nextProps.profile.mobile_data,
                        "country": nextProps.profile.country,
                        "photo": "",
                        "email": nextProps.profile.email
                    }));
                    nextProps.dispatch(getProfile());
                    notify(this.notificationDOMRef, 'success', nextProps.updateProfilePhotoMessage);
                } else {
                    nextProps.dispatch(changeProfileState(nextProps.profile));
                    notify(this.notificationDOMRef, 'danger', nextProps.updateProfilePhotoMessage);
                }
            } else {
                nextProps.dispatch(changeProfileState(nextProps.profile));
                notify(this.notificationDOMRef, 'danger', nextProps.updateProfilePhotoMessage);
            }
        }
    }

    checkOnlyCountryCode(mobile_data) {
        console.log(mobile_data.toString(), "mobile data....");
        let isCountryCode = false;
        for (let i in countriesData) {
            if (countriesData[i].callingCodes.length > 0) {
                if (mobile_data.toString() === "+" + countriesData[i].callingCodes[0].toString()) {
                    isCountryCode = true;
                    console.log("yes country code exist..");
                }
            }
        }
        phone = document.querySelector('input[type=tel]');
        console.log("isCountryCode status =>>", isCountryCode);
        return isCountryCode
    }

    handleInputChange(telNumber, selectedCountry, e) {
        console.log(selectedCountry, "selected country....");
        this.props.dispatch(changeProfileState(Object.assign(this.props.profile, {
            mobile_data: telNumber,
            country: selectedCountry.iso2
        })));
        if (this.checkOnlyCountryCode(telNumber)) {
            phone.required = false;
            phone.setCustomValidity('');
            phone.parentElement.parentElement.parentElement.classList.remove('has-error');
        } else {
            console.log("not country code");
            phone.required = true;
            if (telNumber.length !== selectedCountry.format.length) {
                console.log("invallid phone number");
                phone.setCustomValidity('Enter valid phone number.');
                phone.parentElement.parentElement.parentElement.classList.add('has-error');
            } else {
                console.log("valid phone number....");
                phone.setCustomValidity('');
                phone.parentElement.parentElement.parentElement.classList.remove('has-error')
            }
        }
        this.SetCaretAtEnd(phone)
    }

    handleInputBlur(telNumber, selectedCountry) {
        if (this.checkOnlyCountryCode(telNumber)) {
            phone.required = false;
            phone.setCustomValidity('');
            phone.parentElement.parentElement.parentElement.classList.remove('has-error');
        } else {
            phone.required = true;
            if (telNumber.length === selectedCountry.format.length) {
                phone.setCustomValidity('');
                phone.parentElement.parentElement.parentElement.classList.remove('has-error');
            } else {
                phone.setCustomValidity('Enter valid phone number.');
                phone.parentElement.parentElement.parentElement.classList.add('has-error');
            }
        }
    }

    SetCaretAtEnd(elem) {
        const elemLen = elem.value.length;
        if (document.selection) {
            elem.focus();
            const oSel = document.selection.createRange();
            oSel.moveStart('character', -elemLen);
            oSel.moveStart('character', elemLen);
            oSel.moveEnd('character', 0);
            oSel.select();
        } else if (elem.selectionStart || elem.selectionStart === 0) {
            elem.selectionStart = elemLen;
            elem.selectionEnd = elemLen;
            elem.focus();
        }
    }

    handleFocus(e) {
        this.SetCaretAtEnd(phone)
    }

    handleChange(e) {
        const target = e.target;
        if (target.value === "") {
            target.required = false;
            e.target.parentElement.classList.remove("has-error");
        } else {
            target.required = true;
            checkValidation(e);
        }
        this.props.dispatch(changeProfileState(Object.assign(this.props.profile, {[target.name]: target.value})))
    }

    handleSubmit(e) {
        e.preventDefault();
        const allElements = document.querySelectorAll(".profile-info-form .form-group input");
        let phoneNumber = 0;
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].value === "") {
                allElements[i].required = false;
            } else {
                allElements[i].required = true;
            }
        }
        if (this.checkOnlyCountryCode(this.props.mobile_data)) {
            phone.required = false;
            phoneNumber = 1;
        } else {
            phone.required = true;
            if (phone.value.length >= 5) {
                phoneNumber = 1;
            } else {
                phoneNumber = 0;
            }
        }
        if (e.target.checkValidity() && phoneNumber === 1) {
            this.props.dispatch(updateProfileInfo({
                id: localStorage.getItem("id"),
                name: this.props.profile.name,
                email: this.props.profile.email,
                phone_no: this.props.profile.mobile_data,
                country: this.props.profile.country
            }));
            // hit the api  to send the data......
        } else {
            const invalidInputs = document.querySelectorAll(".profile-info-form .form-group input:invalid");
            for (let i = 0; i < invalidInputs.length; i++) {
                invalidInputs[i].parentElement.classList.add("has-error");
            }
            if (phoneNumber === 0) {
                phone.setCustomValidity('invalid');
                document.getElementsByClassName("telephone-outer")[0].parentElement.classList.add("has-error");
            }
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

                            {
                                !!this.props.profile.country &&
                                <div className="form-group">
                                    <div className={"telephone-outer"}>
                                        <ReactTelInput
                                            defaultCountry={this.props.profile.country}
                                            flagsImagePath={require('../../../../images/flags.png')}
                                            preferredCountries={['in', 'us', 'gb']}
                                            name="mobile_data"
                                            className="react-tel-input form-ctrl"
                                            placeholder="Phone Number"
                                            required={false}
                                            value={this.props.mobile_data}
                                            onChange={this.handleInputChange.bind(this)}
                                            onFocus={this.handleFocus.bind(this)}
                                            onBlur={this.handleInputBlur.bind(this)}
                                        />
                                    </div>
                                    <p className="with-error">Please enter valid Phone number.</p>
                                </div>
                            }
                            {
                                !(!!this.props.profile.country) &&
                                <div className="form-group">
                                    <div className={"telephone-outer"}>
                                        <ReactTelInput
                                            defaultCountry="in"
                                            flagsImagePath={require('../../../../images/flags.png')}
                                            preferredCountries={['in', 'us', 'gb']}
                                            name="mobile_data"
                                            className="react-tel-input form-ctrl"
                                            placeholder="Phone Number"
                                            required={false}
                                            value={this.props.mobile_data}
                                            onChange={this.handleInputChange.bind(this)}
                                            onFocus={this.handleFocus.bind(this)}
                                            onBlur={this.handleInputBlur.bind(this)}
                                        />
                                    </div>
                                    <p className="with-error">Please enter valid Phone number.</p>
                                </div>
                            }

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
                <ReactNotification ref={this.notificationDOMRef}/>
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
    const {country} = state.accountReducer;
    const {user_id, name, mobile_data, photo, email} = profile;
    console.log(profile, "profile................");
    return {
        profile,
        user_id,
        country,
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
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ReactTelInput from 'react-telephone-input';
import 'react-telephone-input/lib/withStyles';
// import Input from "../../app/input";
import {changeLoginForm, getCountryCode, sendOtp, switchPhoneToVerifyOtp} from "../../../actions/account";
import {countries} from "../../../actions/app";
// import {checkValidation} from "../../../actions/app";

let phone = null;
const countriesData = countries();

class PhoneNumberForm extends Component {
    componentWillMount() {
        this.props.dispatch(changeLoginForm({otp: "", phoneNumber: "", country: ""}));
    }

    componentDidMount() {
        phone = document.querySelector('input[type=tel]');
        phone.focus();
    }

    handleInputChange(telNumber, selectedCountry, e) {
        this.props.dispatch(changeLoginForm({
            otp: "",
            phoneNumber: telNumber,
            country: selectedCountry.iso2
        }));
        if (telNumber.length !== selectedCountry.format.length) {
            phone.setCustomValidity('Enter valid phone number.');
            phone.parentElement.parentElement.parentElement.classList.add('has-error');
        } else {
            phone.setCustomValidity('');
            phone.parentElement.parentElement.parentElement.classList.remove('has-error')
        }
        phone.focus();
    }

    // handleInputBlur(telNumber, selectedCountry) {
    //     if (telNumber.length === selectedCountry.format.length) {
    //         phone.setCustomValidity('');
    //         phone.parentElement.parentElement.parentElement.classList.remove('has-error');
    //     } else {
    //         phone.setCustomValidity('Enter valid phone number.');
    //         phone.parentElement.parentElement.parentElement.classList.add('has-error');
    //     }
    //
    // }

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


    handleSubmit(e) {
        e.preventDefault();
        const self = this.props;
        if (e.target.checkValidity() && phone.value.length >= 5) {
            self.dispatch(sendOtp({
                "mobile_data": self.phoneNumber,
                "fb_id": "",
                "gmail_id": "",
                "type": "3"
            }));
        } else {
            if (phone.value.length < 5) {
                phone.setCustomValidity('invalid');
                document.getElementsByClassName("telephone-outer")[0].parentElement.classList.add("has-error");
            }
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

        if (!!nextProps.country && nextProps.phoneNumber === "+") {
            console.log(nextProps.country, nextProps.phoneNumber, "country , phone")
            let phoneNumber = "";
            for (let i in countriesData) {
                if (!!countriesData[i].alpha2Code) {
                    if (countriesData[i].alpha2Code.toLowerCase() === nextProps.country) {
                        if (countriesData[i].callingCodes.length > 0) {
                            console.log("+" + countriesData[i].callingCodes[0], "phoneeeeeeeeeeeeeeeeeeeeeeeeeee")
                            phoneNumber = "+" + countriesData[i].callingCodes[0];
                        }
                    }
                }
            }
            nextProps.dispatch(changeLoginForm({
                otp: "",
                phoneNumber,
                country: nextProps.country
            }));
            phone = document.querySelector('input[type=tel]');
        }

        if (nextProps.country === "" && nextProps.phoneNumber === "") {
            nextProps.dispatch(getCountryCode());
        }

        if (this.props.country !== nextProps.country) {
            if (!!nextProps.country) {
                nextProps.dispatch(changeLoginForm({
                    otp: "",
                    phoneNumber: nextProps.phoneNumber,
                    country: nextProps.country
                }));
                window.setTimeout(() => {
                    phone = document.querySelector('input[type=tel]');
                    phone.focus();
                }, 100)
            }
        }
        if (this.props.switchPhoneToOtp !== nextProps.switchPhoneToOtp) {
            if (!nextProps.switchPhoneToOtp) {
                phone.focus();
            }
        }
        if (nextProps.phoneNumberStatus !== "" && nextProps.phoneNumberError !== "") {
            if (nextProps.phoneNumberStatus === 200) {
                if (!nextProps.phoneNumberError) {
                    nextProps.dispatch(changeLoginForm({
                        otp: "",
                        phoneNumber: nextProps.phoneNumber,
                        country: nextProps.country
                    }));
                    nextProps.dispatch(switchPhoneToVerifyOtp(true))
                }
            }
        }
        if (nextProps.isAuthenticated) {
            nextProps.history.push("/dashboard")
        }
    }

    render() {
        return (
            <div>
                <p className="login-box-msg">Sign in with mobile number to start your session</p>
                <form onSubmit={this.handleSubmit.bind(this)} noValidate={true}>
                    {
                        !!this.props.country &&
                        <div className="form-group">
                            <div className={"telephone-outer"}>
                                <ReactTelInput
                                    defaultCountry={this.props.country}
                                    flagsImagePath={require('../../../images/flags.png')}
                                    preferredCountries={['in', 'us', 'gb']}
                                    name="phone_number"
                                    required={true}
                                    className="react-tel-input form-ctrl"
                                    placeholder="Phone Number"
                                    value={this.props.phoneNumber}
                                    onChange={this.handleInputChange.bind(this)}
                                    onFocus={this.handleFocus.bind(this)}
                                    // onBlur={this.handleInputBlur.bind(this)}
                                />
                            </div>
                            <p className="with-error">Please enter valid Phone number.</p>
                        </div>
                    }
                    {
                        !(!!this.props.country) &&
                        <div className="form-group">
                            <div className={"telephone-outer"}>
                                <ReactTelInput
                                    defaultCountry="in"
                                    flagsImagePath={require('../../../images/flags.png')}
                                    preferredCountries={['in', 'us', 'gb']}
                                    name="phone_number"
                                    className="react-tel-input form-ctrl"
                                    placeholder="Phone Number"
                                    value={this.props.phoneNumber}
                                    onChange={this.handleInputChange.bind(this)}
                                    onFocus={this.handleFocus.bind(this)}
                                    // onBlur={this.handleInputBlur.bind(this)}
                                />
                            </div>
                            <p className="with-error">Please enter valid Phone number.</p>
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <button type="submit"
                                    style={{marginTop: "5px"}}
                                    className="btn btn-primary btn-block btn-flat">Sign In
                            </button>
                            {
                                this.props.phoneNumberStatus !== "" && this.props.phoneNumberError !== "" && ((this.props.phoneNumberStatus === 200 && this.props.phoneNumberError) || (this.props.phoneNumberStatus !== 200)) &&
                                <p className="error">{this.props.phoneNumberMessage}</p>
                            }
                        </div>
                    </div>
                </form>
            </div>)
    }
}

const mapStateToProps = (state) => {
    const {
        phoneNumber, country, phoneNumberError, phoneNumberStatus, phoneNumberMessage, switchPhoneToOtp
    } = state.accountReducer;
    return {phoneNumber, country, phoneNumberError, phoneNumberStatus, phoneNumberMessage, switchPhoneToOtp}
};
export default withRouter(connect(mapStateToProps)(PhoneNumberForm))

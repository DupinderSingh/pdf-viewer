import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Input from "../../app/input";
import {
    changeLoginForm,
    sendOtp,
    switchPhoneToVerifyOtp
} from "../../../actions/account";
import {checkValidation} from "../../../actions/app";

class PhoneNumberForm extends Component {
    componentWillMount() {
        this.props.dispatch(changeLoginForm({otp: "", phoneNumber: ""}));
    }

    componentDidMount() {
        const phone_number = document.getElementsByName("phone_number")[0];
        if (!!phone_number) {
            phone_number.focus();
        }
    }

    handleChange(e) {
        const target = e.target;
        checkValidation(e);
        this.props.dispatch(changeLoginForm({otp: "", phoneNumber: target.value}))
    }

    handleSubmit(e) {
        e.preventDefault();
        const self = this.props;
        if (e.target.checkValidity()) {
            self.dispatch(sendOtp({
                "mobile_data": self.phoneNumber,
                "fb_id":"",
                "gmail_id":"",
                "type":"3"
            }));
        } else {
            const invalidElms = document.getElementsByName("phone_number")[0];
            invalidElms.focus();
            invalidElms.parentElement.classList.add("has-error")
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.phoneNumberStatus !== "" && nextProps.phoneNumberError !== "") {
            if (nextProps.phoneNumberStatus === 200) {
                if (!nextProps.phoneNumberError) {
                    nextProps.dispatch(changeLoginForm({otp: "", phoneNumber: nextProps.phoneNumber}));
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
                    <div className="form-group">
                        <Input type="text"
                               name="phone_number"
                               value={this.props.phoneNumber}
                               onChange={this.handleChange.bind(this)}
                               pattern="[0-9]{10,10}"
                               required={true}
                               className="form-control"
                               placeholder="Phone Number"/>
                        <p className="with-error">Please enter valid Phone number.</p>
                    </div>
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
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        phoneNumber, phoneNumberError, phoneNumberStatus, phoneNumberMessage
    } = state.accountReducer;
    return {phoneNumber, phoneNumberError, phoneNumberStatus, phoneNumberMessage}
};
export default withRouter(connect(mapStateToProps)(PhoneNumberForm))

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Input from "../../app/input";
import {changeLoginForm, loginAccount, switchPhoneToVerifyOtp} from "../../../actions/account";
import {checkValidation} from "../../../actions/app";

class VerifyOtpForm extends Component {
    componentWillMount() {
        this.props.dispatch(changeLoginForm({otp: "", phoneNumber: this.props.phoneNumber}));
    }

    componentDidMount() {
        const otp = document.getElementsByName("otp")[0];
        if (!!otp) {
            otp.focus();
        }
    }

    handleChange(e) {
        const target = e.target.value;
        checkValidation(e);
        this.props.dispatch(changeLoginForm({otp: Number(target), phoneNumber: this.props.phoneNumber}))
    }

    goBack() {
        this.props.dispatch(switchPhoneToVerifyOtp(false));
    }

    handleSubmit(e) {
        e.preventDefault();
        const self = this.props;
        if (e.target.checkValidity()) {
            self.dispatch(loginAccount({
                "mobile_data": self.phoneNumber,
                "otp": self.otp,
                "fb_id":"",
                "gmail_id":"",
                "type":"3"
            }));
        } else {
            const invalidElms = document.getElementsByName("otp")[0];
            invalidElms.focus();
            invalidElms.parentElement.classList.add("has-error")
        }
    }

    render() {
        return (
            <div>
                <p className="login-box-msg">OTP has been sent to {this.props.phoneNumber}. Please verify.</p>
                <form onSubmit={this.handleSubmit.bind(this)} noValidate={true}>
                    <div className="form-group">
                        <Input type="text"
                               name="otp"
                               value={this.props.otp}
                               onChange={this.handleChange.bind(this)}
                               pattern="[0-9]{4,4}"
                               required={true}
                               className="form-control"
                               placeholder="OTP"/>
                        <p className="with-error">Please enter valid OTP.</p>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="col-md-8">
                                <button type="submit"
                                        style={{marginTop: "5px"}}
                                        className="btn btn-primary btn-block btn-flat">Verify OTP
                                </button>
                            </div>
                            <div className="col-md-4">
                                <button type="button"
                                        style={{marginTop: "5px"}}
                                        onClick={this.goBack.bind(this)}
                                        className="btn btn-primary btn-block btn-flat">Back
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        auth,
        otp, phoneNumber
    } = state.accountReducer;
    const {isAuthenticated} = auth;
    return {
        isAuthenticated,
        otp, phoneNumber
    }
};
export default withRouter(connect(mapStateToProps)(VerifyOtpForm))

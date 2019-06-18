import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {NotificationContainer} from 'react-notifications';
import Pusher from 'pusher-js';
import {
    changeLoginForm,
    generateQrCodeLoading,
    getIpAddress,
    login,
    loginAccount,
    switchPhoneToVerifyOtp
} from '../../actions/account/index';
import createNotification from '../../components/app/notification';
import PhoneNumberForm from "../../components/account/login/phone-number-form";
import VerifyOtpForm from "../../components/account/login/verify-otp";
import Spinner from "../../components/app/spinner/spinner";
import {authApi} from '../../actions/app/index';
import Facebook from "../../components/account/login/facebook";
import Google from "../../components/account/login/google";
import AccountKit from 'react-facebook-account-kit';

const AUTH_API = authApi();

let QRCode = require('qrcode-react');
let pusher = null, channel = null;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ipv4: "",
            ipv6: ""
        }
    }

    componentWillMount() {
        document.title = "Login | Pdf Scanner";
        this.props.dispatch(switchPhoneToVerifyOtp(false));
        this.props.dispatch(getIpAddress({}))
    }


// initialize Account Kit with CSRF protection
    AccountKit_OnInteractive = function () {
        AccountKit.init(
            {
                appId: "{{FACEBOOK_APP_ID}}",
                state: "{{csrf}}",
                version: "{{ACCOUNT_KIT_API_VERSION}}",
                fbAppEventsEnabled: true,
                redirect: "{{REDIRECT_URL}}"
            }
        );
    };

// login callback
    loginCallback(response) {
        console.log(response, "response  login callback")
        if (response.status === "PARTIALLY_AUTHENTICATED") {
            var code = response.code;
            var csrf = response.state;
            // Send code to server to exchange for access token
        } else if (response.status === "NOT_AUTHENTICATED") {
            // handle authentication failure
        } else if (response.status === "BAD_PARAMS") {
            // handle bad parameters
        }
    }

// phone form submission handler
    smsLogin() {
        var countryCode = document.getElementById("country_code").value;
        var phoneNumber = document.getElementById("phone_number").value;
        AccountKit.login(
            'PHONE',
            {countryCode: countryCode, phoneNumber: phoneNumber}, // will use default values if not specified
            this.loginCallback
        );
    }


// email form submission handler
    emailLogin() {
        var emailAddress = document.getElementById("email").value;
        AccountKit.login(
            'EMAIL',
            {emailAddress: emailAddress},
            this.loginCallback
        );
    }


    responseFacebook = (response) => {
        if (!!response.userID) {
            this.props.dispatch(loginAccount({
                "name": response.name,
                "mobile_data": "",
                "email": response.email,
                "profile_url": response.picture.data.url,
                "gmail_id": "",
                "fb_id": response.userID,
                "unique_id": "",
                "type": "2"
            }))
        }
    };

    loginUserViaQrCode(endpoint, body, unique_id, user_id) {
        const self = this.props;
        let config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        };
        return fetch(endpoint, config)
            .then((response) => {
                if (response.status === 200) {
                    response.text().then(data => {
                        if (this.isValidJSON(data)) {
                            if (unique_id === JSON.parse(data).ip) {
                                self.dispatch(loginAccount({
                                    "name": "",
                                    "mobile_data": "",
                                    "email": "",
                                    "gmail_id": "",
                                    "fb_id": "",
                                    unique_id,
                                    user_id,
                                    "type": "0"
                                }));
                            }
                        }
                    })
                }
            })
    }

    isValidJSON(data) {
        try {
            JSON.parse(data);
        } catch (e) {
            return false
        }
        return true
    }

    responseGoogle = response => {
        if (!!response.googleId) {
            this.props.dispatch(loginAccount({
                "name": "",
                "mobile_data": "",
                "email": "",
                "gmail_id": response.googleId,
                "fb_id": "",
                "unique_id": "",
                "type": "1"
            }))
        }
    };

    componentDidMount() {
        const thi = this;
        const self = this.props;
        self.dispatch(changeLoginForm({otp: "", phoneNumber: ""}));
        const phone_number = document.getElementsByName("phone_number")[0];
        if (!!phone_number) {
            phone_number.focus();
        }
        let video = document.getElementById("myVideo");
        if (video !== null) {
            video.play();
        }
        self.dispatch(generateQrCodeLoading(true));
        pusher = new Pusher("936c591f8afac676dbf6", {
            cluster: "ap2",
            encrypted: true
        });
        channel = pusher.subscribe('websockets');
        channel.bind('pusher:subscription_succeeded', function () {
            self.dispatch(generateQrCodeLoading(false));
            channel.bind('qr_auth', (QrAuthData) => {
                    thi.loginUserViaQrCode(AUTH_API + "/ip-address", {}, QrAuthData.unique_id, QrAuthData.user_id);
                }
            );
        });
        channel.bind('pusher:subscription_error', () => {
            self.dispatch(generateQrCodeLoading(false));
            channel.unbind("qr_auth");
        });
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.switchPhoneToOtp !== nextProps.switchPhoneToOtp) {
            if (nextProps.switchPhoneToOtp) {
                nextProps.dispatch(changeLoginForm({otp: "", phoneNumber: nextProps.phoneNumber}));
            } else {
                nextProps.dispatch(changeLoginForm({otp: "", phoneNumber: ""}));
            }
        }
        if (nextProps.loginAccountStatus !== "" && nextProps.loginAccountError !== "") {
            if (nextProps.loginAccountStatus === 200) {
                if (!nextProps.loginAccountError) {
                    nextProps.dispatch(changeLoginForm({otp: "", phoneNumber: ""}));
                    createNotification('success', nextProps.loginAccountMessage);
                    nextProps.dispatch(login());
                } else {
                    nextProps.dispatch(changeLoginForm({otp: nextProps.otp, phoneNumber: nextProps.phoneNumber}));
                    createNotification('error', nextProps.loginAccountMessage);
                }
            } else {
                nextProps.dispatch(changeLoginForm({otp: nextProps.otp, phoneNumber: nextProps.phoneNumber}));
                createNotification('error', nextProps.loginAccountMessage);
            }
        }
        if (nextProps.isAuthenticated) {
            nextProps.history.push("/dashboard")
        }
    }

    componentWillUnmount() {
        channel.unbind('qr_auth');
        pusher.unsubscribe('websockets');
        pusher.disconnect();
    }

    render() {
        return (
            <div>
                <div id="myPhoto">
                    <img src={require("../../images/background.jpg")} alt="registration-background"/>
                </div>
                {/*<video autoplay muted loop id="myVideo">*/}
                {/*    <source src={require("../../videos/pdf_video.mp4")} type="video/mp4"/>*/}
                {/*    Your browser does not support HTML5 video.*/}
                {/*</video>*/}
                <div className="hold-transition login-page">
                    <div className="login-box">
                        <div className="login-logo">
                            <img src={require("../../images/pdf-logo.png")} alt="logo"/>
                        </div>
                        <div className="login-box-body">
                            <div className="card">
                                {
                                    (this.props.generateQrCodePageLoading ||
                                        this.props.phoneNumberPageLoading ||
                                        this.props.ipAddressPageLoading ||
                                        this.props.loginAccountPageLoading) &&
                                    <Spinner isPageLoading={true}/>
                                }
                                <div className="social-auth-links text-center">
                                    <div>
                                        {
                                            (!this.props.generateQrCodePageLoading || !this.props.ipAddressPageLoading) &&
                                            (
                                                !!this.props.ipAddress &&
                                                <div className="qr-code-image">
                                                    <QRCode value={this.props.ipAddress}/>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="card-body login-card-body">
                                    {
                                        this.props.switchPhoneToOtp &&
                                        <VerifyOtpForm/>
                                    }
                                    {
                                        !this.props.switchPhoneToOtp &&
                                        <PhoneNumberForm/>
                                    }
                                    <div className="social-auth-links text-center mb-3">
                                        <Facebook responseFacebook={this.responseFacebook}/>
                                        <Google responseGoogle={this.responseGoogle}/>

                                        {/*<div className="facebook-account-kit">*/}
                                        {/*    <input value="+91" id="country_code"/>*/}
                                        {/*    <input placeholder="phone number" id="phone_number"/>*/}
                                        {/*    <button onClick={this.smsLogin.bind(this)}>Login via SMS</button>*/}
                                        {/*    <div>OR</div>*/}
                                        {/*    <input placeholder="email" id="email"/>*/}
                                        {/*    <button onClick={this.emailLogin.bind(this)}>Login via Email</button>*/}

                                        {/*</div>*/}

                                        <AccountKit
                                            appId={"2309957712579768"} // Update this!
                                            version="v1.0" // Version must be in form v{major}.{minor}
                                            onResponse={(resp) => console.log(resp)}
                                            csrf={"eefe54b1c97eb4b17b155859fae547e3"} // Required for security
                                            countryCode={"+60"} // eg. +60
                                            phoneNumber={"9786545432"} // eg. 12345678
                                            emailAddress={'developer.iapptechnologies@gmail.com'} // eg. me@site.com
                                        >
                                            {p => <button {...p}>Initialize Account Kit</button>}
                                        </AccountKit>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer/>
            </div>
        )
    }
}

const
    mapStateToProps = (state) => {
        const {
            auth,
            switchPhoneToOtp,
            generateQrCode, generateQrCodePageLoading, generateQrCodeMsg, generateQrCodeStatus, scanQrCodePageLoading, scanQrCodeMsg, scanQrCodeStatus,
            phoneNumber, phoneNumberError, phoneNumberPageLoading, phoneNumberStatus, phoneNumberMessage,
            loginAccountError, loginAccountPageLoading, loginAccountStatus, loginAccountMessage,
            ipAddressPageLoading, ipAddress, ipAddressStatus, ipAddressError
        } = state.accountReducer;
        const {isAuthenticated} = auth;
        return {
            isAuthenticated,
            switchPhoneToOtp,
            generateQrCode,
            generateQrCodePageLoading,
            generateQrCodeMsg,
            generateQrCodeStatus,
            scanQrCodePageLoading,
            scanQrCodeMsg,
            scanQrCodeStatus,
            phoneNumber, phoneNumberError, phoneNumberPageLoading, phoneNumberStatus, phoneNumberMessage,
            loginAccountError, loginAccountPageLoading, loginAccountStatus, loginAccountMessage,
            ipAddressPageLoading, ipAddress, ipAddressStatus, ipAddressError
        }
    };
export default withRouter(connect(mapStateToProps)(Login))

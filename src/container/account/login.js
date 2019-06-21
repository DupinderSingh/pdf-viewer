import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
// import {NotificationContainer} from 'react-notifications';
import ReactNotification from "react-notifications-component";
import Pusher from 'pusher-js';
import {
    changeLoginForm,
    generateQrCodeLoading,
    getIpAddress,
    login,
    loginAccount,
    switchPhoneToVerifyOtp
} from '../../actions/account/index';
import {notify} from '../../components/app/notification';
// import PhoneNumberForm from "../../components/account/login/phone-number-form";
// import VerifyOtpForm from "../../components/account/login/verify-otp";
import Spinner from "../../components/app/spinner/spinner";
import {authApi, removeBlurEffect} from '../../actions/app/index';
import Facebook from "../../components/account/login/facebook";
import Google from "../../components/account/login/google";
import AccountKit from 'react-facebook-account-kit';

const AUTH_API = authApi();

let QRCode = require('qrcode-react');
let pusher = null, channel = null;

class Login extends Component {
    constructor(props) {
        super(props);
        this.notificationDOMRef = React.createRef();
        this.state = {
            pusher_key: process.env.REACT_APP_WS_PUSHER_APP_KEY,
            fb_appId: process.env.REACT_APP_FACEBOOK_APP_ID,
            fb_ak_loginType: process.env.REACT_APP_FACEBOOK_AK_LOGIN_TYPE,
            fb_ak_version: process.env.REACT_APP_FACEBOOK_AK_VERSION,
            fb_ak_csrf: process.env.REACT_APP_FACEBOOK_AK_CSRF,
            fb_ak_countryCode: process.env.REACT_APP_FACEBOOK_AK_COUNTRY_CODE,
            fb_ak_phoneNumber: process.env.REACT_APP_FACEBOOK_AK_PHONE_NUMBER,
            fb_ak_emailAddress: process.env.REACT_APP_FACEBOOK_AK_EMAIL
        }
    }

    facebookKitResponse(resp) {
        if (resp.status === "PARTIALLY_AUTHENTICATED") {
            this.props.dispatch(loginAccount({
                "name": "",
                "mobile_data": "",
                "email": "",
                "profile_url": "",
                "gmail_id": "",
                "fb_id": "",
                "unique_id": "",
                "code": resp.code,
                "type": "2"
            }))
        }

    }

    componentWillMount() {
        document.title = "Login | Pdf Scanner";
        this.props.dispatch(switchPhoneToVerifyOtp(false));
        this.props.dispatch(getIpAddress({}))
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
        pusher = new Pusher(thi.state.pusher_key, {
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
                    notify(this.notificationDOMRef, 'success', nextProps.loginAccountMessage);
                    nextProps.dispatch(login());
                } else {
                    nextProps.dispatch(changeLoginForm({otp: nextProps.otp, phoneNumber: nextProps.phoneNumber}));
                    notify(this.notificationDOMRef, 'danger', nextProps.loginAccountMessage);
                }
            } else {
                nextProps.dispatch(changeLoginForm({otp: nextProps.otp, phoneNumber: nextProps.phoneNumber}));
                notify(this.notificationDOMRef, 'danger', nextProps.loginAccountMessage);
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
                    <img className="blur-image"
                         onLoad={removeBlurEffect.bind(this)}
                         src={require("../../images/background.jpg")}
                         alt="registration-background"/>
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
                                    {/*{*/}
                                    {/*    this.props.switchPhoneToOtp &&*/}
                                    {/*    <VerifyOtpForm/>*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*    !this.props.switchPhoneToOtp &&*/}
                                    {/*    <PhoneNumberForm/>*/}
                                    {/*}*/}
                                    <div className="social-auth-links text-center mb-3">
                                        <Facebook responseFacebook={this.responseFacebook}/>
                                        <Google responseGoogle={this.responseGoogle}/>
                                        <div className="login-number">
                                            <AccountKit
                                                appId={this.state.fb_appId}
                                                loginType={this.state.fb_ak_loginType}
                                                version={this.state.fb_ak_version}
                                                onResponse={(resp) => this.facebookKitResponse(resp)}
                                                csrf={this.state.fb_ak_csrf}
                                                countryCode={this.state.fb_ak_countryCode}
                                                phoneNumber={this.state.fb_ak_phoneNumber}
                                                emailAddress={this.state.fb_ak_emailAddress}
                                            >
                                                {p => <button {...p}><i className="fa fa-phone" aria-hidden="true"></i> Sign in using Phone Number</button>}
                                            </AccountKit>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ReactNotification ref={this.notificationDOMRef} />
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

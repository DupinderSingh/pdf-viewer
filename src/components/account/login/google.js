/*eslint-disable*/
import GoogleLogin from "react-google-login";
import React, {Component} from "react";

export default class Google extends Component {
  constructor(props) {
    super(props);
    this.state ={
      appId: process.env.REACT_APP_GOOGLE_APP_ID
    }
  }
    render() {
        return (
            <div className="google">
                <a href="javascript:void(0)" className="btn btn-block btn-danger"
                   style={{position: "relative", borderRadius: "0px"}}>
                    <i className="fa fa-google mr-2" style={{paddingRight: "5px"}}></i> Sign
                    in using Google
                    <GoogleLogin
                        clientId={this.state.appId}
                        buttonText="Login with Google"
                        onSuccess={this.props.responseGoogle.bind(this)}
                        onFailure={this.props.responseGoogle.bind(this)}
                        cookiePolicy={'single_host_origin'}
                    />
                </a>
            </div>
        )
    }
}

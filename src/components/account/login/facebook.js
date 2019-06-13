/*eslint-disable*/
import React, {Component} from "react";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

export default class Facebook extends Component {
  constructor(props) {
    super(props);
    this.state ={
      appId: process.env.REACT_APP_FACEBOOK_APP_ID
    }
  }
    render() {
        return (
            <div className="fb">
                <a href="javascript:void(0)" className="btn btn-block btn-primary"
                   style={{position: "relative", borderRadius: "0px"}}>
                    <i className="fa fa-facebook mr-2" style={{paddingRight: "5px"}}/> Sign in using Facebook
                    <FacebookLogin
                        appId={this.state.appId}
                        cssClass="facebook-btn"
                        icon="fa-facebook"
                        fields="name,email,picture"
                        scope="public_profile,email"
                        callback={this.props.responseFacebook.bind(this)}
                        onFailure={(e) => {alert(e)}}
                        render={renderProps => (
                            <button onClick={renderProps.onClick}>Login with
                                Facebook</button>
                        )}
                    />
                </a>
            </div>
        )
    }
}

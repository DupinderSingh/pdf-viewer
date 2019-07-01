import React, {Component} from 'react';
// import $ from 'jquery';
import {connect} from 'react-redux';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
// import {NotificationContainer} from 'react-notifications';
import Dashboard from './container/dashboard/index';
import {store} from '../src/index';
import Sidebar from "./components/dashboard/sidebar";
import {getProfile} from "./actions/dashboard/profile";
import MyAccount from './container/dashboard/profile/index';
// import {refreshId} from "./actions/app";
import ReactNotification from "react-notifications-component";
import Login from './container/account/login';
// import {getUserId} from "./services/user";

// const storage = require('node-sessionstorage');
// const Store = require('data-store');
// const storeRoom = new Store({ path: 'config.json' });
// let db = require('diskdb');

let isAuthanticated = false;
let refresh_interval = null;

function checkAuth() {
    const {auth} = store.getState().accountReducer;
    const {isAuthenticated} = auth;
    return isAuthenticated
}

export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        return checkAuth() ?
            <Component {...props}/>
            : <Redirect to='/login'/>
    }
    }/>
);

export const ProtectedRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => {
        return checkAuth() ?
            <Redirect to='/dashboard'/>
            : <Component {...props}/>
    }}/>
);

export function BodyWrapper(props) {
    return (
        <div>
            <div className="wrapper">
                {/* <Header/>*/}
                <Sidebar/>
                <div className="content-wrapper">
                    {/*<PageNavigationHeader/>*/}
                    <Switch>
                        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                        <PrivateRoute exact path="/profile" component={MyAccount}/>
                        <Redirect from="*" to='/dashboard'/>
                    </Switch>
                </div>
            </div>
        </div>
    )
}

class RouteComponent extends Component {
    constructor(props) {
        super(props);
        this.notificationDOMRef = React.createRef();
    }

    // componentWillMount() {
    //     // alert(sessionStorage.getItem("userId"));
    //     if (this.props.isAuthenticated) {
    //         storage.setItem("userId", sessionStorage.getItem("userId"));
    //         sessionStorage.clear();
    //     }
    // }

    componentDidMount() {
        // const storeRoom = new Store({ path: 'config.json' });
        // storeRoom.getState("obj")
        const props = this.props;
        isAuthanticated = props.isAuthenticated;
        refresh_interval = setInterval(function () {
            if (isAuthanticated) {
                // props.dispatch(refreshId())
            } else {
                clearInterval(refresh_interval);
            }
        }, 600000);

        if (
            this.props.isAuthenticated && this.props.location.pathname !== "/profile") {
            this.props.dispatch(getProfile())
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            isAuthanticated = nextProps.isAuthenticated;
            if (nextProps.isAuthenticated) {
                refresh_interval = setInterval(function () {
                    // nextProps.dispatch(refreshId())
                }, 600000);
                nextProps.dispatch(getProfile())
            } else {
                if (refresh_interval !== null) {
                    clearInterval(refresh_interval);
                }
            }
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <ProtectedRoute exact path="/login" component={Login}/>
                    <BodyWrapper props={this.props}/>
                </Switch>
                <ReactNotification ref={this.notificationDOMRef}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {auth} = state.accountReducer;
    const {isAuthenticated} = auth;
    return {isAuthenticated}
}

export default withRouter(connect(mapStateToProps)(RouteComponent));

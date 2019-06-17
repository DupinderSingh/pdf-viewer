import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {NotificationContainer} from 'react-notifications';
import Dashboard from './container/dashboard/index';
import Login from './container/account/login';
import {store} from '../src/index';
import Footer from "./components/app/footer";
import Sidebar from "./components/dashboard/sidebar";
import {getProfile} from "./actions/dashboard/profile";
import MyAccount from './container/dashboard/profile/index';
import {refreshId} from "./actions/app";

let isAuthanticated = false;

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
    componentDidMount() {
        const props = this.props;
        isAuthanticated = props.isAuthenticated;
        let refresh_interval = null;
        console.log(isAuthanticated, typeof(isAuthanticated), "authenticated");
        refresh_interval = setInterval(function () {
            if (isAuthanticated) {
                props.dispatch(refreshId())
            }
        }, 900000);


        if (
            this.props.isAuthenticated &&
            this.props.location.pathname !== "/profile") {
            this.props.dispatch(getProfile())
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            isAuthanticated = nextProps.isAuthenticated;
            if (nextProps.isAuthenticated) {
                nextProps.dispatch(getProfile())
            }
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <ProtectedRoute exact path="/login" component={Login}/>
                    <BodyWrapper props={this.props}/>
                    <Footer/>
                </Switch>
                <NotificationContainer/>
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

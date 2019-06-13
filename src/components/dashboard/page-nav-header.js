import React, {Component} from "react";
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class PageNavigationHeader extends Component {
    render() {
        return (
            <section className="content-header">
                <h1>
                    <small></small>
                </h1>
                <ol className="breadcrumb">
                    <li style={{cursor: "pointer"}}><Link to="/dashboard">
                        {
                            this.props.location.pathname !== "/dashboard" && <i className="fa fa-dashboard"></i>
                        }
                        Home
                    </Link>
                    </li>
                    {
                        this.props.location.pathname !== "/dashboard" &&
                        <li style={{cursor: "pointer"}}
                            className="active">{((this.props.location.pathname.slice(1)).split("-").map((s, i) => (s.charAt(0).toUpperCase() + s.slice(1))).join(" "))}</li>
                    }
                </ol>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {state}
}
export default withRouter(connect(mapStateToProps)(PageNavigationHeader))

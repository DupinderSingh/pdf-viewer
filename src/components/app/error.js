import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class Error extends Component {
    render() {
        return (
            <div>
                <section className="content">
                    <div className="error-page">
                        <h2 className={this.props.status.charAt(0) === "5" ? "headline text-danger" : "headline text-warning"}> {this.props.status}</h2>

                        <div className="error-content">
                            <h3><i className={this.props.status.charAt(0) === "5" ? "fa fa-warning text-danger" : "fa fa-warning text-warning"}/>
                                {
                                    // eslint-disable-next-line no-mixed-operators
                                    (this.props.status.charAt(0) === "2" && this.props.status !== 200 ||
                                        // eslint-disable-next-line no-mixed-operators
                                        this.props.status.charAt(0) === "4" && this.props.status !== 404 ||
                                        // eslint-disable-next-line no-mixed-operators
                                        this.props.status.charAt(0) === "5" && this.props.status !== 500
                                    ) &&
                                    <p>
                                        <p>{"Oops  !"}</p>
                                        <p>
                                            {this.props.message}
                                            {
                                                this.props.location.pathname !== "/dashboard" &&
                                                <span>Meanwhile, you may <Link
                                                    to='/dashboard'>return to dashboard</Link></span>
                                            }
                                        </p>
                                    </p>
                                }
                                {
                                    this.props.status === 200 &&
                                    <p>
                                        <p>Oops !</p>
                                        <p>{this.props.message}
                                            {
                                                this.props.location.pathname !== "/dashboard" &&
                                                <span>Meanwhile, you may <Link
                                                    to='/dashboard'>return to dashboard</Link></span>
                                            }
                                        </p>
                                    </p>
                                }
                                {
                                    this.props.status === 404 &&
                                    <p>
                                        <p>Oops ! Page not found.</p>
                                        <p>
                                            We could not find the page you were looking for.
                                            {this.props.message}
                                            {
                                                this.props.location.pathname !== "/dashboard" &&
                                                <span>Meanwhile, you may <Link
                                                    to='/dashboard'>return to dashboard</Link></span>
                                            }
                                        </p>
                                    </p>
                                }
                                {
                                    this.props.status === 500 &&
                                    <p>
                                        <p>Oops! Something went wrong.</p>
                                        <p>
                                            We will work on fixing that right away.
                                            {this.props.message}
                                            {
                                                this.props.location.pathname !== "/dashboard" &&
                                                <span>Meanwhile, you may <Link
                                                    to='/dashboard'>return to dashboard</Link></span>
                                            }
                                        </p>
                                    </p>
                                }
                            </h3>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {state}
};
export default withRouter(connect(mapStateToProps)(Error))
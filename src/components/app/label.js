import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class Label extends Component {
    render() {
        return (
            <label htmlFor={this.props.htmlFor}>
                {this.props.children}
            </label>
        )
    }
}
const mapStateToProps = (state) => {
    return {state}
};
export default withRouter(connect(mapStateToProps)(Label))
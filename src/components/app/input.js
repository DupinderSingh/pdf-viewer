import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class Input extends Component {
    render() {
        return (
            <input
                id={this.props.id}
                type={this.props.type}
                onKeyDown={this.props.onKeyDown}
                name={this.props.name}
                tabIndex={this.props.tabIndex}
                accept={this.props.accept}
                disabled={this.props.disabled}
                min={this.props.min}
                title={this.props.title}
                onFocus={this.props.onFocus}
                defaultChecked={this.props.defaultChecked}
                className={this.props.className}
                autoComplete={this.props.autoComplete}
                pattern={this.props.pattern}
                checked={this.props.checked}
                onPaste={this.props.onPaste}
                minLength={this.props.minLength}
                maxLength={this.props.maxLength}
                required={this.props.required}
                placeholder={this.props.placeholder}
                value={this.props.value}
                onChange={this.props.onChange} />
        )
    }
}
const mapStateToProps = (state) => {
    return {state}
}
export default withRouter(connect(mapStateToProps)(Input))
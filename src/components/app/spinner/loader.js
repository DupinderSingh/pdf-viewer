import React, {Component} from 'react';
import { PropagateLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class Loader extends Component{
    render() {
        return(
            <div className='sweet-loading'>
                <PropagateLoader
                    css=''
                    sizeUnit={"px"}
                    size={17}
                    color={'#d83a46'}
                    heightUnit='px'
                    widthUnit='%'
                    height={1}
                    width={200}
                    loading={this.props.isPageLoading}
                />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {state}
};
export default withRouter(connect(mapStateToProps)(Loader))

import React, {Component} from 'react';
import { BarLoader } from 'react-spinners';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class Spinner extends Component{
    render() {
        return(
            <div className='sweet-loading'>
                <BarLoader
                    css=''
                    sizeUnit={"px"}
                    size={150}
                    color={'#d83a46'}
                    heightUnit='px'
                    widthUnit='%'
                    height={4}
                    width={100}
                    loading={this.props.isPageLoading}
                />
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {state}
}
export default withRouter(connect(mapStateToProps)(Spinner))

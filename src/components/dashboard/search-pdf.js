import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Background from '../../images/design-anything.jpg';
import {changeSearchTemplate} from '../../actions/dashboard/index';

class SearchPdf extends Component {
    componentDidMount() {
        this.props.dispatch(changeSearchTemplate(""));
        const searchField = document.getElementById("searchTemplate");
        if (searchField) {
            searchField.value = "";
            searchField.focus();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.commonPath !== nextProps.commonPath) {
            if (nextProps.commonPath === "document/" + localStorage.getItem("id")) {
                this.props.dispatch(changeSearchTemplate(""));
                const searchField = document.getElementById("searchTemplate");
                if (searchField) {
                    searchField.value = "";
                    searchField.focus();
                }
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.dispatch(changeSearchTemplate(document.getElementsByName("searchTemplate")[0].value));
    }

    render() {
        return (
            <div className="_3GOW64YITQSJGJjLNoFAWu">
                <div className="_1uYJPDT9zOoX6nUZW7klgf D2ebGAeCO03Zy-aY82l0w">
                    <div id="__id0"
                         className="LXnXVjEnZWX4vDQby9ecI ftTNJrvvEXHzDgRqb8kWq gLu__xHZCD0zA3ivhT0hR _1gmvBpbUDwPbc2Raae-ZFY">
                        <div>
                            <div>
                                <div className="_1gXflWrwJ5lenGsOc1W5Rl"/>
                                <div className="YXpgCrxt3SsvR7HRLebVh">
                                    /* eslint-disable-next-line no-useless-concat */
                                     <img style={{
                                         backgroundRepeat: "no-repeat",
                                         backgroundSize: "cover",
                                         backgroundImage: `url(${Background})`
                                     }}  src={Background}/>
                                    <div className="_3Hk6e6gjOb3cHZtuw_1JAH">
                                        <div className="_12KKZ1OgLqN0-YpcMtlAFC">
                                            <h2 className="_6jKdQkXToO-SIa-A5FetA W9IR-ZsiAOretU6xTyjoD _1ezTxOx5-oGil-lqm-gCks _3l4uYr79jSRjggcw5QCp88 dFR9ZpYFSrlcob8ppV9jE _1fgQS83UQD74-sbLyIX6g2 _1kLjfztPsOUw9W-PSOI9Zu">
                                                <span style={{color: "rgb(255, 255, 255)"}}>Design Anything</span>
                                            </h2>
                                        </div>
                                        <div className="_15_3vWMot0qSs869-h056Y">
                                            <div className="_3v-3sD8FPymU4D1DkRMFbz">
                                                <div className="uINWb7BM656O0TBciFoQG">
                                                    <div className="_1TypThgz1O3AIAHQIXmrII" tabIndex="-1">
                                                        <div>
                                                            <div className="_1d9A6N3NuMINBs2zbIQjc5">
                                                                <div
                                                                    className="_1Hht6fb-HB9e7psqrpS7IE">
                                                                    <form onSubmit={this.handleSubmit.bind(this)}>
                                                                        <div className="_3PHOKEA0At_73udFRtcl4X">
                                                                            <input type="text"
                                                                                   id="searchTemplate"
                                                                                   name="searchTemplate"
                                                                                   className="form-control"
                                                                                   style={{
                                                                                       width: "100%",
                                                                                       zIndex: "9999"
                                                                                   }}
                                                                                   placeholder="Search Templates"/>
                                                                            <button type="submit"
                                                                                    className="btn btn-primary btn-flat">Search
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {searchTemplate, commonPath} = state.dashboardReducer;
    return {searchTemplate, commonPath}
}
export default withRouter(connect(mapStateToProps)(SearchPdf))

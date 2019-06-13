import React, {Component} from "react";

export default class Footer extends Component {
    render() {
        return (
            <footer className="main-footer" style={{margin: "auto"}}>
                <div className="pull-right hidden-xs">
                    <b>Version</b> 2.4.0
                </div>
                <strong>Copyright &copy; 2019 <a href="https://pdf-scanner.com">Pdf Scanner</a>.</strong> All rights
                reserved.
            </footer>
        )
    }
}
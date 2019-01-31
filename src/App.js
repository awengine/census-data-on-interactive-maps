import React, { Component } from "react";
import appCss from "./App.css";
import Map from './Map';
import Aux from './Auxiliary';

class App extends Component {

    render() {
        return (
            <Aux>
                <div className={appCss.Map}>
                    <Map></Map>
                </div>
            </Aux>
        );
    }
}
export default App;

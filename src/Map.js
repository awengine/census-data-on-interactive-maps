import React, { Component } from "react";
import mapCss from "./Map.css";
import axios from "axios";
import SignIn from "./Signin";
import authFile from "../auth.json";

export default class Map extends Component {
    state = {
        map: null,
        LGAs: [],
        markers: [],
        // Set default income
        optionsState: ""
    };

    // By default, the properties declared here (inside a class but before render()) can be accessed outside the class.
    // So we cannot declare here using const or let, which belong to this class/component scope only.
    initMap = () => {
        const sydney = {
            lat: -33.8688,
            lng: 151.2093
        };

        this.state.map = new window.google.maps.Map(this.refs.map, {
            center: sydney,
            zoom: 14,
            mapTypeId: "roadmap",
            scaleControl: true,
            // disable default point-of-interest info window
            clickableIcons: false
        });

        this.state.map.addListener("bounds_changed", () => {
            let bounds = this.state.map.getBounds();
            // console.log(bounds);
        });

        this.loadEEHandler();

        // this.clickMarkerHandler();

    };

    // Connect to the EE(earth engine) population count layer (stored in cloud storage)
    loadEEHandler = () => {
        let minZoom = 0;
        let maxZoom = 14;
        let tilePrefix = authFile.CloudStorageURL;
        let tileSuffix = "";
        let overlayMapType = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                if (zoom < minZoom || zoom > maxZoom) {
                    return null;
                }
                let numTiles = 1 << zoom;
                // Wrap tiles horizontally (but not vertically)
                let x = ((coord.x % numTiles) + numTiles) % numTiles;
                return [
                    tilePrefix,
                    zoom,
                    "/",
                    x,
                    "/",
                    coord.y,
                    tileSuffix
                ].join("");
            },
            tileSize: new google.maps.Size(256, 256)
        });
        this.state.map.overlayMapTypes.push(overlayMapType);
    };

    // Reach to the internet
    componentDidMount() {
        // Connect the initMap() function within this class to the global window context, so Google Maps can invoke it
        window.initMap = this.initMap;

        // Asynchronously load the Google Maps script, passing in the callback reference
        loadJS(
            `https://maps.googleapis.com/maps/api/js?key=${
                authFile.GoogleMapApiKey
            }&v=3.34&callback=initMap`
        );

        // Make get requests to get census data from firebase NodeJS
        axios
            .get("/getCensusData")
            .then(response => {
                // Filter areas in NSW and store in LGAs list
                for (let i = 0; i <= 562; i++) {
                    // The response.data is a list of 563 areas all over AU, so check 563 times
                    if (response.data[i]["State Name"] == "New South Wales") {
                        // add data into the existing LGAs list
                        this.setState(prevState => ({
                            LGAs: [...prevState.LGAs, response.data[i]]
                        }));
                    }
                }
            })
            .then(() => {
                // Create markers only after the LGAs is set.
                this.createMarkers();
            });
    }

    // To display markers based on user input
    filterMarkers = event => {
        // Set the state of optionState to let <select> display the selected value
        this.setState({
            optionsState: event.target.value
        });

        let markers = this.state.markers;
        // Loop each markers
        markers.map(m => {
            // If the income of an area is greater than selected value, display its marker.
            if (Number(m.income) >= event.target.value) {
                m.setVisible(true);
            } else {
                m.setVisible(false);
            }
        });
    };

    // Create markers based on LGA list. Set mouseover & mouseout to display area info
    createMarkers = () => {
        let infoBox = new google.maps.InfoWindow();
        let markers = this.state.markers;
        const LGAs = this.state.LGAs;
        LGAs.map(LGA => {
            // Define variables for displaying
            let area = LGA["Area"];
            let income = LGA["Median_tot_prsnl_inc_weekly"];
            // Set marker latLng
            let marker = new google.maps.Marker({
                map: this.state.map,
                position: {
                    lat: Number(LGA["Lat"]),
                    lng: Number(LGA["Lng"])
                },
                // Custom markers
                icon: "baseline_find_in_page_black_24dp.png",
                // Set custom field to filter later
                income: income
            });

            // Add all markers to marker list for later to filter markers
            markers.push(marker);

            // Create the content of infoBox
            let content = `
                <div><b>${area}</b></div>
                <div>Median Weekly Income: <b>AUD ${income}</b></div>`;

            // Add marker animations
            marker.addListener("mouseover", () => {
                infoBox.setContent(content);
                infoBox.open(this.state.map, marker);
            });
            marker.addListener("mouseout", () => {
                infoBox.close();
            });
        });
    };

    render() {
        return (
            <div className={mapCss.Map}>
                <div className={mapCss.Top}>
                    <SignIn />
                    <select
                        className={mapCss.selectBox}
                        value={this.state.optionsState}
                        onChange={this.filterMarkers}
                    >
                        <option value="400">Greater than $400</option>
                        <option value="600">Greater than $600</option>
                        <option value="800">Greater than $800</option>
                        <option value="1000">Greater than $1000</option>
                    </select>
                </div>
                <div ref="map" className={mapCss.MapContent} />

            </div>
        );
    }

    // Show infoBox when clicking a marker
    clickMarkerHandler = () => {
        let infoBox = new google.maps.InfoWindow();
        let geocoder = new google.maps.Geocoder();
        let content = '';

        // Whenever clicking a new place, 1. replace with a new marker, 2. display place info
        this.state.map.addListener('click', (event) => {
            this.state.marker.position = event.latLng;
            this.state.marker.setMap(this.state.map);

            // two parameters: argus for geocode() and a callback
            geocoder.geocode({'location': event.latLng}, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        // select and display the first matched result's region
                        // output of results[0].formatted_address is "41 Cowper Wharf Rd, Woolloomooloo NSW 2011, Australia"
                        this.setState({
                        });

                        infoBox.setContent(content);
                        infoBox.open(this.state.map, this.state.marker);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            });
        });
    };
}

const loadJS = src => {
    let script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.getElementsByTagName("head")[0].appendChild(script);
};

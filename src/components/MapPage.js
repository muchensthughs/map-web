import React from 'react';
import TopNavBar from "./TopNavBar"
import Map from "./Map"
import MapSideBar from "./MapSideBar"
import * as QueryString from "query-string"
import { Switch, Icon } from 'antd';
import handleResponse from '../api/APIUtils';

class MapPage extends React.Component {
    constructor(props) {
        super(props);
        const params = QueryString.parse(props.location.search);
        this.state = {
            location: [parseFloat(params.lng), parseFloat(params.lat)],
            data: [
                // {
                //     id: 1,
                //     lng: -122.335167,
                //     lat:  47.608013,
                //     imgURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpChfpdl2pEQxJWEH-Q_FsZyg3SLkV3DzS3-VE17mBgXZkFljX&s',
                //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc p, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus '
                // },
                // {
                //     id: 2,
                //     lng: -122.325167,
                //     lat:  47.608013,
                //     imgURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpChfpdl2pEQxJWEH-Q_FsZyg3SLkV3DzS3-VE17mBgXZkFljX&s",
                //     description: 'Lorem ipsum ',
                // },
                // {
                //     id: 3,
                //     lng: -122.345167,
                //     lat:  47.628013,
                //     imgURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpChfpdl2pEQxJWEH-Q_FsZyg3SLkV3DzS3-VE17mBgXZkFljX&s',
                //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus '
                // },
                // {
                //     id: 4,
                //     lng: -122.365167,
                //     lat:  47.618013,
                //     imgURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpChfpdl2pEQxJWEH-Q_FsZyg3SLkV3DzS3-VE17mBgXZkFljX&s',
                //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus '
                // },
                // {
                //     id: 5,
                //     lng: -122.345167,
                //     lat:  47.598013,
                //     imgURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpChfpdl2pEQxJWEH-Q_FsZyg3SLkV3DzS3-VE17mBgXZkFljX&s',
                //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus '
                // },
            ],
            pointsInPlan: [],
            updatePlan: false,
            selectedPoint: null,
            showRoute: false,
            routeObj: null,
        }
    }
    

    setRouteObj = (routeObj) => {
        this.setState({routeObj: routeObj});
    }

    addPointsToPlan = (point) => {
        if (this.state.pointsInPlan.length < 10) {
            this.setState(prevState => ({pointsInPlan: [...prevState.pointsInPlan, point],
            updatePlan: true}));
        } else {
            alert('Maximum number of stops 10 is reached. Please delete some before adding more.');
        }

    }

    deletePointsFromPlan = (pointId) => {
        this.setState(prevState => ({pointsInPlan: [...(prevState.pointsInPlan.filter(point => {return point.id != pointId}))],
            updatePlan: true}));
    }

    rearrangePointsInPlan = (initial_id, target_id) => {
        if (initial_id === target_id) {          
            console.log('no change');        
            return;
        }
        console.log(target_id);
        console.log('switch from ' + initial_id + ' to ' + target_id);
        // find the corresponding ids then insert
        let initial_pos = this.findPos(this.state.pointsInPlan, initial_id);
        let target_pos = this.findPos(this.state.pointsInPlan, target_id);
        if (initial_pos < target_pos) {
            const left = this.state.pointsInPlan.slice(0, initial_pos);
            const middle = this.state.pointsInPlan.slice(initial_pos + 1, target_pos + 1);
            const right = this.state.pointsInPlan.slice(target_pos + 1, this.state.pointsInPlan.length);
            //debugger;
            this.setState(prevState => ({pointsInPlan: [...left, ...middle, prevState.pointsInPlan[initial_pos], ...right]}));
        } else {
            const left = this.state.pointsInPlan.slice(0, target_pos);
            const middle = this.state.pointsInPlan.slice(target_pos, initial_pos);
            const right = this.state.pointsInPlan.slice(initial_pos + 1, this.state.pointsInPlan.length);
            this.setState(prevState => ({pointsInPlan: [...left, prevState.pointsInPlan[initial_pos], ...middle, ...right]}));
        }
        this.setState({updatePlan: true});
        //const left = initial_ind === 0 ? [] : this.state.pointsInPlan.slice(0, initial_ind);
        //const right = initial_ind === this.state.pointsInPlan.length - 1 ? [] : this.state.pointsInPlan.slice(initial_ind);

    }

    findPos = (array, id) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    handleRouteSwitch = () => {
        this.setState(prevState => ({showRoute: !prevState.showRoute,
        updatePlan: true}));
        
    }

    handleHoverSearchResult = (componentData) => (e) => {
        this.setState({selectedPoint: componentData});       
    }

    setUpdatePlanFalse = () => {
        this.setState({updatePlan: false});
    }

    componentDidMount() {
        fetch('http://localhost:8080/search/searchTerm')
        .then(handleResponse)
        .then(data => this.setState({data: data}))
        .catch (error => console.log(error));
    }

    render() {
        const {pointsInPlan, data, location, showRoute, selectedPoint, updatePlan, routeObj} = this.state;       
        return (
            <div className="map-page">
                <div className="nav-bar-other">
                    <TopNavBar />
                </div>
                <div className="map-page-main">
                    <Map data={data} pointsInPlan={pointsInPlan} location={location} showRoute={showRoute} selectedPoint={selectedPoint} updatePlan={updatePlan} setUpdatePlanFalse={this.setUpdatePlanFalse} setRouteObj={this.setRouteObj}/>
                    <MapSideBar data={data} addPointsToPlan={this.addPointsToPlan} pointsInPlan={pointsInPlan} handleHoverSearchResult={this.handleHoverSearchResult} deletePointsFromPlan={this.deletePointsFromPlan} rearrangePointsInPlan={this.rearrangePointsInPlan} showRoute={showRoute} routeObj={routeObj}/>
                    <div className="show-route-container">
                        <span id="route-button-notation">Route</span>
                        <Switch id="route-switch" checkedChildren="On" unCheckedChildren="Off" checked={showRoute} onChange={this.handleRouteSwitch}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default MapPage;
import React, {Component} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import RBPin from './rb-pin.js';
import RBPopup from './rb-popup.js';
import '../styles/rb-map.scss';

class RBMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: '100%',
        height: 400,
        latitude: props.latitude,
        longitude: props.longitude,
        zoom: props.zoom
      },
      popupInfo: null
    };
  }

  getAssetLocationData(asset) {
    // Just grabbing the first location, will have to revisit this
    // when we have a better sense of our unit of analysis
    const {assetName, value} = asset;
    const locationName = asset.location[0].locationName;
    const {latitude, longitude} = asset.location[0].coordinates[0];
    return {
      assetName,
      value,
      latitude,
      longitude,
      locationName
    };
  }

  _renderPins(props=this.props) {
    const {assets, stories} = props;
    const markers = [];
    if (assets.length > 0) {
      const assetMarkers = assets.map((asset, i) => {
        const markerData = this.getAssetLocationData(asset);
        const { longitude, latitude, assetName, value, locationName } = markerData;
        return (
          <Marker
            key={`a-${i}`}
            latitude={+latitude} longitude={+longitude}
            offsetTop={-20} offsetLeft={-10}
            onDragStart={this._onMarkerDragStart}
            onDrag={this._onMarkerDrag}
            onDragEnd={this._onMarkerDragEnd}
          >
          <RBPin size={20} 
            onHover={
              () => this.setState(
                  { 
                    popupInfo: {
                      latitude: +latitude,
                      longitude:+longitude,
                      text: `${locationName}: ${assetName}`,
                      value
                    }
                  }  
              )
            } 
          />
          </Marker>
        );
      })
      markers.push(assetMarkers);
    }
    if (stories.length > 0) {
      const storyMarkers = stories.map((story, i) => {
        const { long, lat } = story;
        return (
          <Marker
            key={`s-${i}`}
            latitude={+lat} longitude={+long}
            offsetTop={-20} offsetLeft={-10}
            onDragStart={this._onMarkerDragStart}
            onDrag={this._onMarkerDrag}
            onDragEnd={this._onMarkerDragEnd}
          >
            <RBPin size={20} onHover={
              () => this.setState(
                {
                  popupInfo: {
                    latitude: +lat,
                    longitude:+long,
                    text: 'story'
                  }
                }
              )
            } />
          </Marker>
        );
      })
      markers.push(storyMarkers);
    }
    return markers;
  }

  _renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        closeOnClick={true}
        onClose={() => this.setState({popupInfo: null})} >
        <RBPopup {...popupInfo} />
      </Popup>
    );
  }

  render() {
    const {assets} = this.props;
    return (
      <div className="rb-map">
        <ReactMapGL
          {...this.state.viewport}
          scrollZoom={false}
          onViewportChange={(viewport) => this.setState({viewport})}
        >
          { this._renderPins(this.props) }
          { this._renderPopup() }
        </ReactMapGL>
      </div>
    );
  }
}

RBMap.defaultProps = {
  assets: [],
  stories:[],
  latitude: 13.5605834,
  longitude: 19.927948,
  zoom: 1.56
};

export default RBMap;

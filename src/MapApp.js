import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import './index.css';
import './App.css';

export class MapContainer extends Component {
 
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    showingactiveMarker: false
  }

  onMarkerClick = (props, marker) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingactiveMarker: true,
      showingInfoWindow: true
    });
  }

  render() {
// make sure there is a map or say sorry :)
    if(this.props.google.maps === undefined) {
      return ( <h2>Sorry error getting google map try to reload the page</h2> );
    }else{      
      return (
        <Map google={this.props.google} 
        className={'map'}
        initialCenter={{
          lat: 53.540203, lng: -2.102056 
        }}
        zoom={12}
        onClick={this.onMapClicked} >
  
        {this.props.AppData.query !== '' ? // dispaly filtered list and Marker
        this.props.venue.map((current, index, array) => (
        
        <Marker 
          id={index}
          className={'marker'}
          key={index + 201203 + index} 
          onClick={this.props.clicked}
          name={current.venue.name}
          title={array[index].venue.location.address}
          position={{
            lat: current.venue.location.lat, lng: current.venue.location.lng
          }}// if clicked test index against listTargetIndex  
          animation={this.props.AppData.listActive ? (this.props.AppData.listTargetIndex === index ? '1' : '0') : '0'} /> 
          ))
          
          : // display start and all maerkers
          this.props.start.map((current, index, array) => (
        
        <Marker 
          id={index}
          className={'marker'}
          key={index + 241242 + index} 
          onClick={this.props.clicked}
          name={current.venue.name}
          title={array[index].venue.location.address}
          position={{
            lat: current.venue.location.lat, lng: current.venue.location.lng
          }}// if clicked test index against listTargetIndex
          animation={this.props.AppData.listActive ? (this.props.AppData.listTargetIndex === index ? '1' : '0') : '0'} />       
          )) }
          {this.props.AppData.mapError === true ? <span className="errorDisplay">
          <h2 onClick={this.closeList}>Sorry error getting map click me to try again</h2>
          </span> : '' }
      </Map>
      )
    }
    
  }
}

export default GoogleApiWrapper(
  () => ({
    apiKey: ("AIzaSyDcheCgHTyf9zr3vcCCSOo0wrq_W95sUcA")
  }
))(MapContainer)

MapContainer.propTypes = {
  Map: PropTypes.object,
  Marker: PropTypes.object,
  onMarkerClick: PropTypes.func
};
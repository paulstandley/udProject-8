import React, { Component } from 'react';
import DispalyClicked from './DispalyClicked';
import './index.css';
import './App.css';

class ListApp extends Component {
// when you click on map marker should bounce and stop the other one :)   
  render() {
   
    return ( 
      <div>
        <h2>OLDHAM</h2> 
        <div>
          <ol>
            {this.props.venue !== undefined ? // when text input is not an empty string 
            this.props.venue.map((current, index, array) => (
              <li key={index + 354352 + index} >
              {this.props.AppData.listActive !== true ? /* test for display. the h5 is not displayed but placed here to bind the text values to the object for use in displayed click */
              <span id={`${index}`} onClick={this.props.clicked}>
                <img className="icon" src="https://res.cloudinary.com/pieol2/image/upload/v1538509364/planet.png" alt="planet" width="16" height="16"></img>
                <h3><strong>{current.venue.name}</strong></h3>
                <h5>{array[index].venue.location.address}</h5>
              </span> : index === this.props.AppData.listTargetIndex ? // dispaly clicked 
              <DispalyClicked listInfo={this.props} />
               : ''}              
              </li>
            ))
            : // display all list with JSON DATAFILE or foursquare
            this.props.start.map((current, index, array) => (
              <li key={index + 348734 + index}>       
              {this.props.AppData.listActive !== true ? // test for display
              <span id={`${index}`} onClick={this.props.clicked}>
                <img className="icon" src="https://res.cloudinary.com/pieol2/image/upload/v1538509364/planet.png" alt="planet" width="16" height="16"></img>
                <h3><strong>{current.venue.name}</strong></h3>
                <h5>{array[index].venue.location.address}</h5>
              </span> : index === this.props.AppData.listTargetIndex ? // display clicked
              <DispalyClicked listInfo={this.props} />
               : ''}
              </li>
            )) }
          </ol>
        </div>
      </div>
     );
  }
}
 
export default ListApp;
import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'sort-by';
import escapeRegExp from 'escape-string-regexp';
import DataFile from './assets/DataFile.json';
import ListApp from './ListApp';
import MapApp from './MapApp';
import './App.css';
import './index.css';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      foursquare: {},
      DATAFILE: DataFile.response.groups[0].items.sort(sortBy('venue.name')),
      query: '',
      errorTest: false,
      mapError: false,
      pick: {},
      listActiveTargetMarker: {},
      listActiveTargetAddress: {},
      listActiveTargetName: {},
      listTargetIndex: null,
      listActive: false,
    };
    this.updateQueryHandeler = this.updateQueryHandeler.bind(this);
    this.clicked = this.clicked.bind(this);
    this.closeList = this.closeList.bind(this);
    // put this function on window
    window.gm_authFailure = this.gm_authFailure;
  }
 
  componentDidMount() {
    /* foursquare data for Oldham  */       
    fetch('https://api.foursquare.com/v2/venues/explore?near=Oldham&client_id=AZCVJUXLZ4L2HW1W5XXE5AQBHZVXFWFK3PASLVFJGL4BVRXH&client_secret=VP5GYXQT3E3IDSSOEV5BWCKIAUGLJ4D5RX3NU2B305NSDT0P&v=20180826')
    .then((response) => {
      return response.json();
    }).then((myJson) => {
        this.setState({foursquare: myJson.response.groups[0].items});
    }).catch(() => { this.setState({ errorTest: true }) })
  }
/* event handeler */  
  updateQueryHandeler = (query) => {
    this.setState({ query: query.trim()} );        
  }
/* close list reset state */
  closeList = (evt) => {
    this.setState({ 
      pick: {},
      listActiveTargetMarker: {},
      listActiveTargetAddress: {},
      listActiveTargetName: {},
      listTargetIndex: null,
      listActive: false,
      errorTest: false
    });
  }
/* check evt list or map */
  clicked = (evt) => { 
/* set evt to state map*/    
    if(evt.className === 'marker') {
    this.setState({
      listActiveTargetName: evt.name,
      listActiveTargetMarker: evt,
      listActiveTargetAddress: evt.title,
      listTargetIndex: Number(evt.id),
      listActive: true
    })/* get target index info for fetch */  
    if(this.state.listTargetIndex !== null) {
      let num0 = this.state.listTargetIndex;
      let picked0 = this.state.DATAFILE[num0].venue.id;        
      fetch(`https://api.foursquare.com/v2/venues/${picked0}/photos?client_id=AZCVJUXLZ4L2HW1W5XXE5AQBHZVXFWFK3PASLVFJGL4BVRXH&client_secret=VP5GYXQT3E3IDSSOEV5BWCKIAUGLJ4D5RX3NU2B305NSDT0P&v=20180826`).then((response) => {
        return response.json();
      }).then((pick) => {
        this.setState({pick})
      }).catch(() => {
        this.setState({ errorTest: true })
      });
    }
/* set evt to list */
    }else{
    if(evt !== undefined) {
      this.setState({ 
        listActiveTargetMarker: evt.currentTarget,
        listActiveTargetAddress: evt.currentTarget.childNodes[2].innerText,
        listActiveTargetName: evt.currentTarget.childNodes[1].innerText,
        listActive: true,
        listTargetIndex: Number(evt.currentTarget.id)
       })/* get target index info for fetch */
      let num1 = Number(evt.currentTarget.id);
      let picked1 = this.state.DATAFILE[num1].venue.id;
      fetch(`https://api.foursquare.com/v2/venues/${picked1}/photos?client_id=AZCVJUXLZ4L2HW1W5XXE5AQBHZVXFWFK3PASLVFJGL4BVRXH&client_secret=VP5GYXQT3E3IDSSOEV5BWCKIAUGLJ4D5RX3NU2B305NSDT0P&v=20180826`).then((response) => {
        return response.json();
      }).then((pick) => {
        this.setState({pick})
      }).catch(() => {
        this.setState({ errorTest: true });
      });
      } 
    }
  };
/* get input query then filter, return filtered or object */
  queryMethod() {
    let filtered;
    if (this.state.query) {      
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      filtered = this.state.foursquare.filter((value) => match.test(value.venue.name));
      filtered.sort(sortBy('venue.name'));
      DataFile.response.groups[0].items.sort(sortBy('venue.name'));
    }else{
      filtered = this.state.DataFile;
    }
    return filtered;
  }
  render() {
   let filtered = this.queryMethod();       
   return (
     <div className="App">
       <header>
         <h1>Neighborhood Map</h1>
       </header>    
       {filtered !== undefined ? // display filtered list and map markers
       <main id="mainPage" className="main-page">
         <section id="sectionList" className="section-list">
         {this.state.listActive === false ? 
            <input type="text" 
            aria-label="text"
            aria-required="true"
            id="sectionInput" 
            className="section-input" 
            placeholder="Filter foursquare list"
            value={this.state.query}
            onChange={(event) => this.updateQueryHandeler(event.target.value)}/> 
          : /* remove when list is active */ 
          <input type="text" 
            aria-label="text"
            aria-required="true"
            id="sectionInput" 
            className="noSection-input" 
            placeholder="Filter foursquare list"
            value={this.state.query}// check fetch response display sorryv
            onChange={(event) => this.updateQueryHandeler(event.target.value)}/> }
           <ListApp closeList={this.closeList} start={this.state.DATAFILE} venue={filtered} pick={this.state.pick} clicked={this.clicked} AppData={this.state}/>
           {this.state.errorTest === true ? <span className="errorDisplay">
          <h2 onClick={this.closeList}>Sorry error getting image click me to try again</h2>   
          </span> : '' }
         </section>
         <section id="sectionMap" className="section-map">
           <MapApp closeList={this.closeList} start={this.state.DATAFILE} venue={filtered} clicked={this.clicked} AppData={this.state} />
         </section>
        </main>
       :  // display start list and all markers
       <main id="mainPage" className="main-page">
         <section id="sectionList" className="section-list">
          {this.state.listActive === false ? 
            <input type="text" 
            aria-label="text"
            aria-required="true"
            id="sectionInput" 
            className="section-input" 
            placeholder="Filter foursquare list"
            value={this.state.query}
            onChange={(event) => this.updateQueryHandeler(event.target.value)}/> 
          : /* remove when list is active */ 
          <input type="text" 
            aria-label="text"
            aria-required="true"
            id="sectionInput" 
            className="noSection-input" 
            placeholder="Filter foursquare list"
            value={this.state.query}// check fetch response display sorry
            onChange={(event) => this.updateQueryHandeler(event.target.value)}/>}
          <ListApp closeList={this.closeList} start={this.state.DATAFILE} venue={filtered} pick={this.state.pick} clicked={this.clicked} AppData={this.state}/>
          {this.state.errorTest === true ? <span className="errorDisplay">
          <h2 onClick={this.closeList}>Sorry error getting image click me to try again</h2>
          </span> : '' }
          </section>
        <section id="sectionMap" className="section-map">
          <MapApp closeList={this.closeList} start={this.state.DATAFILE} venue={filtered} clicked={this.clicked} AppData={this.state} />
        </section>
      </main>    
      }       
     </div>
   );
  }
  /* this funtion is on window */
  gm_authFailure(){
    window.alert("Google Maps error may need an API key");
  }
}

export default App;

App.propTypes = {
  queryMethod: PropTypes.func,
  onMarkerClick: PropTypes.func,
  clicked: PropTypes.func,
  closeList: PropTypes.func
};
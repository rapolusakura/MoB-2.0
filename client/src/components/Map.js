import React from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';

const mapStyles = {
  width: '100%',
  height: '100%',
};

class MapContainer extends React.Component { 

  render() {
    return (
      <div>

      <Autocomplete
    style={{width: '90%'}}
    onPlaceSelected={(place) => {
      console.log(place);
    }}
    types={['(regions)']}
    componentRestrictions={{country: "pe"}}
      />

     <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        />




        </div>
      )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCmiCER2zbSfCRoMZrZCrNBw2omSdKO-a0'
})(MapContainer);



        
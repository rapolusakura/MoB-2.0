import React from 'react'; 

export default class CompanyOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }
  }

  switchCheck = () => {
      this.props.companySelected(this.props.company)
      if(this.props.company.address !== "SIN DIRECCION") {
        this.geocodeAddress(this.props.company.address); 
      }
      this.setState({
        isSelected : !this.state.isSelected
      })
  }

  geocodeAddress = (address) => {
    let place_id, lat, lng; 
    let urlAddress = encodeURIComponent(address); 
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&region=pe&key=AIzaSyCmiCER2zbSfCRoMZrZCrNBw2omSdKO-a0`)
    .then(res => res.json())
    .then(json => {
      place_id = json.results[0].place_id; 
      lat = json.results[0].geometry.location.lat;
      lng = json.results[0].geometry.location.lng; 
      console.log(lat , " ", lng);
      this.props.updateAddress(true, this.props.company.address, place_id, lat, lng); 
    })

    this.props.updateAddress(true, this.props.company.address, place_id, lat, lng); 
  }

  render() {  
    let RUC, address; 
    if (!this.props.company.RUC || this.props.company.RUC.length !== 11) {
       RUC = <h3></h3>      
    } else {
      RUC = <h3> RUC: {this.props.company.RUC} </h3>
    }
    if (this.props.company.address != "SIN DIRECCION") {
      address = <h3> Address: {this.props.company.address} </h3>
    } else {
      address = <h3></h3> 
    }
    return (
      <div>
        <input name="selectCompany" type="checkbox" checked={this.state.isSelected} onChange={this.switchCheck}/>
        <h2> Razon Commercial: {this.props.company.official_company_name} </h2> 
        <h2> Razon Social: {this.props.company.company_name} </h2> 
        {RUC}
        {address}
      </div> 
    )
  }
}
import React from 'react'; 
import CompanyOption from './CompanyOption'
import '../style.css'

class CompanySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      inputVal: '',
      companies: [],
      message: ''
    };
  }

  callAPI = () => {
    console.log(this.state.inputVal)
    if(this.state.inputVal !== '') {
    fetch("/searchForCompany", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        val: this.state.inputVal
      })
    })
    .then(res => res.json())
    .then(json => {
      if(json.success) {
        console.log(json.company)
        this.setState({
          companies: json.company
        })
      } else {
        this.setState ({
          message: 'Ninguna empresa existe con ese criterio de búsqueda. Pruebe con la otra opción o llame a Mail on Bike para registrar un nuevo cliente.'
        })
      }
    })
  } else {
    this.setState({
      message: 'Por favor, introduzca un RUC o Razón Commerical'
    })
  }
  }

  companySelected = (company) => {
    this.props.companySelected(company); 
  }

  updateAddress = (isOrigin, address, place_id, lat, lng) => {
    this.props.updateAddress(isOrigin, address, place_id, lat, lng); 
  }

    updateInputValue(evt) {
      this.setState({
        inputVal: evt.target.value
      });
    }

    render() {    
    return (
      <div>
        <input className = 'field' type="text" placeholder = "RUC o Razón Comercial" value={this.state.inputVal} onChange={evt => this.updateInputValue(evt)}></input> 
        <button type = "button" onClick={() => this.callAPI()}> Buscar empresa </button>
        <div>
        <ul>
        {this.state.companies.map( (company, index) => {
          return (
            <CompanyOption company={company} companySelected={this.companySelected} updateAddress={this.updateAddress}/>
            ) 
        })}
      </ul>
        </div>
        <div> {this.state.message} </div>

      </div> 
    )
  }
}

export default CompanySearch
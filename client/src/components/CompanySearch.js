import React from 'react'; 
import CompanyOption from './CompanyOption'

class CompanySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      inputVal: '',
      companies: null, 
      formattedOptions: []
    };
  }

  callAPI = () => {
    console.log(this.state.inputVal)
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
        //display the company and have them select the correct one
        console.log(json.company)
        this.setState({
          companies: json.company
        })
        this.createOptions(); 
      } else {
        console.log('no company with that search criteria. try with the other option or call mail on bike to register as a client')
      }
    })
  }

  createOptions = () => {
    let options = {
        company: []
    }

    for(let i=0; i<this.state.companies.length; i++) {
      let official_company_name = this.state.companies[i].official_company_name; 
      let RUC = this.state.companies[i].RUC; 
      let common_name = this.state.companies[i].company_name; 
      options.company.push({ 
        "official_company_name" : official_company_name,
        "RUC"  : RUC, 
        "common_name" : common_name
      });
    }

    this.setState({
      formattedOptions: options
    })

    console.log(this.state.formattedOptions)
  }

  updateInputValue(evt) {
    this.setState({
      inputVal: evt.target.value
    });
  }

    render() {    
    return (
      <div>
        <input type="text" placeholder = "type in the RUC or the razon commercial name" value={this.state.inputVal} onChange={evt => this.updateInputValue(evt)}></input> 
        <button type = "button" onClick={() => this.callAPI()}> search for the company </button>
        <div> {
          this.state.formattedOptions != [] ? 
          this.state.formattedOptions.map( (company, index) => {
          return (
            <CompanyOption company={company} />
            ) 
          }) 

          : 'noooo'
        }

        </div>

      </div> 
    )
  }
}

export default CompanySearch
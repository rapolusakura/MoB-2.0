import React from 'react'; 

class CompanySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      inputVal: '',
      company: null
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
        if(json.company.length == 1) {
          console.log(json.company)
        }
      } else {
        console.log('no company with that search criteria. try with the other option or call mail on bike to register as a client')
      }
    })
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
      </div> 
    )
  }
}

export default CompanySearch
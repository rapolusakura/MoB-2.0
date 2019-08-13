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
    .then(console.log('searched'))
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
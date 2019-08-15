import React from 'react'; 

export default class CompanyOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    }
  }

  switchCheck = () => {
    console.log('got called bc i fucking pressed something')
    this.setState({
      isSelected: !this.state.isSelected
    }); 
    if(this.state.isSelected) {
      this.props.companySelected(this.props.company)
      console.log('passing up the value')
    }
  }

  render() {    
    return (
      <div>
        <input name="selectCompany" type="checkbox" checked={this.state.isSelected} onChange={this.switchCheck}/>
        <h2> Razon Commercial: {this.props.company.official_company_name} </h2> 
        <h2> Razon Social: {this.props.company.company_name} </h2> 
        <h3> RUC: {this.props.company.RUC} </h3> 
      </div> 
    )
  }
}
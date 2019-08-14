import React from 'react'; 

export default class CompanyOption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {    

    return (
      <div>
        <h2> Razon Commercial: {this.props.company.official_company_name} </h2> 
        <h2> Razon Social: {this.props.company.company_name} </h2> 
        <h3> RUC: {this.props.company.RUC} </h3> 
      </div> 
    )
  }
}
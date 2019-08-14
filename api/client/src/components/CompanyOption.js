import React from 'react'; 

export default class CompanyOption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {    

    return (
      <div>
        <h2> {this.props.company.official_company_name} </h2> 
      </div> 
    )
  }
}
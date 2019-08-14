import React from 'react'; 

export default class CompanyOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      company: null
    };
  }

  componentDidMount() {
    console.log('hello this is me', this.props.company)
    this.setState({
      company: this.props.company.official_company_name
    })
  }

  render() {    

    return (
      <div>
        <h2> {this.props.company} </h2> 
      </div> 
    )
  }
}
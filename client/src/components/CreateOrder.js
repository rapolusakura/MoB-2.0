import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import MapView from './Map'; 
import { getFromStorage } from '../utils/storage';

export default class orderForm extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {
      startingAddress : '',
      destAddress : '', 
      startingPlaceId : '', 
      destPlaceId : '', 
      startingLat : '', 
      startingLng : '', 
      destLat : '', 
      destLng : '', 
      isAdmin : false, 
      employer : null,
      userId : ''
    }
  }

  componentDidMount() {
    const obj = getFromStorage('mail_on_bike');
    const { token } = obj;
    fetch('/getUserSessionDetails?token=' + token)
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        this.setState({
          isAdmin: json.isAdmin,
          employer: json.employer, 
          userId: json.userId
        }); 
      }
    }); 

  }

  CreateOrderSchema = () => { 
    Yup.object().shape({
    companyName: Yup.string()
      .required('Company name is required'),
    destContact: Yup.string()
      .required('the contact name of the destination is required'),
    destPhone: Yup.number()
      .positive()
      .required('the phone number of the dest is required'),  
  })};

 createOrderAPI = (values) => {
  console.log("starting addy", this.state.startingAddress)
  console.log("dest addy", this.state.destAddress)
  fetch("/createOrder", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: values.companyName,
      }),
    }).then(res => res.json())
        .then(json => { 
        console.log('json', json); 
        if(json.success) {
          console.log("worked!!");
        }
    });
}

  calculateRate = (isRoundTrip) => {
    if(this.state.startingPlaceId != '' && this.state.destPlaceId != '') {
      console.log('calculating the fucking rate..')
      let mode = ''; 
      isRoundTrip ? mode = 'round-trip' : mode = 'one-way'; 

      fetch("/calculateDistance", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: this.state.startingPlaceId,
        end: this.state.destPlaceId,
        mode: mode
      }),
    }).then(res => res.json())
        .then(json => { 

            console.log(json.distance); 
            //fuck
            if(!this.state.employer == null) {
              fetch()
            }


        });

          
        //now get the rate based off of the distance and the company
        //i need to find the fucking company first.. 
        //1) get the user session
        //2) get the companyId - if it is not null/if they are not an admin
        //3) on the UI side, if they are an admin, render a component that allows them to search a company by their RUC or razon commercial

    }
  }

updateAddress = (isOrigin, address, place_id, lat, lng) => {
  if(isOrigin) {
    this.setState({
    startingAddress: address,
    startingPlaceId: place_id, 
    startingLat: lat, 
    startingLng: lng

   })
  } else {
    this.setState({
    destAddress: address, 
    destPlaceId: place_id,
    destLat: lat, 
    destLng: lng
   })
  }
}

  render() {
    return (

          <Formik 
           initialValues={{
          companyName: '', 
          mode: false
        }}
      validationSchema={this.CreateOrderSchema}
      onSubmit={values => {
            console.log('submitting', values);
            this.createOrderAPI(values); 
      }}>
      {({ touched, values, errors }) => (
      <Form>
          <div> 
            <h2> client info </h2> 
            <Field name="companyName" type="text" placeholder = "Company Name" />
            {errors.companyName && touched.companyName ? <div>{errors.companyName}</div> : null}
            <br/> 
            <Field name="origin-notes" type="text" placeholder = "Enter any special notes.. instructions on getting there, etc" />
            <br/>
            <Field name="type-of-load" type="text" placeholder = "Enter the type of load (document, etc.)" /> 
            <br/>
            <label> 
            <Field name="mode" type="checkbox" checked={values.mode}/> 
            Round-trip delivery?
            </label> 
            <br/>

            <div style={{margin: '70px'}}>
            <h2> origin address </h2> 
            <MapView
              isOrigin={true}
              google={this.props.google}
              center={{lat: -12.140381, lng: -76.9857613}}
              height='300px'
              zoom={15}
              updateAddress={this.updateAddress}
            />
            </div> 

            <h2> destination info </h2> 
            <Field name="destContact" type="text" placeholder = "Dest contact name" /> 
            {errors.destContact && touched.destContact ? <div>{errors.destContact}</div> : null}
            <br/>
            <Field name="destCompany" type="text" placeholder = "Dest company" /> 
            <br/>
            <Field name="destPhone" type="text" placeholder = "Dest phone number" /> 
            {errors.destPhone && touched.destPhone ? <div>{errors.destPhone}</div> : null}
            <br/>
            <Field name="dest-notes" type="text" placeholder = "Enter any special notes.. instructions on getting there, etc" />
            <br/>
            <div style={{ margin: '70px' }}>
            <h2> destination address </h2> 
            <MapView
              isOrigin={false}
              google={this.props.google}
              center={{lat: -12.140381, lng: -76.9857613}}
              height='300px'
              zoom={15}
              updateAddress={this.updateAddress}
            />

        </div>
            <button onClick={this.calculateRate(values.mode)}> Calculate Rate </button>
            <button type="submit">Submit</button>
          </div> 
      </Form>
      )}
    </Formik>

    )
  }


}
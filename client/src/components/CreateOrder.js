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
      userId : '', 
      distance : -1, 
      rate : -1, 
      type_of_rate: '', 
      RUC: '',
      client_company_name: '',
      name: '', 
      phone_number: '', 
      defaultOrigin: '', 
      defaultDest: ''
    }
  }

  componentDidMount() {
    const obj = getFromStorage('mail_on_bike');
    const { token } = obj;
    fetch('/getUserDetails?token=' + token)
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        console.log('json resoponse', json)
        this.setState({
          isAdmin: json.isAdmin,
          employer: json.employer, 
          userId: json.userId, 
          name: json.name, 
          phone_number: json.phone_number, 
          client_company_name: json.client_company_name, 
          defaultOrigin: json.defaultOrigin, 
          defaultDest: json.defaultDest
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
  method_of_payment: Yup.string()
    .required('method of payment is required'),
})};

 createOrderAPI = (values) => {
  let mode = ''; 
  values.mode ? mode = 'round-trip' : mode = 'one-way'; 
  console.log('phone num', this.state.phone_number)
  console.log('company official name', this.state.client_company_name)
  console.log('method of payment', values.method_of_payment)
  console.log('type-of-rate', this.state.type_of_rate)
  // console.log("starting addy", this.state.startingAddress)
  // console.log("dest addy", this.state.destAddress)
    fetch("/createOrder", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_company_id : this.state.employer, 
          client_company_name : this.state.client_company_name,
          client_contact_name: this.state.name, 
          client_phone_number: this.state.phone_number, 
          special_instructions : "Origin Notes:".concat(values.origin_notes).concat('\nDestination Notes:').concat(values.dest_notes), 
          type_of_load : values.type_of_load, 
          mode : mode, 
          distance : this.state.distance,
          rate : this.state.rate, 
          client_address : this.state.startingAddress, 
          dest_address : this.state.destAddress, 
          dest_contact_name : values.destContact, 
          dest_company_name: values.destCompany,
          dest_phone_number: values.destPhone, 
          startLat: this.state.startingLat, 
          startLng: this.state.startingLng, 
          endLat: this.state.destLat,
          endLng: this.state.destLng, 
          type_of_rate: this.state.type_of_rate, 
          method_of_payment: values.method_of_payment,
          RUC: this.state.RUC, 
          money_collection: values.money_collection
        }),
      }).then(res => res.json())
          .then(json => { 
          console.log('json', json); 
          if(json.success) {
            console.log("worked!!");
          }
      });
}

calculateRate = (isRoundTrip, moneyCollection) => {
  if(this.state.startingPlaceId != '' && this.state.destPlaceId != '') {
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
        this.setState({distance: json.distance})
        console.log('this is the distance', json.distance); 
        if(this.state.employer != null) {
            fetch("/calculateRate", {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              distance: json.distance,
              companyId: this.state.employer
            }),
          })
            .then(res => res.json())
            .then(json => { 
            if(json.success) {
              console.log('this is the response from calculate rate: ', json)
              let realRate = -1;
              if (moneyCollection == '' || moneyCollection == 0 || moneyCollection == null || moneyCollection == 'undefined') { realRate = json.rate } else { realRate = json.rate + 2;}
              this.setState({
                rate: realRate, 
                type_of_rate: json.type_of_rate, 
                RUC: json.RUC
              }); 
            }
            });
        }
      });
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

    let apiLabel;

    if (this.state.rate != -1 && this.state.distance != -1) {
      apiLabel = <label> Distance: {this.state.distance} Rate: {this.state.rate} </label>;
    } else {
      apiLabel = <label> Distance: N/A Rate: N/A </label>;
    }
    return (
      <div>
          <Formik 
           initialValues={{
            mode: false,
            method_of_payment: 'cash_on_origin'
        }}
      validationSchema={this.CreateOrderSchema}
      onSubmit={values => {
            console.log('submitting', values);
            this.createOrderAPI(values); 
      }}>
      {({ touched, values, errors, handleChange }) => (
      <Form>
          <div> 
            <h2> client info </h2> 
            <br/> 
            <Field name="origin_notes" type="text" placeholder = "Enter any special notes.. instructions on getting there, etc" />
            <br/>
            <Field name="type_of_load" type="text" placeholder = "Enter the type of load (document, etc.)" /> 
            <br/>
            <label> 
            <Field name="mode" type="checkbox" checked={values.mode}/> 
            Round-trip delivery?
            </label> 
            <br/>

            <label> Method of Payment </label> 
            <select
              name="method_of_payment"
              value={values.method_of_payment}
              style={{ display: 'block' }}
              onChange={handleChange}
            >
              <option label="Cash on origin" value="cash_on_origin" />
              <option label="Cash on destination" value="cash_on_destination" />
              <option label="Bank transfer" value="bank_transfer" />
            </select>
            {errors.method_of_payment && touched.method_of_payment ? <div>{errors.method_of_payment}</div> : null}
            <Field name="money_collection" type="text" placeholder = "Recaudo" /> 

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
            <Field name="dest_notes" type="text" placeholder = "Enter any special notes.. instructions on getting there, etc" />
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
          {apiLabel}
            <button style={{margin: '40px'}} type = "button" onClick={() => {this.calculateRate(values.mode, values.money_collection)}}> Calculate Rate </button>
            <button type="submit"> Submit </button>
          </div> 
      </Form>
      )}
    </Formik>
    </div>
    )
  }

}
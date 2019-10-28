import React from 'react'; 
import { Formik, Form, Field, FastField } from 'formik';
import * as Yup from 'yup';
import MapView from './Map'; 
import CompanySearch from './CompanySearch'; 
import { getFromStorage } from '../utils/storage';
import '../style.css'

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
    this.mapElement = React.createRef(); 
  }

  componentDidMount() {
    const obj = getFromStorage('mail_on_bike');
    const { token } = obj;
    fetch('/getUserDetails?token=' + token)
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        console.log("RUC", json.RUC); 
        if(json.isAdmin) {
          this.setState({
            isAdmin: json.isAdmin,
            userId: json.userId, 
            name: json.name, 
            phone_number: json.phone_number
          })
        } else {
        this.setState({
          isAdmin: json.isAdmin,
          employer: json.employer, 
          userId: json.userId, 
          name: json.name, 
          phone_number: json.phone_number, 
          client_company_name: json.client_company_name, 
          defaultOrigin: json.defaultOrigin, 
          defaultDest: json.defaultDest,
          type_of_rate: json.type_of_rate, 
          startingAddress: json.address, 
          RUC: json.RUC
        }); 
        if(json.address !== "SIN DIRECCION") {
          this.geocodeAddress(json.address);
        }
      }
      }
    }); 
  }

  companySelected = (company) => {
    this.setState({
      employer: company._id, 
      client_company_name: company.official_company_name,
      type_of_rate: company.type_of_rate
    })
  }

CreateOrderSchema = Yup.object().shape({
  destContact: Yup.string()
    .required('the contact name of the destination is required'),
  destPhone: Yup.number()
    .positive()
    .required('the phone number of the dest is required'), 
  method_of_payment: Yup.string()
    .required('method of payment is required'),
});

 createOrderAPI = (values) => {
  this.calculateRate(values.isRoundTrip, values.moneyCollection); 
  let mode = ''; 
  values.mode ? mode = 'round-trip' : mode = 'one-way'; 
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
        special_instructions : 'Notas especiales: '.concat(values.dest_notes), 
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
        money_collection: values.money_collection, 
        userId : this.state.userId
      }),
    }).then(res => res.json())
        .then(json => { 
        if(json.success) {
          console.log("worked!!");
        }
    });
}

calculateRate = (isRoundTrip, moneyCollection) => {
  if(this.state.startingPlaceId !== '' && this.state.destPlaceId !== '') {
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
              let realRate = -1;
              if (moneyCollection === '' || moneyCollection === 0 || moneyCollection === null || moneyCollection === 'undefined') { realRate = json.rate } else { realRate = json.rate + 2;}
              this.setState({
                rate: realRate, 
                type_of_rate: json.type_of_rate, 
                RUC: json.RUC
              }); 
            }
            });
        }
      });
  }
}

geocodeAddress = (address) => {
  fetch("/geocodeAddress", {
    method: 'POST', 
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify({
      address: address
    }),
  })
  .then(res => res.json())
  .then(json => {
    this.updateAddress(true, address, json.place_id, json.lat, json.lng); 
  })
}

updateAddress = (isOrigin, address, place_id, lat, lng) => {
  if(parseFloat(lat) !== NaN && parseFloat(lng) !== NaN) {
    if(isOrigin) {
      this.setState({
      startingAddress: address,
      startingPlaceId: place_id, 
      startingLat: lat, 
      startingLng: lng
     })
      this.mapElement.current.setCompanyAddress(address, parseFloat(lat), parseFloat(lng)); 
    } else {
      this.setState({
      destAddress: address, 
      destPlaceId: place_id,
      destLat: lat, 
      destLng: lng
     })
    }
}
}

  render() {

    let apiLabel;
    let lat,lng; 

    if (this.state.rate !== -1 && this.state.distance !== -1) {
      apiLabel = <label> Distancia: {this.state.distance} Tarifa: {this.state.rate} </label>;
    } else {
      apiLabel = 
      <div><br/>
      <label> <h3> Distancia: N/A  </h3> </label> 
      <label> <h3> Tarifa: N/A </h3> </label>
      </div> ;
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
            <h2> Información del Cliente </h2> 
            <br/> 
            {
              this.state.isAdmin ? <CompanySearch companySelected={this.companySelected} updateAddress={this.updateAddress}/> : ''
            }
            {
              this.state.isAdmin ? '' : 
              <div>
              <h3> Empresa: {this.state.client_company_name} </h3> 
              <h3> RUC: {this.state.RUC} </h3> 
              <h3> Address: {this.state.startingAddress} </h3> 
              <h3> Company Contact: {this.state.name} </h3> 
              <h3> Type of Rate: {this.state.type_of_rate} </h3> 
              </div> 
            }
            <br/>
            
            <Field className = 'orderField' name="type_of_load" type="text" placeholder = "Tipo de carga" />
            <label> <h4> Sólo transportamos documentos y paquetes pequeños de 30x30x20cms y hasta 3 Kg de peso. </h4> </label> 

            <br /> 
            <br /> 
            <label> 
            ¿El pedido es con retorno?
            <FastField name="mode" type="checkbox" checked={values.mode}/> 
            </label> 
            <br/>
            <br/> 
            <label> Medio de pago </label> 
            <select
              name="method_of_payment"
              value={values.method_of_payment}
              style={{ display: 'block' }}
              onChange={handleChange}
            >
              <option label="Efectivo en Origen" value="cash_on_origin" />
              <option label="Efectivo en Destino" value="cash_on_destination" />
              <option label="Transferencia bancaria" value="bank_transfer" />
            </select>
            {errors.method_of_payment && touched.method_of_payment ? <div>{errors.method_of_payment}</div> : null}

            {
              this.state.type_of_rate === 'e-commerce' ? <FastField className = 'orderField' name="money_collection" type="text" placeholder = "Recaudo" />  : ''
            }
            <br/>

            <h2> Destinatario </h2> 
            <Field className = 'orderField' name="destContact" type="text" placeholder = "Nombre de contacto en destino" /> 
            {errors.destContact && touched.destContact ? <div>{errors.destContact}</div> : null}
            <br/>
            <FastField className = 'orderField' name="destCompany" type="text" placeholder = "Empresa destino" /> 
            <br/>
            <FastField className = 'orderField' name="destPhone" type="text" placeholder = "Teléfono/celular" /> 
            {errors.destPhone && touched.destPhone ? <div>{errors.destPhone}</div> : null}
            <br/>
            <FastField className = 'orderField' name="dest_notes" type="text" placeholder = "Observaciones: instrucciones adicionales" />
            <br/>
            <div style={{ margin: '35px' }}>

            <h2> Ubicaciones </h2> 
            <h3> Dirección de origen </h3> 
            <MapView
              isOrigin={true}
              ref = {this.mapElement}
              google={this.props.google}
              center={{lat: -12.140381, lng: -76.9857613}}
              height='300px'
              zoom={15}
              updateAddress={this.updateAddress}
            />

            <div style={{margin: '70px'}}></div> 
            
            <h3> Dirección de destino </h3> 
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
            <button style={{margin: '40px'}} type = "button" onClick={() => {this.calculateRate(values.mode, values.money_collection)}}> Calcular tarifa </button>
            <h3> La tarifa está sujeta a cambios. </h3> 
            <button type="submit"> Enviar pedido </button>
          </div> 
      </Form>
      )}
    </Formik>
    </div>
    )
  }

}
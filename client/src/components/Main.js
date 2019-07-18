import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import PendingOrders from '../pages/PendingOrders'
import CompletedOrders from '../pages/CompletedOrders'
import CreateOrder from '../pages/CreateOrder'
import Login from '../pages/Login'

// The Main component renders one of the three provided
// Routes (provided that one matches).
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Dashboard}/>
      <Route path='/pendingOrders' component={PendingOrders}/>
      <Route path='/completedOrders' component={CompletedOrders}/>
      <Route path='/createOrder' component={CreateOrder}/>
      <Route path='/login' component={Login}/>
    </Switch>
  </main>
)

export default Main

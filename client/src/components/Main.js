import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import PendingOrders from '../pages/PendingOrders'
import CompletedOrders from '../pages/CompletedOrders'

// The Main component renders one of the three provided
// Routes (provided that one matches).
const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Dashboard}/>
      <Route path='/pendingOrders' component={PendingOrders}/>
      <Route path='/completedOrders' component={CompletedOrders}/>
    </Switch>
  </main>
)

export default Main

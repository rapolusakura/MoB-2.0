import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Dashboard hellooo</Link></li>
        <li><Link to='/pendingOrders'>Pending Orders</Link></li>
        <li><Link to='/completedOrders'>Completed Orders</Link></li>
      </ul>
    </nav>
    <h1> Admin View </h1>

    <Link to='/createOrder'> <Button variant="contained" color="primary"> CREATE AN ORDER </Button> </Link>
  </header>
)

export default Header
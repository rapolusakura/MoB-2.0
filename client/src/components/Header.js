import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/home'>Dashboard</Link></li>
        <li><Link to='/pendingOrders'>Pending Orders</Link></li>
        <li><Link to='/completedOrders'>Completed Orders</Link></li>
      </ul>
    </nav>
    <h1> you are currently on </h1>

    <Link to='/createOrder'><button> CREATE AN ORDER </button> </Link>
  </header>
)

export default Header
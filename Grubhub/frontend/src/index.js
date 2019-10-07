//index.js

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import OwnerHome from "./components/OwnerHome";
import CustomerSignUp from "./components/CustomerSignUp";
import OwnerSignUp from "./components/OwnerSignUp";
import CustomerHome from "./components/CustomerHome";
import OwnerProfile from "./components/OwnerProfile";
import Orders from "./components/Orders";
import Menu from "./components/Menu";
import AddItem from "./components/AddItem";
import CustomerProfile from "./components/CustomerProfile";
import GrubhubHome from "./components/GrubhubHome";
import SearchItem from "./components/SearchItem";
import PlaceCustomerOrder from "./components/PlaceCustomerOrder";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import PastOrders from "./components/PastOrders";
import UpcomingOrders from "./components/UpcomingOrders";
import ManageOrders from "./components/ManageOrders";
import "./index.css";

ReactDOM.render(
  <div className="container-fluid">
    <div>
      <Router>
        <div>
          <Route exact path="/" component={Login} />
          <Route path="/OwnerHome" component={OwnerHome} />
          <Route path="/CustomerSignUp" component={CustomerSignUp} />
          <Route path="/OwnerSignUp" component={OwnerSignUp} />
          <Route path="/CustomerHome" component={CustomerHome} />
          <Route path="/OwnerProfile" component={OwnerProfile} />
          <Route path="/Orders" component={Orders} />
          <Route path="/Menu" component={Menu} />
          <Route path="/AddItem" component={AddItem} />
          <Route path="/CustomerProfile" component={CustomerProfile} />
          <Route path="/Home" component={GrubhubHome} />
          <Route path="/SearchItem" component={SearchItem} />
          <Route path="/PlaceCustomerOrder" component={PlaceCustomerOrder} />
          <Route exact path="/Cart" component={Cart} />
          <Route exact path="/Checkout" component={Checkout} />
          <Route exact path="/PastOrders" component={PastOrders} />
          <Route exact path="/UpcomingOrders" component={UpcomingOrders} />
          <Route exact path="/ManageOrders" component={ManageOrders} />
        </div>
      </Router>
    </div>
  </div>,
  document.getElementById("root")
);

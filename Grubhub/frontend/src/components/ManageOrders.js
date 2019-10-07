import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Redirect } from "react-router";
import RenderOrder from "./RenderOrder";

//Define a Login Component
class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      ordersAvailable: true,
      status: ""
    };
  }

  updateStatus(id) {
    console.log("id passed", id);
  }

  componentWillMount() {
    if (cookie.load("cookie1")) {
      var input_email = cookie.load("cookie2");
      console.log("in component will mount of manage orders");
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:5001/grubhub/owner/onlyOrders", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              orders: response.data,
              ordersAvailable: true
            });
            console.log("orders", this.state.orders);
            if (this.state.orders.length == 0) {
              this.setState({
                ordersAvailable: false
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
          alert("Error while fetching orders");
        });
    }
  }
  render() {
    var redirectVar = null;
    const ordersData = this.state.orders;

    var itemAvailable = true;
    const baseImagePath = "http://localhost:5001/";
    if (ordersData.length == 0) {
      console.log("im in here");
      itemAvailable = false;
    }
    if (!cookie.load("cookie1")) {
      redirectVar = <Redirect to="/" />;
    }
    return Object.keys(ordersData).map(i => {
      return (
        <div>
          {redirectVar}
          {itemAvailable ? (
            <RenderOrder order={ordersData[i]} />
          ) : (
            <div className="container-full">
              <div className="container-pad">
                <h1> No orders to manage</h1>
              </div>
            </div>
          )}
        </div>
      );
    });
  }
}
export default ManageOrders;

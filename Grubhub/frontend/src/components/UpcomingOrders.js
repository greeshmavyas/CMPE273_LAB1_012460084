import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Navbar } from "react-bootstrap";
import "./Profile.css";

class UpcomingOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingOrders: [],
      upcomingOrdersAvailable: true
    };
  }
  componentWillMount() {
    if (cookie.load("cookie1")) {
      var input_email = cookie.load("cookie2");
      console.log("in component will mount of past orders");
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:5001/grubhub/custormer/orders/upcoming", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              upcomingOrders: response.data,
              upcomingOrdersAvailable: true
            });
            console.log("upcomingOrders", this.state.upcomingOrders);
            if (this.state.upcomingOrders == []) {
              this.state.upcomingOrdersAvailable = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
          alert("Error while fetching past orders");
        });
    }
  }
  render() {
    var redirectVar = null;
    const upcomingOrdersData = this.state.upcomingOrders;
    var dis = true;
    console.log("upcomingorderdata", upcomingOrdersData);
    if (!cookie.load("cookie1")) {
      redirectVar = <Redirect to="/" />;
    }
    const baseImagePath = "http://localhost:5001/";
    return Object.keys(upcomingOrdersData).map(i => {
      if (
        upcomingOrdersData[i].item_image_name == null ||
        upcomingOrdersData[i].item_image_name == ""
      ) {
        dis = false;
      }
      return (
        <div>
          {redirectVar}
          {this.state.upcomingOrdersAvailable ? (
            <div
              className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing"
              key={upcomingOrdersData[i].ID}
            >
              {/* <a className="pull-left" href="#" target="_parent">
                    <img
                    alt="Thumbnail View of item picture"
                    className="img-responsive uploadImgRest"
                    src={baseImagePath + upcomingOrdersData[i].item_image_name}
                  />
                  </a> */}

              <div className="card" style={{ marginBottom: "10px" }}>
                <div className="card-body">
                  {dis ? (
                    <div className="pull-right">
                      <img
                        alt="Thumbnail View of item picture"
                        className="img-responsive uploadImgItem"
                        src={
                          baseImagePath + upcomingOrdersData[i].item_image_name
                        }
                      />
                    </div>
                  ) : null}
                  <h4 className="card-title">
                    Item Name: {upcomingOrdersData[i].item_name}
                  </h4>
                  <h4 className="card-text">
                    Price:{"$"}
                    {parseInt(upcomingOrdersData[i].price) *
                      parseInt(upcomingOrdersData[i].quantity)}
                  </h4>
                  <h4 className="card-text ">
                    Quantity: {upcomingOrdersData[i].quantity}
                  </h4>
                  <h4 className="card-text ">
                    Status: {upcomingOrdersData[i].status}
                  </h4>
                  <h4 className="card-text ">
                    Delivered to Address:{" "}
                    {upcomingOrdersData[i].delivery_address}
                  </h4>
                  <h4 className="card-text ">
                    Order last modified on :{" "}
                    {upcomingOrdersData[i].last_modified_on}
                  </h4>
                </div>
              </div>

              {/* <div className="pull-right">
                  <img
                    alt="Thumbnail View of item picture"
                    className="img-responsive uploadImgRest"
                    src={baseImagePath + upcomingOrdersData[i].item_image_name}
                  />
                </div>

                <div className="media-body">
                  <h4 className="myh4">
                    Item Name: {upcomingOrdersData[i].item_name}
                  </h4>
                  <h4 className="myh4">
                    Price:{"$"}
                    {parseInt(upcomingOrdersData[i].price) *
                      parseInt(upcomingOrdersData[i].quantity)}
                  </h4>
                  <h4 className="myh4 ">
                    Quantity: {upcomingOrdersData[i].quantity}
                  </h4>
                  <h4 className="myh4 ">
                    Status: {upcomingOrdersData[i].status}
                  </h4>
                  <h4 className="myh4 ">
                    Delivered to Address:{" "}
                    {upcomingOrdersData[i].delivery_address}
                  </h4>
                  <h4 className="myh4 ">
                    Order last modified on :{" "}
                    {upcomingOrdersData[i].last_modified_on}
                  </h4>
                </div> */}
            </div>
          ) : (
            <div className="container-full">
              <div className="container-pad">
                <h1> No upcoming orders </h1>
              </div>
            </div>
          )}
        </div>
      );
    });
  }
}
export default UpcomingOrders;

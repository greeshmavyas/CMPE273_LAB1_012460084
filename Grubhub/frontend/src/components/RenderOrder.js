import React from "react";
import axios from "axios";
export default class RenderOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    };

    this.statusChangeHandler = this.statusChangeHandler.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }
  statusChangeHandler = e => {
    console.log("Inside status change handler");
    if (!(e.target.value == "select")) {
      this.setState({
        status: e.target.value
      });
    }
  };
  updateStatus() {
    console.log("hi i am here");
    console.log(this.props);
    console.log(this.props.order.order_id);
    const data = {
      status: this.state.status,
      order_id: this.props.order.order_id
    };
    console.log(data);
    axios
      .post("http://localhost:5001/grubhub/owner/orders/updatestatus", data)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data.responseMessage);
          alert(response.data.responseMessage);
          window.location.replace("/OwnerHome");
        } else {
          alert(response.data.responseMessage);
          console.log(response.data.responseMessage);
          window.location.replace("/OwnerHome");
        }
      });
  }
  handleInputChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    console.log("prod item render");
    const { order } = this.props;

    return (
      <div
        className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing"
        key={order.ID}
      >
        <div className="card" style={{ marginBottom: "10px" }}>
          <div className="card-body">
            <h4 className="card-title">Order ID: {order.order_id}</h4>
            <h4 className="card-text">
              Status:
              {order.status}
            </h4>
            <h4 className="card-text ">
              DeliveryAddress: {order.delivery_address}
            </h4>
            <h4 className="card-text ">Restaurant ID: {order.restaurant_id}</h4>
            <h4 className="card-text ">
              Order last modified on : {order.last_modified_on}
            </h4>
            <h4 className="card-text ">
              Email of the customer : {order.email}
            </h4>
            <select name="orderStatus" onChange={this.statusChangeHandler}>
              <option value="Select">Select</option>
              <option value="New">New</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">canceled</option>
            </select>
            <button
              type="button"
              onClick={() => this.updateStatus()}
              className="btn btn-primary"
            >
              Update status
            </button>
          </div>
        </div>
      </div>
    );
  }
}

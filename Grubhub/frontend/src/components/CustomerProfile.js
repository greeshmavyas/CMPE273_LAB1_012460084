import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "./Profile.css";
import ReactUploadImage from "./ReactUploadImage";

//Define a OwnerProfile Component
class CustomerProfile extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      profiledata: [],
      profileImagePath: ""
    };

    //Bind the handlers to this class
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.readFileName = this.readFileName.bind(this);
  }

  readFileName(fileName) {
    console.log("in readFileName", fileName);
    this.setState({ profileImagePath: fileName });
  }

  logout = () => {
    cookie.remove("cookie1", { path: "/" });
    cookie.remove("cookie2", { path: "/" });
    cookie.remove("cookie3", { path: "/" });
    console.log("All cookies removed!");
    window.location = "/";
  };

  componentWillMount() {
    if (cookie.load("cookie1")) {
      var input_email = cookie.load("cookie2");
      console.log("in component will mount of customer profile");
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:5001/grubhub/customer/profilefetch", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status == 200) {
            console.log(response.data);
            this.setState({
              profiledata: response.data
            });
            this.setState({
              profileImagePath: this.state.profiledata[0].image_name
            });
            console.log(this.state.profiledata[0].image_name);
            this.refs.myfirstname.value = this.state.profiledata[0].first_name;
            this.state.firstname = this.state.profiledata[0].first_name;
            this.refs.mylastname.value = this.state.profiledata[0].last_name;
            this.state.lastname = this.state.profiledata[0].last_name;
            this.refs.phone.value = this.state.profiledata[0].phone_number;
            this.state.phone = this.state.profiledata[0].phone_number;
            this.refs.email.value = this.state.profiledata[0].email;
            this.refs.profileImagePath.value = this.state.profiledata[0].image_name;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  firstnameChangeHandler = e => {
    this.setState({ firstname: e.target.value });
  };

  lastnameChangeHandler = e => {
    this.setState({ lastname: e.target.value });
  };

  phoneChangeHandler = e => {
    this.setState({ phone: e.target.value });
  };

  handleValidation() {
    let formIsValid = true;

    //firstname
    if (!this.state.firstname) {
      formIsValid = false;
      alert("First Name is a Required field");
      console.log("First name cannot be empty");
    }

    //lastname
    if (!this.state.lastname) {
      formIsValid = false;
      alert("Last Name is a Required field");
      console.log("Last name cannot be empty");
    }

    return formIsValid;
  }

  //submit Login handler to send a request to the node backend
  saveChanges(event) {
    console.log("Inside save form");
    //prevent page from refresh
    event.preventDefault();
    if (this.handleValidation()) {
      console.log("Profile Form data submitted");
      var input_email = cookie.load("cookie2");
      console.log(input_email);
      const data = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        phone: this.state.phone,
        email: input_email
      };

      console.log(data);
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("http://localhost:5001/grubhub/customer/profilesave", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log(response.data);
            this.setState({ profiledata: response.data });
            alert("Profile Data was succesfully saved!");
          }
        })
        .catch(error => {
          console.log("Error is:", error);
          alert("Profile data save error!");
        });
    }
  }

  render() {
    //redirect based on successful login
    let redirectVar = null;
    const baseImagePath = "http://localhost:5001/";
    console.log("new image path", this.state.profileImagePath);

    console.log(cookie.load("cookie1"));
    if (!cookie.load("cookie1")) {
      redirectVar = <Redirect to="/" />;
    }

    return (
      <div>
        {redirectVar}

        <div id="profilehref" class="myprofilecontainer">
          <div class="login-form">
            <br /> <br />
            <div class="uploadImg">
              <ReactUploadImage readFileName={this.readFileName} />
            </div>
            <br />
            <br />
            <h2>Account Information</h2>
            <br></br>
            <div className="pull-right">
              <img
                alt="Thumbnail View of Profile picture"
                className="img-responsive profilepic"
                src={baseImagePath + this.state.profileImagePath}
              />
            </div>
            <br /> <br />
            <div class="form-group">
              <p>First Name </p>
              <input
                ref="myfirstname"
                onChange={this.firstnameChangeHandler}
                type="text"
                class="form-control"
                name="firstname"
                placeholder="First Name"
                required
              />
            </div>
            <div class="form-group">
              <p>Last Name </p>
              <input
                ref="mylastname"
                onChange={this.lastnameChangeHandler}
                type="text"
                class="form-control"
                name="lastname"
                placeholder="Last Name or Initial"
                required
              />
            </div>
            <div class="form-group">
              <p>Phone </p>
              <input
                ref="phone"
                onChange={this.phoneChangeHandler}
                type="text"
                class="form-control"
                name="phone"
                placeholder="Phone Number"
                required
              />
              <br></br>
              <div class="form-group">
                <p>Email: </p>

                <h4> {cookie.load("cookie2")}</h4>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div class="col-md-10 text-center">
          <button onClick={this.saveChanges} class="btn-primary btn-lg">
            Save Changes
          </button>
          <br />
          <br />
          <br />
        </div>

        <br />
      </div>
    );
  }
}
//export Login Component
export default CustomerProfile;

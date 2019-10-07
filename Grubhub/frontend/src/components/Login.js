import React, { Component } from "react";

import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import "./Login.css";

//Define a Login Component
class Login extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constructor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      email: "",
      password: "",
      message: "",
      authFlag: false
    };
    //Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitCustomerLogin = this.submitCustomerLogin.bind(this);
    this.submitOwnerLogin = this.submitOwnerLogin.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false
    });
  }
  //email change handler to update state variable with the text entered by the user
  emailChangeHandler = e => {
    console.log("Inside email change handler");
    this.setState({
      email: e.target.value
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = e => {
    this.setState({
      password: e.target.value
    });
  };
  handleValidation() {
    let formIsValid = true;

    //Email
    if (!this.state.email) {
      formIsValid = false;
      alert("Login ID is a Required field");
      console.log("Login ID cannot be empty");
    }

    //Password
    if (!this.state.password) {
      formIsValid = false;
      alert("Password is a Required field");
      console.log("Password cannot be empty");
    }

    return formIsValid;
  }
  //submit Login handler to send a request to the node backend
  submitCustomerLogin(event) {
    console.log("Inside submit login");
    //prevent page from refresh
    event.preventDefault();
    if (this.handleValidation()) {
      console.log("Login Form submitted");
      const data = {
        email: this.state.email,
        password: this.state.password
      };

      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("http://localhost:5001/grubhub/customer/login", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              authFlag: true
            });
          }
        })
        .catch(error => {
          this.setState({
            ...this.state,
            message: "Incorrect username or password!!!!"
          });
          console.log("Error is:", error);
          // alert("Authentication Failed! Please try again");
        });
    }
  }

  submitOwnerLogin(event) {
    console.log("Inside submit login");
    //prevent page from refresh
    event.preventDefault();
    if (this.handleValidation()) {
      console.log("Login Form submitted");
      const data = {
        email: this.state.email,
        password: this.state.password
      };

      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("http://localhost:5001/grubhub/owner/login", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              authFlag: true
            });
          }
        })
        .catch(error => {
          this.setState({
            ...this.state,
            message: "!!!!Incorrect username or password!!!!"
          });
          console.log("Error is:", error);
          // alert("Authentication Failed! Please try again");
        });
    }
  }

  render() {
    //redirect based on successful login
    let redirectVar = null;
    console.log("Cookie is", cookie.load("cookie1"));
    if (cookie.load("cookie1") == "ownercookie") {
      redirectVar = <Redirect to="/OwnerHome" />;
    } else if (cookie.load("cookie1") == "customercookie") {
      redirectVar = <Redirect to="/CustomerHome" />;
    }
    return (
      <div>
        {redirectVar}
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/" title="GrubHub" className="logo">
                <img
                  className="logo"
                  src={require("./images/Grubhub.jpeg")}
                  alt="GrubHub Logo"
                />
              </a>
            </Navbar.Brand>
          </Navbar.Header>
          <img
            className="logo"
            src={require("./images/perk.png")}
            alt="Get Perks Logo"
          />
        </Navbar>
        <div className="container">
          <p></p>
        </div>
        <div className="container">
          <p></p>
        </div>
        <div className="container">
          <p></p>
        </div>
        <div className="container">
          <p></p>
        </div>
        <div className="container">
          <p></p>
        </div>
        <div className="container">
          <p></p>
        </div>
        <div className="container">
          <div className="col-sm-6 col-sm-offset-6" style={{ left: "400px" }}>
            <div className="login-form">
              <br />
              <h4>Sign in with your Grubhub account</h4>
              <hr width="98%"></hr>
              <br></br>
              <div className="form-group">
                <input
                  onChange={this.emailChangeHandler}
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  onChange={this.passwordChangeHandler}
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>
              <button id="opener_guid" type="button">
                Forgot Password?
              </button>
              <br></br>
              <br></br>
              <div className="btn btn-group" style={{ width: "100%" }}>
                <button
                  id="login"
                  className="btn btn-danger dropdown-toggle"
                  style={{
                    width: "100%"
                  }}
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  Login
                </button>
                <div className="dropdown-menu">
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={this.submitCustomerLogin}
                  >
                    Customer Login
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={this.submitOwnerLogin}
                  >
                    Owner Login
                  </a>
                </div>
              </div>

              <br></br>
              <div className="mydiv">
                <span className="myspan">or</span>
              </div>
              <br></br>
              <div>
                <button className="mybtn facebook_button">
                  Log in with Facebook
                </button>
              </div>
              <br></br>
              <div>
                <button className="mybtn google_button">
                  Log in with Google
                </button>
              </div>
              <br></br>
              <div className=" signupbtn btn-group ">
                <button
                  id="signup"
                  className=" signupbtn btn-link dropdown-toggle"
                  style={{
                    align: "center"
                  }}
                  type="button"
                  data-toggle="dropdown"
                >
                  Create an account
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="/CustomerSignUp">
                    Sign Up As Customer
                  </a>
                  <a className="dropdown-item" href="/OwnerSignUp">
                    Sign Up As Owner
                  </a>
                </div>
              </div>
              <br />
              <br />
              <br />
              <div>
                {" "}
                <h4>{this.state.message}</h4>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className="center" id="yourdiv">
          <font size="1">©2019 GrubHub. All rights reserved.</font>
        </div>
      </div>
    );
  }
}

//export Login Component
export default Login;

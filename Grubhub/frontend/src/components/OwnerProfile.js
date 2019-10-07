import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "./Profile.css";
import ReactUploadImageForOwnerPage from "./ReactUploadImageForOwnerPage";
import ReactUploadRestImage from "./ReactUploadRestImage";

//Define a OwnerProfile Component
class OwnerProfile extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      profiledata: [],
      profileImagePath: "",
      restImagePath: ""
    };

    //Bind the handlers to this class
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.rnameChangeHandler = this.rnameChangeHandler.bind(this);
    this.cuisineChangeHandler = this.cuisineChangeHandler.bind(this);
    this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.readFileName = this.readFileName.bind(this);
    this.readRestFileName = this.readRestFileName.bind(this);
  }

  readFileName(fileName) {
    console.log("in readFileName", fileName);
    this.setState({ profileImagePath: fileName });
  }

  readRestFileName(fileName) {
    console.log("in readFileName", fileName);
    this.setState({ restImagePath: fileName });
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
      console.log(input_email);
      const data = { email: input_email };
      axios.defaults.withCredentials = true;
      axios
        .post("http://localhost:5001/grubhub/owner/profilefetch", data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log(response.data);
            this.setState({
              profiledata: response.data
            });

            this.setState({
              profileImagePath: this.state.profiledata[0].image_name
            });
            this.setState({
              restImagePath: this.state.profiledata[0].rest_image_name
            });

            this.refs.myfirstname.value = this.state.profiledata[0].first_name;
            this.state.firstname = this.state.profiledata[0].first_name;
            this.refs.mylastname.value = this.state.profiledata[0].last_name;
            this.state.lastname = this.state.profiledata[0].last_name;
            this.refs.phone.value = this.state.profiledata[0].phone_number;
            this.state.phone = this.state.profiledata[0].phone_number;
            this.refs.rname.value = this.state.profiledata[0].restaurant_name;
            this.state.rname = this.state.profiledata[0].restaurant_name;
            this.refs.cuisine.value = this.state.profiledata[0].cuisine;
            this.state.cuisine = this.state.profiledata[0].cuisine;
            this.refs.zipcode.value = this.state.profiledata[0].zip_code;
            this.state.zipcode = this.state.profiledata[0].zip_code;
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

  rnameChangeHandler = e => {
    this.setState({ rname: e.target.value });
  };

  phoneChangeHandler = e => {
    this.setState({ phone: e.target.value });
  };

  zipCodeChangeHandler = e => {
    this.setState({ zipcode: e.target.value });
  };

  cuisineChangeHandler = e => {
    this.setState({ cuisine: e.target.value });
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

    //Restaurant
    if (!this.state.rname) {
      formIsValid = false;
      alert("restaurant name is a Required field");
      console.log("restaurant name cannot be empty");
    }
    //Zip Code
    if (!this.state.zipcode) {
      formIsValid = false;
      alert("Zip Code is a Required field");
      console.log("Zip Code cannot be empty");
    }
    //Cusisine
    if (!this.state.cuisine) {
      formIsValid = false;
      alert("Cuisine is a Required field");
      console.log("Cuisine cannot be empty");
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
        email: input_email,
        rname: this.state.rname,
        cuisine: this.state.cuisine,
        zipcode: this.state.zipcode
      };

      console.log(data);
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("http://localhost:5001/grubhub/owner/profilesave", data)
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
    var dis = true;
    var restDis = true;
    const baseImagePath = "http://localhost:5001/";
    console.log("new image path", this.state.profileImagePath);
    if (
      this.state.profileImagePath == "" ||
      this.state.profileImagePath == null
    ) {
      dis = false;
    }
    if (this.state.restImagePath == "" || this.state.restImagePath == null) {
      restDis = false;
    }
    console.log(cookie.load("cookie1"));
    if (!cookie.load("cookie1")) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
          <p></p>
        </div>
        <div class="uploadImg">
          <ReactUploadImageForOwnerPage readFileName={this.readFileName} />
        </div>

        {/* <div style={{ height: "300px" }}></div> */}

        <div class="uploadImgRest">
          <ReactUploadRestImage readRestFileName={this.readRestFileName} />
          {dis ? (
            <div className="pull-right">
              <img
                alt="Thumbnail View of restaurant picture"
                className="img-responsive profilepic"
                style={{ marginLeft: "20%" }}
                src={baseImagePath + this.state.restImagePath}
              />
            </div>
          ) : null}
        </div>

        <div id="profilehref" class="myprofilecontainer">
          <div class="login-form">
            <h2>Account Information</h2>
            <br></br>
            {dis ? (
              <div className="pull-right">
                <img
                  alt="Thumbnail View of Profile picture"
                  className="img-responsive profilepic"
                  src={baseImagePath + this.state.profileImagePath}
                />
              </div>
            ) : null}
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
            </div>

            <div class="form-group">
              <p>Restaurant Name </p>
              <input
                ref="rname"
                onChange={this.rnameChangeHandler}
                type="text"
                class="form-control"
                name="rname"
                placeholder="Restaurant Name"
                required
              />
            </div>

            <div class="form-group">
              <p>Cuisine </p>
              <input
                ref="cuisine"
                onChange={this.cuisineChangeHandler}
                type="text"
                class="form-control"
                name="cuisine"
                placeholder="Cuisine"
                required
              />
            </div>

            <div class="form-group">
              <p>Zip Code </p>
              <input
                ref="zipcode"
                onChange={this.zipCodeChangeHandler}
                type="text"
                pattern="[0-9]{5}"
                class="form-control"
                name="zipcode"
                placeholder="Zip Code"
                required
              />
            </div>
            <div class="form-group">
              <p>Email: </p>

              <h4> {cookie.load("cookie2")}</h4>
            </div>
          </div>
        </div>
        <br></br>

        <div class="col-md-10 text-center">
          <button onClick={this.saveChanges} class="btn-primary btn-lg">
            Save Changes
          </button>
        </div>
        <br />
      </div>
    );
  }
}
//export Login Component
export default OwnerProfile;

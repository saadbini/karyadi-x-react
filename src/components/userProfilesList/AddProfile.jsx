import React, { Component } from "react";
import ProfileDataService from "../../services/ProfileService";

export default class AddProfile extends Component {
  constructor(props) {
    super(props);
    this.onChangeDisplayName = this.onChangeDisplayName.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);    
    this.onChangeDateofBirth = this.onChangeDateofBirth.bind(this);   
    this.onChangeLocation = this.onChangeLocation.bind(this);           
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.newProfile = this.newProfile.bind(this);

    this.state = {
      id: null,
      displayName: "",      
      gender: "",
      dateOfBirth: "",
      location: "",
      description: "", 

      submitted: false
    };
  }

  onChangeDisplayName(e) {
    this.setState({
      displayName: e.target.value
    });
  }

  onChangeGender(e) {
    this.setState({
      gender: e.target.value
    });
  }
  
  onChangeDateofBirth(e) {
    this.setState({
      dateOfBirth: e.target.value
    });
  }  

  onChangeLocation(e) {
    this.setState({
      location: e.target.value
    });
  }    

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  saveProfile() {
    var data = {
      displayName: this.state.displayName,
      gender: this.state.gender,
      dateOfBirth: this.state.dateOfBirth,
      location: this.state.location,
      description: this.state.description
    };

    ProfileDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          displayName: response.data.displayName,
          gender: response.data.gender,
          dateOfBirth: response.data.dateOfBirth,
          location: response.data.location,          
          description: response.data.description,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newProfile() {
    this.setState({
      id: null,
      displayName: "",
      gender: "",
      dateOfBirth: "",
      location: "",
      description: "",

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="text-sm text-[#00d4c8] hover:text-[#00bfb3]" onClick={this.newProfile}>
              Add Another Profile
            </button>
            <br/>
            <a href="/user-profiles">
              <button
                className="bg-white text-[#DD4B25] px-6 py-2 rounded-md hover:bg-gray-100"
              >
                Back
              </button>
            </a>               
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                className="form-control"
                id="displayName"
                required
                value={this.state.displayName}
                onChange={this.onChangeDisplayName}
                name="displayName"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                name="gender"
                required
                value={this.state.gender}
                onChange={this.onChangeGender}              
                className="px-4 py-2 border rounded-md border-gray-300 text-black focus:outline-none focus:ring focus:ring-orange-300"
              >
                <option value="">Select a gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>   
            
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                required
                value={this.state.dateOfBirth}
                onChange={this.onChangeDateofBirth}
                name="dateOfBirth"
              />
            </div>   

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                required
                value={this.state.location}
                onChange={this.onChangeLocation}
                name="location"
              />
            </div>                                    

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>

            <button 
              className="ml-auto bg-[#00d4c8] text-white px-4 py-2 rounded-xl hover:bg-[#00bfb3] transition-colors"
              onClick={this.saveProfile} 
              >
              Submit
            </button>
            <a href="/user-profiles">
              <button
                className="bg-white text-[#DD4B25] px-6 py-2 rounded-md hover:bg-gray-100"
              >
                Back
              </button>
            </a>               
          </div>
        )}
      </div>
    );
  }
}

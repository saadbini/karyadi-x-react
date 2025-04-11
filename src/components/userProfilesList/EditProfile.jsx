import React, { Component } from "react";
import ProfileDataService from "../../services/ProfileService";
import { withRouter } from '../../common/with-router';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.onChangeDisplayName = this.onChangeDisplayName.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);    
    this.onChangeDateofBirth = this.onChangeDateofBirth.bind(this);   
    this.onChangeLocation = this.onChangeLocation.bind(this);     
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);

    this.state = {
      currentProfile: {
        id: null,
        displayName: "",      
        gender: "",
        dateOfBirth: "",
        location: "",
        description: "",
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getProfile(this.props.router.params.id);
  }

  onChangeDisplayName(e) {
    const displayName = e.target.value;

    this.setState(function(prevState) {
      return {
        currentProfile: {
          ...prevState.currentProfile,
          displayName: displayName
        }
      };
    });
  }

  onChangeGender(e) {
    const gender = e.target.value;
    
    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        gender: gender
      }
    }));
  }

  onChangeDateofBirth(e) {
    const dateOfBirth = e.target.value;
    
    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        dateOfBirth: dateOfBirth
      }
    }));
  }

  onChangeLocation(e) {
    const location = e.target.value;
    
    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        location: location
      }
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        description: description
      }
    }));
  }

  getProfile(id) {
    ProfileDataService.get(id)
      .then(response => {
        this.setState({
          currentProfile: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateProfile() {
    ProfileDataService.update(
      this.state.currentProfile.id,
      this.state.currentProfile
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "Profile updated"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteProfile() {    
    ProfileDataService.delete(this.state.currentProfile.id)
      .then(response => {
        console.log(response.data);
        this.props.router.navigate('/user-profiles');
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentProfile } = this.state;

    return (
      <div>
        {currentProfile ? (
          <div className="edit-form">
            <h4>Profile</h4>
            <form>
              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="displayName"
                  value={currentProfile.displayName}
                  onChange={this.onChangeDisplayName}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  name="gender"
                  required
                  value={currentProfile.gender}
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
                  value={currentProfile.dateOfBirth}
                  onChange={this.onChangeDateofBirth}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={currentProfile.location}
                  onChange={this.onChangeLocation}
                />
              </div>              

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentProfile.description}
                  onChange={this.onChangeDescription}
                />
              </div>
            </form>

            <button
              className="bg-[red] text-white ml-auto px-4 py-2 rounded-xl"
              onClick={this.deleteProfile}
            >
              Delete
            </button>

            <button
              type="submit"
              className="ml-auto bg-[#00d4c8] text-white px-4 py-2 rounded-xl hover:bg-[#00bfb3] transition-colors"
              onClick={this.updateProfile}
            >
              Update
            </button>
            <a href="/user-profiles">
              <button
                className="bg-white text-[#DD4B25] px-6 py-2 rounded-md hover:bg-gray-100"
              >
                Back
              </button>
            </a>   
    
            <p>{this.state.message}</p>
          
          </div>
        ) : (
          <div>
            <br />
            <p>Please select a profile.</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Profile);
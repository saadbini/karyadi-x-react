import React, { Component } from "react";
import ProfileDataService from "../../services/ProfileService";
import { Link } from "react-router-dom";

export default class ProfilesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchDisplayName = this.onChangeSearchDisplayName.bind(this);
    this.retrieveProfiles = this.retrieveProfiles.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveProfile = this.setActiveProfile.bind(this);
    this.removeAllProfiles = this.removeAllProfiles.bind(this);
    this.searchDisplayName = this.searchDisplayName.bind(this);

    this.state = {
      profiles: [],
      currentProfile: null,
      currentIndex: -1,
      searchDisplayName: ""
    };
  }

  componentDidMount() {
    this.retrieveProfiles();
  }

  onChangeSearchDisplayName(e) {
    const searchDisplayName = e.target.value;

    this.setState({
      searchDisplayName: searchDisplayName
    });
  }

  retrieveProfiles() {
    ProfileDataService.getAll()
      .then(response => {
        this.setState({
          profiles: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveProfiles();
    this.setState({
      currentProfile: null,
      currentIndex: -1
    });
  }

  setActiveProfile(profile, index) {
    this.setState({
      currentProfile: profile,
      currentIndex: index
    });
  }

  removeAllProfiles() {
    ProfileDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchDisplayName() {
    this.setState({
      currentProfile: null,
      currentIndex: -1
    });

    ProfileDataService.findByDisplayName(this.state.searchDisplayName)
      .then(response => {
        this.setState({
          profiles: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchDisplayName, profiles, currentProfile, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="px-4 py-2 border rounded-md border-gray-300 text-black focus:outline-none focus:ring focus:ring-orange-300"
              placeholder="Search by display name"
              value={searchDisplayName}
              onChange={this.onChangeSearchDisplayName}
            />

              <button
                className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
                type="button"
                onClick={this.searchDisplayName}
              >
                Search
              </button>

          </div>
        </div>
        
        <div>
          <Link
            to="/user-profiles/add"
            className="text-sm text-[#00d4c8] hover:text-[#00bfb3]"
          >
            Add Profile
          </Link> 
        </div>
        <br/>          
        <div className="w-1/4">
          <h4 className="text-xl sm:text-xl md:text-xl font-bold text-gray-900 mb-4 leading-tight">Profiles List</h4>

          <ul className="list-group bg-[lightblue] text-gray-800">
            {profiles &&
              profiles.map((profile, index) => (
                <li
                  className={
                    "list-group-item border-2 border-white cursor-pointer " +
                    (index === currentIndex ? "active" : "") 
                  }
                  onClick={() => this.setActiveProfile(profile, index)}
                  key={index}
                >
                  {profile.displayName}
                </li>
              ))}
          </ul>

          <br/>

          <button
            className="bg-[red] text-white ml-auto px-4 py-2 rounded-xl"
            onClick={this.removeAllProfiles}
          >
            Remove All
          </button>
        </div>
        <br/>
        <div className="col-md-6">
          {currentProfile ? (
            <div>
              <h4>Profile</h4>
              <div>
                <label>
                  <strong>Display Name:</strong>
                </label>{" "}
                {currentProfile.displayName}
              </div>
              <div>
                <label>
                  <strong>Gender:</strong>
                </label>{" "}
                {currentProfile.gender}
              </div>
              <div>
                <label>
                  <strong>Date of Birth:</strong>
                </label>{" "}
                {currentProfile.dateOfBirth}
              </div>    
              <div>
                <label>
                  <strong>Location:</strong>
                </label>{" "}
                {currentProfile.location}
              </div>                                      
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentProfile.description}
              </div>

              <br/>

              <Link
                to={"/user-profiles/" + currentProfile.id}
                className="ml-auto bg-[#00d4c8] text-white px-4 py-2 rounded-xl hover:bg-[#00bfb3] transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please select a profile.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

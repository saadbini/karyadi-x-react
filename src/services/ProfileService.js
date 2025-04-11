import http from "../http-common";

class ProfileDataService {
  getAll() {
    return http.get("/user-profiles");
  }

  get(id) {
    return http.get(`/user-profiles/${id}`);
  }

  create(data) {
    return http.post("/user-profiles", data);
  }

  update(id, data) {
    return http.put(`/user-profiles/${id}`, data);
  }

  delete(id) {
    return http.delete(`/user-profiles/${id}`);
  }

  deleteAll() {
    return http.delete(`/user-profiles`);
  }

  findByDisplayName(displayName) {
    return http.get(`/user-profiles?displayName=${displayName}`);
  }
}

export default new ProfileDataService();
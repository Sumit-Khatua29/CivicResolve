import api from "./api";

const getProfile = () => {
  return api.get("/users/profile");
};

const updateProfile = (profileData) => {
  return api.put("/users/profile", profileData);
};

const UserService = {
  getProfile,
  updateProfile,
};

export default UserService;

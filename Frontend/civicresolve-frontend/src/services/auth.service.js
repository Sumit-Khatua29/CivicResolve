import api from "./api";

const register = (username, email, password, role) => {
  return api.post("/auth/signup", {
    username,
    email,
    password,
    role,
  });
};

const login = (username, password) => {
  return api
    .post("/auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const googleLogin = (token) => {
  return api
    .post("/auth/google", {
      token,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
};

export default AuthService;

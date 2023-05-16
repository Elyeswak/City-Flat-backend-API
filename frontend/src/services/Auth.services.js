import axios from "axios";

const API_URL = "http://localhost:9090/user/";

/*
 *Register
 */
const register = (name, email, password) => {
  return axios.post(API_URL + "register", {
    name,
    email,
    password,
  });
};

/*
 *Login
 */

const login = (email, password) => {
  return axios
    .post(
      API_URL + "login",
      {
        email,
        password,
      },
      {
        header: {
          "Content-Type":
            "application/x-www-form-urlencoded; charset=UTF-8;application/json",
        },
      }
    )
    .then((response) => {
      if (response.data.email) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

/*
 *Logout
 */

const logout = () => {
  localStorage.removeItem("user");
};
/*
 * get current user
 */

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;

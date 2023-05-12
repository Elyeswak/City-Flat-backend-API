import axios from "axios";

const API_URL = "http://localhost:9090/";

/*
 *Get all apartments
 */
const getApartments = () => {
  return axios
    .get(API_URL + "appartments/getAllAppart", {})
    .then((res) => {
      const data = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const ApartmentService = {
  getApartments,
};

export default ApartmentService;

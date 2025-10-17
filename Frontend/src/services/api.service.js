import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const jsonClient = (baseURL) => {
  return axios.create({
    baseURL,
    headers: commonConfig.headers,
  });
};

export const formClient = (baseURL) => {
  return axios.create({
    baseURL,
  });
};

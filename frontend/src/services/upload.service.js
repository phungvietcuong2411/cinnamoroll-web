import axios from "./Axios/axios"; 

export const uploadSingle = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return axios.post("/api/upload/single", formData);
};

export const uploadMultiple = (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("images", file);
  });
  return axios.post("/api/upload/multiple", formData);
};
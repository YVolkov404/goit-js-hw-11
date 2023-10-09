import axios from 'axios';

const axios = require('axios').default;

axios.defaults.baseURL = 'https://pixabay.com/api';

const params = {
  params: {
    baseURL: 'https://pixabay.com/api',
    key: '39908765-01641b9876d1c1af0468ed447',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};

axios
  .get(`/`, params)
  .then(response => {
    return response.json;
  })
  .catch(error => {
    console.log(error.message);
  });

async function fetchImages() {
  try {
    const response = await axios.get(`/&q=${searchQuery}`, params);
    const data = response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

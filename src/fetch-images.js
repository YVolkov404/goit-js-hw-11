import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';

export async function fetchImages(searchQuery) {
  try {
    return await axios.get(`/`, {
      params: {
        baseURL: 'https://pixabay.com/api',
        key: '39908765-01641b9876d1c1af0468ed447',
        q: `${searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

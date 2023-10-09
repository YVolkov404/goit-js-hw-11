import axios from 'axios';

export default class Controller {
  constructor() {
    this.searchQuery = '';
    this.page = 0;
  }

  async getPage(searchQuery, page) {
    return await axios.get(`/`, {
      params: {
        baseURL: 'https://pixabay.com/api',
        key: '39908765-01641b9876d1c1af0468ed447',
        q: `${searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: 40,
      },
    });
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}

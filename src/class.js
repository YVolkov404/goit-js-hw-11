const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '39908765-01641b9876d1c1af0468ed447';
const URL_OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  async fetchImages() {
    return fetch(
      `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${URL_OPTIONS}&page=${this.page}&per_page=${this.per_page}`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(images => {
        this.incrementPageAndPerPage();
        return images;
      });
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  incrementPageAndPerPage() {
    this.page += 1;
    this.per_page += 40;
  }

  resetPage() {
    this.page = 1;
    this.per_page = 40;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

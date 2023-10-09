import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { simpleLightboxOptions, notifyOptions } from './options';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './create-markup';
import PreLoadState from './preload-state';
import Controller from './controller';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const controller = new Controller();

const lightbox = new SimpleLightbox(
  '.gallery .photo-card a',
  simpleLightboxOptions
);

const preLoadState = new PreLoadState({
  selector: '.load-more',
});

let searchQuery;
let images;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const axios = require('axios').default;

axios.defaults.baseURL = 'https://pixabay.com/api';

const instance = axios.create({
  baseURL: 'https://pixabay.com/api',
  key: '39908765-01641b9876d1c1af0468ed447',
  q: `${searchQuery}`,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onloadMore);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function fetchImages(searchQuery) {
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function onSearchForm(e) {
  e.preventDefault();

  clearPage();
  searchQuery = e.currentTarget.searchQuery.value.trim();

  form.reset();
  preLoadState.show();

  if (searchQuery === '') {
    preLoadState.hide();
    Notify.warning(
      'Please type your query in the input field for receiving search result',
      notifyOptions
    );
    return;
  }

  controller.resetPage();
  try {
    const response = await fetchImages(searchQuery);
    const images = response.data.hits;

    if (images.length === 0) {
      form.reset();
    }

    createMarkup(images);
    lightbox.refresh();
  } catch (error) {
    preLoadState.hide();
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again',
      notifyOptions
    );
  }
}
controller.incrementPage();
async function onloadMore(e) {
  try {
    const response = await controller.getPage();
    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (totalHits < 40) {
      preLoadState.hide();
    }

    createMarkup(images);
    lightbox.refresh();
  } catch (error) {
    preLoadState.hide();
    Notify.warning(
      "We're sorry, but you've reached the end of search results.",
      notifyOptions
    );
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// function incrementPage(page) {
//   page += 1;
//   return page;
// }

// function resetPage() {
//   instance.page = 1;
//   instance.per_page = 40;
// }

function clearPage() {
  gallery.innerHTML = '';
}

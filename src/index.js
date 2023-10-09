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
let page = 1;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const instance = axios.create({
//   baseURL: 'https://pixabay.com/api',
//   key: '39908765-01641b9876d1c1af0468ed447',
//   q: `${searchQuery}`,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
//   page: 1,
//   per_page: 40,
// });

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onloadMore);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

axios.defaults.baseURL = 'https://pixabay.com/api';

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
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again',
        notifyOptions
      );
      preLoadState.hide();
      form.reset();
    }

    createMarkup(images);
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

async function onloadMore(e) {
  try {
    controller.incrementPage();
    const response = await controller.getPage(searchQuery, page);
    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (totalHits / 40 < 40) {
      preLoadState.hide();
      controller.resetPage();
      Notify.warning(
        "We're sorry, but you've reached the end of search results.",
        notifyOptions
      );
    }

    createMarkup(images);
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function clearPage() {
  gallery.innerHTML = '';
}

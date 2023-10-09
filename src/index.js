import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { simpleLightboxOptions, notifyOptions } from './options';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './create-markup';
import ApiService from './class';
import PreLoadState from './preload-state';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const apiService = new ApiService();

const lightbox = new SimpleLightbox(
  '.gallery .photo-card a',
  simpleLightboxOptions
);

const preLoadState = new PreLoadState({
  selector: '.load-more',
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onloadMore);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function clearPage() {
  gallery.innerHTML = '';
}

async function onSearchForm(e) {
  e.preventDefault();

  clearPage();
  apiService.query = e.currentTarget.elements.searchQuery.value.trim();
  form.reset();
  preLoadState.show();

  if (apiService.query === '') {
    preLoadState.hide();
    Notify.warning(
      'Please type your query in the input field for receiving search result',
      notifyOptions
    );
    return;
  }

  try {
    const data = await apiService.fetchImages();
    const images = data.hits;

    if (images.length === 0) {
      form.reset();
    }

    createMarkup(images);
    lightbox.refresh();
  } catch {
    preLoadState.hide();
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again',
      notifyOptions
    );
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function onloadMore(e) {
  try {
    const data = await apiService.fetchImages();
    const images = data.hits;
    const totalHits = data.totalHits;

    if (totalHits < apiService.per_page) {
      clearPage();
    }

    createMarkup(images);
    lightbox.refresh();
  } catch {
    preLoadState.hide();
    Notify.warning(
      "We're sorry, but you've reached the end of search results.",
      notifyOptions
    );
  }
}

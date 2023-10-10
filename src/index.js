import AOS from 'aos';
import aosOption from 'aos';
import 'aos/dist/aos.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { simpleLightboxOptions, notifyOptions } from './options';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './create-markup';
import { fetchImages } from './fetch-images';
import PreLoadState from './preload-state';
import Controller from './controller';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

AOS.init(aosOption);

const controller = new Controller();

const lightbox = new SimpleLightbox(
  '.gallery .photo-card a',
  simpleLightboxOptions
);

const preLoadState = new PreLoadState({
  selector: '.load-more',
});

let searchQuery;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

form.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onloadMore);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function onSearchForm(e) {
  e.preventDefault();
  clearPage();

  searchQuery = e.currentTarget.searchQuery.value.trim();
  form.reset();

  preLoadState.show();

  if (searchQuery === '') {
    Notify.warning(
      'Please type your query in the input field for receiving search result',
      notifyOptions
    );

    preLoadState.hide();
    form.reset();
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

let page = 1;

async function onloadMore(e) {
  try {
    controller.incrementPage();
    const response = await controller.getPage(searchQuery, page);
    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (totalHits / 80 > images.length) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results.",
        notifyOptions
      );

      preLoadState.hide();
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

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { simpleLightboxOptions, notifyOptions } from './options';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './class';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiService = new ApiService();
const lightbox = new SimpleLightbox(
  '.gallery .photo-card a',
  simpleLightboxOptions
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onloadMore);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function onSubmit(e) {
  e.preventDefault();

  clearPage();
  apiService.query = e.currentTarget.elements.searchQuery.value;
  apiService.resetPage();

  apiService
    .fetchImages()
    .then(images => {
      createMarkup(images);
      lightbox.refresh();
    })
    .catch(err => {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again',
        notifyOptions
      );
    })
    .finally(form.reset());
}

function onloadMore(e) {
  apiService.fetchImages().then(createMarkup);
  lightbox.refresh();
}

function clearPage() {
  gallery.innerHTML = '';
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function createMarkup(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">
          <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${image.likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${image.views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${image.comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${image.downloads}
              </p>
         </div>
      </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

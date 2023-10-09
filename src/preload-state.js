export default class PreLoadState {
  constructor({ selector, hidden = true }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};

    refs.loadMoreBtn = document.querySelector('.load-more');

    return refs;
  }

  show() {
    this.refs.loadMoreBtn.classList.remove('is-hidden');
  }

  hide() {
    this.refs.loadMoreBtn.classList.add('is-hidden');
  }
}

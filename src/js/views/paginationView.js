import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Pagina 1 e existem outras paginas
    if (curPage === 1 && numPages > 1) {
      return this._generateNextPageMarkup(curPage);
    }
    // Ultima pagina
    if (curPage === numPages && numPages > 1) {
      return this._generatePrevPageMarkup(curPage);
    }
    // Outra pagina
    if (curPage < numPages) {
      return `${this._generateNextPageMarkup(curPage)}
      ${this._generatePrevPageMarkup(curPage)} `;
    }
    // Pagina 1 e não existem outras paginas
    return '';
  }

  _generateNextPageMarkup(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Pagina ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
`;
  }

  _generatePrevPageMarkup(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Pagina ${curPage - 1}</span>
    </button>
  `;
  }
}

export default new PaginationView();

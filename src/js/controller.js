import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // Pegado a ID do url //
    const id = window.location.hash.slice(1);
    // Guard clause para caso não haja nenhuma id //
    if (!id) return;
    // Mostrando spinner //
    recipeView.renderSpinner();

    // Atualizando o results view para marcar a pesquisa selecionada //
    resultsView.update(model.getSearchResultsPage());

    // Atualizando o bookmark //
    bookmarksView.update(model.state.bookmarks);

    // Carregando a receita //
    await model.loadRecipe(id);

    // Renderizando a receita //
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Pegar o termo de pesquisa (query) //
    const query = searchView.getQuery();
    if (!query) return;
    // Carregando os resultados da pesquisa //
    await model.loadSearchResults(query);
    // Render os resultados //
    resultsView.render(model.getSearchResultsPage());

    // Renderizar os botões das paginas //
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Renderizar novos resultados //
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Renderizar novos botões das paginas //
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Atualizar a quantidade de ingredientes da receita //
  model.updateServings(newServings);

  // Atualizar o recipe view //
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Adicionar ou remover bookmark //
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Atualizar o recipeView //
  recipeView.update(model.state.recipe);

  // Renderizar bookmark //
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Mostrar o spinner //
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Renderizar a receita //
    recipeView.render(model.state.recipe);

    // Mostrando mensagem de sucesso //
    addRecipeView.renderMessage();

    // Renderizar o bookmark view //
    bookmarksView.render(model.state.bookmarks);

    // Mudando a id na url //
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Fechando a janela do form após certo tempo//
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

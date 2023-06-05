import { async } from 'regenerator-runtime';
import * as model from './model.js'
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot){
//   module.hot.accept();
// }


const shareModal = function() {
  const shareModal = document.getElementById("shareModal");
  const closeButton = document.querySelector(".close");
  const shareButton = document.querySelector(".share");
  // Function to open the modal
  const openModal = function() {
    shareModal.classList.add("modal-open");
  };

  // Function to close the modal
  const closeModal = function() {
    shareModal.classList.remove("modal-open");
  };

  // Open the modal when clicking the share button
  shareButton.addEventListener("click", openModal);

  // Close the modal when clicking the close button
  closeButton.addEventListener("click", closeModal);

  // Close the modal when pressing the Esc key
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Close the modal when clicking outside the modal
  window.addEventListener("click", function(event) {
    if (event.target === shareModal) {
      closeModal();
    }
  });
};

const controlRecipes = async function(){

  try{
    const id = window.location.hash.slice(1);

    if(!id) return
   recipeView.renderSpinner()
    // 0.Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks)

    //1. Loading recipe 
    await model.loadRecipe(id)
  

    // 2. Rendering recipe

    recipeView.render(model.state.recipe)

  }catch(err){
    recipeView.renderError()
  }
}

controlRecipes();

const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner()

    // 1.Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2.Load serach results
    await model.loadSerachResults(query);

    
    // 3.Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    // 4. Render initial paginations buttons
    paginationView.render(model.state.search)
  }catch(err){
    console.log(err)
  }
}

const controlPagination = function(goToPage){
// 1.Render NEW results
    resultsView.render(model.getSearchResultsPage(goToPage))

    // 2. Render NEW paginations buttons
    paginationView.render(model.state.search)

}
const controlServings = function(newServings){
  // Update the recipe serving (in state)
  model.updateServings(newServings)

  // Update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlSortRecipes=function(){
  const recipes= model.getSearchResultsPage()

  recipes.sort((a, b) => a.title.localeCompare(b.title));
     

  console.log(recipes)

  resultsView.render(recipes)
}

  const controlAddBookmark = function(){
    //1. Add or Remove bookmark
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // 2.Update recipe view
    recipeView.update(model.state.recipe)

    // 3. Render the bookmarks
    bookmarksView.render(model.state.bookmarks)
  }
  
  const controlBookmarks = function(){
    bookmarksView.render(model.state.bookmarks)
  }

  const controlAddRecipe = async function(newRecipe){
   try{

    // Show loading sppiner
    addRecipeView.renderSpinner()
     // console.log(newRecipe)
     
     //  Upload the new recipe data
    await model.uploadRecipe(newRecipe)

    console.log(model.uploadRecipe(newRecipe))
    console.log(model.state.recipe)

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Succes message
    addRecipeView.renderMessage()

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change id in url
    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC * 1000)

    }catch(err){
      console.log("💥",err)
      addRecipeView.renderError(err.message)
    }
  }


  
  
  
  
  
  
  
  
  const controlSortIngredients = function() {
    // Get the current recipe ingredients
    const currentIngredients = model.state.recipe.ingredients;
  
    // Sort the ingredients by quantity
    const sortedIngredients = currentIngredients.slice().sort((a, b) => {
      const quantityA = a.quantity;
      const quantityB = b.quantity;
  
      // Handle null values
      if (quantityA === null && quantityB === null) {
        return 0;
      } else if (quantityA === null) {
        return -1;
      } else if (quantityB === null) {
        return 1;
      }
  
      // Compare quantities as numbers if not null
      return quantityA - quantityB;
    });
  
    // Check if the current order is the sorted order
    const isSorted = JSON.stringify(currentIngredients) === JSON.stringify(sortedIngredients);
  console.log(isSorted)
    // If already sorted, revert to the original order
    const newIngredients = !isSorted ? sortedIngredients : [...currentIngredients].reverse();
    console.log(newIngredients)
    // Update the recipe ingredients in the state
    model.state.recipe.ingredients = newIngredients;
  
    // Render the updated recipe view
    recipeView.update(model.state.recipe);
  };
  
  
  


const init = function(){
  recipeView.addShareButton(shareModal)
  bookmarksView.addHandlerRender( controlBookmarks)
  recipeView.addHendlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHanlderAddBookmark(controlAddBookmark)
  searchView.addHendlerSearch(controlSearchResults)
  resultsView.sort(controlSortRecipes)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView._addHanlderUpload(controlAddRecipe)
  recipeView.addHandlerSortIngredients(controlSortIngredients);

console.log("Nedim")
}
init();
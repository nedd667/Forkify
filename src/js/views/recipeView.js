import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = "We could not find that recipe. Please try another one!";
  _message = '';

  addShareButton(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btnShare = e.target.closest('.share');
      console.log(btnShare)
      if (!btnShare) return;
      handler();
    });
  }

  addHandlerSortIngredients(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--sort-ingredients');
      if (!btn) return;
      handler();
    });
  }

  checkVegetarian(recipeTitle, ingredients) {
    const keywords = ['beef', 'bacon', 'chicken', 'tuna', 'prosciutto'];
  
    // Convert recipe title and ingredients to lowercase for case-insensitive matching
    recipeTitle = recipeTitle.toLowerCase();
    ingredients = ingredients.map(ingredient => ingredient.description.toLowerCase());
  
    for (let word of keywords) {
      if (recipeTitle.includes(word) || ingredients.includes(word)) {
        // Non-vegetarian ingredient is found
        return false;
      }
    }
  
    // No non-vegetarian ingredients are found
    return true;
  }
  
 
    addHendlerRender(handler){
      ['hashchange','load'].forEach(ev => window.addEventListener(ev,handler))

    }
    addHandlerUpdateServings(handler){
      this._parentElement.addEventListener('click',function(e){
        const btn = e.target.closest('.btn--update-servings')
        if(!btn) return;

        const updateTo = +btn.dataset.updateTo
       if(updateTo > 0)handler(updateTo)
      })
    }
    addHanlderAddBookmark(handler){
      this._parentElement.addEventListener('click',function(e){
        const btn = e.target.closest('.btn--bookmark')
        if(!btn) return
        handler()
      })
    }



    // ////////////////////////////////////////////////////
  
    
    

  
// this is from the task ✅✅✅✅✅✅✅✅✅
_generateMarkup() {

  const isVegetarian = this.checkVegetarian(this._data.title, this._data.ingredients);

  // Check if the recipe is vegetarian
  return `
  <figure class="recipe__fig">
    <img src="${this._data.image}" alt="${
  this._data.title
}" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to="${
          this._data.servings - 1
        }">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to="${
          this._data.servings + 1
        }">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>
    <button class="btn share">Share</button>

      <div id="shareModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2 class="share-options">Share Options</h2>
          <ul>
          <div class="social-media">
          <button onclick=location.href='https://www.instagram.com/' class="instagram social-media-btn"><i class="fab fa-instagram"></i></button>
          <button onclick=location.href='https://www.twitter.com/' class="twitter social-media-btn"><i class="fab fa-twitter"></i></button>
          <button onclick=location.href='https://www.facebook.com/'  class="facebook social-media-btn"><i class="fab fa-facebook-f"></i></button>
          <button onclick=location.href='https://www.whatsapp.com/' class="whatsapp social-media-btn"><i class="fab fa-whatsapp"></i></button>
          </div>
          </ul>
        </div>
      </div>

    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
  this._data.bookmarked ? '-fill' : ''
}"></use>
      </svg>
    </button>
  </div>
  ${isVegetarian ? '<div class="heading--2 recipe__label">Vegetarian</div>' : ''}

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <button class="btn btn--sort-ingredients">Sort Ingredients</button>

    <ul class="recipe__ingredient-list">
      ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>
`;
}

_generateMarkupIngredient(ing) {
return `
<li class="recipe__ingredient">
  <svg class="recipe__icon">
    <use href="${icons}#icon-check"></use>
  </svg>
  <div class="recipe__quantity">${
    ing.quantity ? new Fraction(ing.quantity).toString() : ''
  }</div>
  <div class="recipe__description">
    <span class="recipe__unit">${ing.unit}</span>
    ${ing.description}
  </div>
</li>
`;
}

 
}

export default new RecipeView()
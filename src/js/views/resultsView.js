import View from "./View.js";
import perviewView from "./perviewView.js";
import icons from 'url:../../img/icons.svg'


class ResultView extends View{
    _parentElement = document.querySelector('.results')
    _errorMessage = "No recipes found for your query! Please try again ;)";
    _message = '';



    sort(data){
        this._parentElement.addEventListener('click', function (e) {
          const btn = e.target.closest('.btn--sort-recipes');
          if (!btn) return;
          data();
        });
      }

    
    _generateMarkup(){

        return `
        <button class="btn  btn--sort-recipes"> 
      <span>Sort</span></button>

        `+this._data.map(result => perviewView.render(result,false)).join("")

    }


}
export default new ResultView();
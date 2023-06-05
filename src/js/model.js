import { async } from "regenerator-runtime"
import { API_URL,RES_PER_PAGE,KEY } from "./config"
// import { getJSON , sendJSON} from "./heplers"
import { AJAX} from "./heplers"
// import { sort } from "core-js/core/array"

const labelWelcome = document.querySelector(".welcome");
const btnLogin = document.querySelector(".login__btn");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const containerApp = document.querySelector(".container");
// const login = document.querySelector('.login__input')
// const btnremove = document.querySelector('.login__bt n')

const account1 = {
    owner: "Nedim Asani",
    pin: 1111,
}
const account2 = {
    owner: "Jonas Schmedman",
    pin: 2222,
}
const accounts = [account1,account2]

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
      acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
    });
  };
  createUsernames(accounts);
let currentAccount

btnLogin.addEventListener('click',function(e){
    e.preventDefault()

  currentAccount =  accounts.find(
    acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount)
    if(currentAccount.pin === Number(inputLoginPin.value)){
        console.log("Login")
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
        containerApp.style.opacity = 100;
        inputLoginUsername.value = '';
        inputLoginPin.value = ''; 
        btnLogin.style.opacity = 0;
        inputLoginUsername.style.opacity = 0;
        inputLoginPin.style.opacity = 0;
    }
})
export const state = {
    recipe:{},
    search:{
       query: '',
       results: [],
       page: 1,
       resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

    const createRecipeObject = function(data){
        const  {recipe} = data.data;
        return {
             id: recipe.id,
             title: recipe.title,
             publisher: recipe.publisher,
             sourceUrl:recipe.source_url,
             image: recipe.image_url,
             servings: recipe.servings,
             cookingTime: recipe.cooking_time,
             ingredients: recipe.ingredients,
           ...(recipe.key &&  {key: recipe.key}),
             
         }
    }

export const loadRecipe = async function(id){
    try{
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
        state.recipe = createRecipeObject(data)
       
        
       
        if(state.bookmarks.some(bookmark =>bookmark.id === id))
        state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        console.log(state.recipe)
    }catch(err){
        // Temp error handling
        console.error(`${err} 💥💥💥💥💥 `)
        throw err;
    }
}


export const loadSerachResults = async function(query){

    try{
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
        // console.log(data)


          

        state.search.results = data.data.recipes.map(rec =>{
            return{
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
            ...(rec.key &&  {key: rec.key}),
            }
        })
 
        state.search.page = 1;
      
    }catch(err){
        console.error(`${err} 💥💥💥💥💥 `);
        throw err;

    }
}


export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page
    
    const start = (page -1) * state.search.resultsPerPage;   //0;
    const end =  page * state.search.resultsPerPage;   //9;
    
    return state.search.results.slice(start,end)
}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe){
    //add Bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks()
}
export const deleteBookmark = function(id){
    // Delete Bookmark
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index,1)

    // Mark current recipe as NOT bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false

    persistBookmarks()
}   

const init = function(){
     const storage = localStorage.getItem('bookmarks');
     if(storage) state.bookmarks = JSON.parse(storage)
}

init();

const clearBookmarks = function(){
    localStorage.clear('bookmarks')
}

// clearBookmarks()

// export const uploadRecipe = async function(newRecipe){
//     try{

//         // console.log(Object.entries(newRecipe))
//         const ingredients = Object.entries(newRecipe)
//         .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== ''
//             ).map(ing => {
//                 const ingArr = ing[1].split(',').map(el => el.trim())
//                 // const ingArr = ing[1].replaceAll(' ','').split(',');
//                 if(ingArr.length !== 3)
//                 throw new Error(
//                     "Wrong ingridient fromat. Please use the correct format :)")
                    
//                     const [quantity,unit,description] = ingArr;
                    
//                     return {quantity: quantity ? +quantity: null,unit,description}

                   
//                 })

//                 const recipe = {
//                     title: newRecipe.title,
//                     source_url: newRecipe.sourceUrl,
//                     image_url: newRecipe.image,
//                     publisher: newRecipe.publisher,
//                     cooking_time: +newRecipe.cookingTime,
//                     servings: +newRecipe.servings,
//                     ingredients,
//                 }
//            const data = await AJAX(`${API_URL}?key=${KEY}`,recipe);
//                 state.recipe = createRecipeObject(data);
//                 addBookmark(state.recipe)
//         }catch(err){
//                 throw err;
//             }


        
// }
export const uploadRecipe = async function(newRecipe) {
  try {
    const validateURL = function(url) {
      // Regular expression to validate URL format
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      return urlRegex.test(url);
    };

    const validateTitle = function(title) {
      return typeof title === 'string' && title.trim() !== '';
    };

    const validateFields = function() {
      const urlValid = validateURL(newRecipe.sourceUrl) && validateURL(newRecipe.image);
      const titleValid = validateTitle(newRecipe.title);

      return urlValid && titleValid;
    };

    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3) {
          throw new Error("Wrong ingredient format. Please use the correct format :)");
        }

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    if (validateFields()) {
      const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
      state.recipe = createRecipeObject(data);
      addBookmark(state.recipe);
    } else {
      throw new Error('Invalid fields. Please make sure all fields are filled correctly.');
    }
  } catch (err) {
    throw err;
  }
};

  
class searchView{

    _parrentEl = document.querySelector('.search')

    getQuery(){
        const query =  this._parrentEl.querySelector('.search__field').value;   
        // this._clearInput();

        return query;
    }
    
    _clearInput(){
        this._parrentEl.querySelector('.search__field').value = ''
    }




    addHendlerSearch(handler){
        this._parrentEl.addEventListener('keyup',function(e){
            e.preventDefault();
            handler()
            
        })
    }

}
export default new searchView();
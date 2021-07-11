// CREATING 3 MODULES FOR THE APP COMPONENTS(i.e drafting the architecture of the APP)

// BUDGET CONTROLA
let budgetControla = (function (){
   
})();



// UI CONTROLA
let UiControla = (function(){

})();



// A Third Module to link the TWO modules together APP-CONTROLA
let appControla = (function(budgetCtrl,UiCtrl){

    let addItem = function () {
        // 1. Get the input filed data from the user
        // 2. Add it to the budget controla
        // 3. Add the item to the UI 
        // 4. Calculate the budget
        // 5. Display the budget on the UI
        console.log('God is the greatest')

    }

    document.querySelector('.btn-add').addEventListener('click', addItem);

    document.addEventListener ('keypress', function (event) {
        if(event.keyCode === 13 || event.which ===13){

            addItem()
        }
    })
   
})(budgetControla,UiControla);

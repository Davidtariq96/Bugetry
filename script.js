// CREATING 3 MODULES FOR THE APP COMPONENTS(i.e drafting the architecture of the APP)

// BUDGET CONTROLA
let budgetControla = (function (){

    let Expense = function (id, description, value ){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    let Income = function (id, description, value ){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calTotal = function (type){
       let sum = 0;
        data.allItems[type].forEach (function (cur){
            sum += cur.value;
        })
        data.total[type] = sum;
    };
   
    let data = {
        allItems : {
            exp: [],
            inc: []
        },
        total : {
            exp: 0,
            inc: 0
        },
        budget : 0,
        percentage : -1
    };



    return {
        addItem : function (type, des, val){
            let newItem, ID;
            // Creating the ID of a new item added 
            if (data.allItems[type].length !== 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else{
                ID = 0;
            }
            
            // Creating new item based on 'inc' or 'exp'
            if (type === "exp"){
                newItem = new Expense (ID, des, val);
            } else if (type === "inc") {
                newItem = new Income (ID, des, val);
            }
            // Adding the new item to our Data structure 
            data.allItems[type].push(newItem);
            // returning the value so other methods can use outside this function 
            return newItem;
        },

        deleteItem : function ( type, id) {
            let ids, index;

            ids = data.allItems[type].map( function (current) {
                return current.id;
            })

            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calBudget: function () {
            // Calculate Income and Expenses
            calTotal("exp");
            calTotal("inc");

            // Calculate the budget = Income - Expense
             data.budget = Math.round( data.total.inc - data.total.exp );

            // Calculate the percentage of Income spent
            if (data.total.inc !== 0 ){
                 data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else{
                data.percentage = -1;
            }
        },

        getBudget : function () {
            return{
                budget : data.budget,
                totalInc : data.total.inc,
                totalExp : data.total.exp,
                percentage : data.percentage
            }
        },

        testing : function () {
            console.log(data)
        }
       
    };   

})();
budgetControla.testing();




// UI CONTROLA
let UiControla = (function(){

    let DOMstrings = {
        inputTypes: '.add-type',
        inputDescrip: '.add-description',
        inputValue: '.value',
        inputBtn: '.btn-add',
        incomeContainer : '.income-list',
        expenseContainer : '.expense-list',
        budgetLabel : '.budget-value',
        incomeLabel : '.income-value',
        expenseLabel : '.expenses-value',
        percentageLabel : '.expenses-percentage',
        container: '.flex-items'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputTypes).value, /*either inc or exp */
                description: document.querySelector(DOMstrings.inputDescrip).value,
                value: parseFloat (document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addItemList: function(obj, type) {
            let HTML, newHTML;
            // Create HTML strings with placeholder texts
            if(type === "inc"){
                element = DOMstrings.incomeContainer;
                HTML = '<div class="income-heroText-1" id="inc-%id%"> <div class="income-description">%description%</div><div class="clear-right"><div class="clear-right-value">%value%</div> <div class="clear-right-delete"><button class="del"><ion-icon name="close-circle-outline" class="del-btn-1"></ion-icon></button></div> </div></div>'
            } else if (type === "exp"){
                element = DOMstrings.expenseContainer;
                HTML = '<div class="expense-heroText-1" id="exp-%id%"><div class="expense-description">%description%</div><div class="clear-right-ex"><div class="clear-right-value1">%value%</div><div class="expenses-percentage-1">35%</div><div class="clear-right-delete"><button class="del"><ion-icon name="close-circle-outline" class="del-btn"></ion-icon></button></div></div></div>'
            }
            // Replace HTML with actual data
            newHTML = HTML.replace('%id%',obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value)


            // Inserts it into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)

        },

        deleteItemList: function (selectID) {
            let el = document.getElementById(selectID);

            el.parentNode.removeChild(el)
        }, 

        clearFields: function (){
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescrip + ', ' + DOMstrings.inputValue);
            // querySelectorAll returns a list so we use array prototypes to convert to an array

            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function (current, index , array) {
                current.value = "";
            });
            fieldsArr[0].focus();

        },

        displayBudget: function (objs) {
            document.querySelector(DOMstrings.budgetLabel).textContent = objs.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = objs.totalInc
            document.querySelector(DOMstrings.expenseLabel).textContent = objs.totalExp
            
            if(objs.percentage > 0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent = objs.percentage + '%'
            } else{
                document.querySelector(DOMstrings.percentageLabel).textContent = "---"
            }
        },

        getDOMstrings: function (){
            return DOMstrings;
        }
    }

})();





// A Third Module to link the TWO modules together APP-CONTROLA
let appControla = (function(budgetCtrl,UiCtrl){

    let setEventListeners = function () {
        let DOM = UiCtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener ('keypress', function (event) {
        if(event.keyCode === 13 || event.which ===13){

            ctrlAddItem()
         }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    let updateBudget = function () {
        // 1. Calculate the budget
        budgetControla.calBudget()
        // 2. Return the budget 
        let budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UiCtrl.displayBudget(budget)
        // console.log(budget)
    }

    let ctrlAddItem = function () {
        let input, newItem;
        // 1. Get the input filed data from the user
         input = UiCtrl.getInput();

         if(input.description !== "" && !isNaN(input.value) && input.value > 0){
                // 2. Add it to the budget appcontrola
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            // 3. Add the item to the UI 
            UiCtrl.addItemList(newItem, input.type);

            // clear the input fields
            UiCtrl.clearFields();

            // Update the budget after calculations
            updateBudget();
         }
        
        
    };

    let ctrlDeleteItem = function ( event ) {
        let itemID, splitID , type, ID;
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
        

        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt (splitID[1]);
            
            // Delete item from Data-structure 
            budgetControla.deleteItem(type, ID)
            // Delete from the UI
            UiCtrl.deleteItemList(itemID);
            // Then Upadte and show the Budget
            updateBudget();
        }
    }

    return {
        init: function () {
            UiCtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            });
            console.log('application has started')
            setEventListeners();
        }
    }
   
})(budgetControla,UiControla);

appControla.init();

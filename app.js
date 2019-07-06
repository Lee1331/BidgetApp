//BUDGET CONTROLLER
let budgetController = (function(){
    
})()

//USER INTERFACE CONTROLLER
let UIController = (function(){
    //
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value, 
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: () => {
            return DOMStrings
        }
    }    
})()

//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem()        
            }
        })
    }


    let ctrlAddItem = function(){
        // 1 - get data from input field
        let input = UICtrl.getInput();

        //2 - add item to budgetController

        //3 - add item to the UI

        //4 - calculate the budget

        //5 - display the budget on the UI
    }

    return {
        init: () => {
            setupEventListeners()
        }
    }

})(budgetController, UIController)

controller.init()
//BUDGET CONTROLLER
let budgetController = (function(){
    
    let Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    } 

    let Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    } 

    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals:{
            exp: 0,
            inc: 0,
        }
    }

    return{
        addItem: (type, desc, val) => {
            let newItem, ID
            
            //Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, desc, val)
            } else if (type === 'inc'){
                newItem = new Income(ID, desc, val)
            }

            //push the new item into our data structure
            data.allItems[type].push(newItem)
            
            //return the new element
            return newItem
        }
        
    }
})()

//USER INTERFACE CONTROLLER
let UIController = (function(){
    //
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value, 
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },

        addListItem: (obj, type) => {
            let html, newHtml, element

            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp'){   
                element = DOMStrings.expensesContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace text with actual data from the object
            newHtml = html.replace('%id%', obj.id) 
            newHtml = html.replace('%description%', obj.description) 
            newHtml = html.replace('%value%', obj.value) 

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },  

        getDOMStrings: () => {
            return DOMStrings
        }
    }    
})()

//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMStrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem()        
            }
        })
    }


    let ctrlAddItem = function(){
        let input, newItem

        // 1 - get data from input field
        input = UICtrl.getInput()

        //2 - add item to budgetController
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        //3 - add item to the UI
        UIController.addListItem(newItem, input.type)
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
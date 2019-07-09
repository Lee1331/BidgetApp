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

    let calculateTotal = function(type){
        let sum = 0
        data.allItems[type].forEach(currentValue => {
            sum += currentValue.value
        });
        data.totals[type] = sum
    }

    //-1 is often used to indicate that something is non-existant
    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals:{
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
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
        },
        calculateBudget: () => {
            //calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')
            
            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            //caculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            }else {
                data.percentage = -1
            }

            //Expense = 100 and income = 200, spent 50% = 100/200 = 0.5 * 100 = 50
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
       
        
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value, 
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: (obj, type) => {

            let html, newHtml, element
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = DOMStrings.incomeContainer
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
            },  

        clearFields: () => {
            let fields, fieldsArr
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)
            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach((currentValue, index, array) => {
                currentValue.value = ''
            });

            //select the description so that when the user enters a new income or expense, the app defaults back to the description field instead of the value field
            fieldsArr[0].focus()
        },
     
        displayBudget: function(obj) {
            let type
            obj.budget > 0 ? type = 'inc' : type = 'exp'
            
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---'
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
        let DOM = UICtrl.getDOMStrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem()        
            }
        })
    }

    let updateBudget = function(){

        //1 - Calculate budget
        budgetCtrl.calculateBudget()

        //2 - return budget
        let budget = budgetCtrl.getBudget()

        //6 - display the budget on the UI
        UICtrl.displayBudget(budget)

    }

    let ctrlAddItem = function(){
        let input, newItem

        // 1 - get data from input field
        input = UICtrl.getInput()

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){

            //2 - add item to budgetController
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            
            //3 - add item to the UI
            UICtrl.addListItem(newItem, input.type)
            
            //4 - clear the fields
            UICtrl.clearFields()
            
            //5 - calculate and update budget
            updateBudget()
        }
    }

    return {
        init: () => {
            
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            })
            setupEventListeners()
        }
    }

})(budgetController, UIController)

controller.init()
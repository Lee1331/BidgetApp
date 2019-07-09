//BUDGET CONTROLLER
let budgetController = (function(){
    
    let Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1 //set this to be initially undefined
    } 

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage
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
        deleteItem: (type, id) => {
            let ids, index

            //create a new array containing all the IDs
            ids = data.allItems[type].map(current => current.id)
            
            //get the index of the id in the new array
            index = ids.indexOf(id)

            //if the index is in the array
            if(index !== -1){
                //to delete index, goto the index in the array, and remove 1 item
                data.allItems[type].splice(index, 1)
            }

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

        caculatePercentages: () => {
            /*
            expense1 = 10 
            expense2 = 20 
            expense3 = 30
            income = 100
            expense1 = 10/100 = 10% 
            expense2 = 20/100 = 20%
            expense3 = 30/100 = 30%
            */

            data.allItems.exp.forEach((current) => current.calcPercentage(data.totals.inc))

        },
        
        // getPercentages: () => data.allItems.exp.map((current) => current.getPercentage()),
        getPercentages: () => {
            let allPercentages = data.allItems.exp.map((current) => current.getPercentage())
            return allPercentages
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
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
            
        deleteListItem: (selectorID) => {
            let element

            element = document.getElementById(selectorID)
            element.parentNode.removeChild(element)

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
        displayPercentages: (percentages) => {
            let fields

            fields = document.querySelectorAll(DOMStrings.expensesPercLabel)

            let nodeListForEach = (list, callback) => {
                for (let i = 0; i < list.length; i++){
                    //p1 = current, p2 = index
                    callback(list[i], i)
                }
            }
            
            nodeListForEach(fields, (current, index)=> {
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%'
                } else{
                    current.textContent = '---'
                }
            })
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    let updateBudget = function(){

        //1 - Calculate budget
        budgetCtrl.calculateBudget()

        //2 - return budget
        let budget = budgetCtrl.getBudget()

        //6 - display the budget on the UI
        UICtrl.displayBudget(budget)

    }

    let updatePercentages = function(){
        //1 - Calculate percentages
        budgetCtrl.caculatePercentages()

        //2 - read percentages form the budget controller
        let percentages = budgetCtrl.getPercentages()

        //3 - update the UI with the new percentages
        UICtrl.displayPercentages(percentages)
        
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

            //6 - calculate and update percentages
            updatePercentages()
        }
    }

    //the event parameter will allow us to access the target element
    let ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID

        // console.log(event.target) - get target element
        // console.log(event.target.parentNode) - get target elements parent
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemID){
            //the id for each income/expense list item is formatted as 'inc/exp-{index}' - i.e. - inc-0, exp-3
            //by using split, we can seperate up to the '-' to get the number of each element, and the type as seperate strings
            splitID = itemID.split('-') //returns ['type', 'id']
            type = splitID[0]
            ID = parseInt(splitID[1])

            //1 - delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)

            //2 - delete the item from the UI
            UICtrl.deleteListItem(itemID)

            //3 - update and show the new budget
            updateBudget()

            //4 - calculate and update percentages
            updatePercentages()
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
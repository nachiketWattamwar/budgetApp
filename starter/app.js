var budgetController = (function() {
                               
    //function object.
    var Expense = function(id,description,value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
        
    };
    
    var Income = function(id,description,value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
        
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum+=curr.value;
            
        });
            data.totals[type] = sum;
    };
    
    var data = { 
        allItems:{
            exp:[],
            inc:[]
        },
        
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    
    return {
        addItem: function(type,description,value){
            var newItem;
            var ID;
            
            //create new ID
            if (data.allItems[type].length > 0)
                {
                    ID = data.allItems[type][data.allItems[type].length-1].id + 1;
                    
                }
            else{
                ID = 0;
            }
            
            //create new item based on ID
            if(type === 'exp')
                {
                    
                    newItem = new Expense(ID,description,value);
                }
            else
                {
                    newItem = new Income(ID,description,value);
                }
            
            data.allItems[type].push(newItem);
            //return new item
            return newItem;
            
        },
        
        calculateBudget: function(){         
            //calculate income and expense
            
            calculateTotal('inc');
            calculateTotal('exp');
            
            //calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of  income we spent
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
        
    },
        
        deleteItem: function(type,id){
            var ids,index;
            
            ids = data.allItems[type].map(function(current){
                return current.id;
                
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1)
                {
                    data.allItems[type].splice(index,1);
                }
            
        },
        
        getBudget:function(){
            return{
                budget: data.budget,
                percent: data.percentage,
                totalIncome:data.totals.inc,
                totalExp:data.totals.exp
            };
            
        },
        testing:function()
        {
        console.log(data);
        }
    };
                        
})();


var UIcontroller = (function() {
                
        var DOMStrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            addButton: '.add__btn',
            incomeList: '.income__list',
            expenseList: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container:'.container'
        };
        
        return {
            getInput:function(){
                
            return{
                
             type: document.querySelector(DOMStrings.inputType).value,
             description: document.querySelector(DOMStrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
                };
            },  
            
            addItemList:function(obj,type)
            {
                var html;
                var element;
                if (type === 'inc')
                {
                    element = DOMStrings.incomeList;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                else
                {
                
                element = DOMStrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                
                newHtml = html.replace('%id%',obj.id);
                newHtml = newHtml.replace('%description%',obj.description);
                newHtml = newHtml.replace('%value%',obj.value);
                
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            },
            
            
            deleteItem:function(selectorID){
            
                var el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);
            
            
        },
            clearFields:function(){
                var fields;
                var fieldsArr;    
                fields = document.querySelectorAll(DOMStrings.inputDescription+', '+DOMStrings.inputValue);
                
                fieldsArr = Array.prototype.slice.call(fields);
                
                fieldsArr.forEach(function(current,index,array){
                    current.value = '';
                    
                });
            },
            
            displayBudget: function(obj){
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
                document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
                
                if(obj.percent > 0)
                {
                    document.querySelector(DOMStrings.percentageLabel).textContent = obj.percent + '%';
                            
                }
                else
                {
                    document.querySelector(DOMStrings.percentageLabel).textContent = '---';
                        
                }
                
            },
            
            DOMStringsFunction:function(){
                return DOMStrings;
            }
                   
        };
                    
})();


var controller = (function(budgetCtlr,UICtlr) {                  
    
    var setupEventListener = function(){
        
    var DOMstring = UICtlr.DOMStringsFunction();
    document.querySelector(DOMstring.addButton).addEventListener('click',ctrlAddItem);
    document.querySelector(DOMstring.container).addEventListener('click',ctrlDeleteItem);
    //event listener when keyboard is pressed.
    document.addEventListener('keypress',function(event){
        
        if (event.keyCode === 13) 
            {
                //console.log("inside key");
                ctrlAddItem();
            }      
    });       
    };
    
    var updateBudget = function(){
      
        
        budgetCtlr.calculateBudget(); 
        
        var budget = budgetCtlr.getBudget();
        
        //console.log(budget);
        
        UICtlr.displayBudget(budget);
        
        
        
    };
    
    var ctrlAddItem = function(){
        
        //1. get input fields
        var input = UICtlr.getInput(); 
        //console.log(input);
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
        //2. add item to budget controller
            var newItem = budgetCtlr.addItem(input.type,input.description,input.value);
        
        //3. adding into UI
            UICtlr.addItemList(newItem,input.type);
            UICtlr.clearFields();
            
            updateBudget();
        }
            
        
    };
    
    var ctrlDeleteItem = function(event){
        console.log(event);
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var splitID;
        var type;
        var ID;
        if(itemID)
            {
                splitID = itemID.split('-');
                type = splitID[0];
                ID = parseInt(splitID[1]);
                
                // delete from DS
                
                budgetCtlr.deleteItem(type,ID);
                
                //delete from UI
                UICtlr.deleteItem(itemID);
                
                
                // update n show new budget
                
                updateBudget();
            }
        
    };
    
    return {    
        init:function(){
        console.log('Application has started.');
        setupEventListener();
        UICtlr.displayBudget({
                budget: 0,
                percent: -1,
                totalIncome: 0,
                totalExp: 0
            });
    }
    };

        })(budgetController,UIcontroller);

    controller.init();




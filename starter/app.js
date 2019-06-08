var budgetController = (function() {
                               
    //function object.
    var Expense = function(id,description,value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
        
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0)
            {
            this.percentage = Math.round((this.value/totalIncome)*100);
            console.log('percent is '+this.percentage);
            }
        else
            {
                this.percentage = -1;
            }
    };
    
    Expense.prototype.getPercentage = function(){
    
            return this.percentage;
    
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
        calculatePercentages:function(){
            
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
               
        },
        
        allPercentages:function(){
            
            var allPer = data.allItems.exp.map(function(curr){
            return curr.getPercentage();    
            });
            
            return allPer;
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
            container:'.container',
            expensePercLabel:'.item__percentage',
            monthLabel:'.budget__title--month'
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
            },
         
            displayPercLabel:function(percentages   ){
                var fields = document.querySelectorAll(DOMStrings.expensePercLabel);
                
                
                var nodeListForEach = function(list,callback){
                    for(var i =0;i<list.length;i++)
                        {
                            callback(list[i],i);
                        }
                };
                nodeListForEach(fields,function(current,index){
                    if(percentages[index] > 0)
                        {
                        current.textContent = percentages[index] + '%';
                            
                        }
                    else
                        {
                            current.textContent = '---';
                        }
                    
                });
            },
            numberFormat:function(num,type){
                
                num = Math.abs(num);
                num = num.toFixed(2);
                console.log(num);
                
                
            },
            changedType:function(){
                
                
                var fields = document.querySelectorAll(
                DOMStrings.inputType+','+
                DOMStrings.inputDescription+','+
                DOMStrings.inputValue
                    
                );
                
                
            },
            displayMonth:function(){
                var now = new Date();
                var year;
                var month;
                var months = ['Jan','Feb','March','April','May','June','July','Aug','Sep',' Oct','Nov','Dec'];
                month = now.getMonth();
                year = now.getFullYear();
                document.querySelector(DOMStrings.monthLabel).textContent = months[month]+" "+year;
            }
        };
                    
})();


var controller = (function(budgetCtlr,UICtlr) {                  
    
    var setupEventListener = function(){
        
    var DOMstring = UICtlr.DOMStringsFunction();
    document.querySelector(DOMstring.addButton).addEventListener('click',ctrlAddItem);
    document.querySelector(DOMstring.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(DOMstring.inputType).addEventListener('change',UICtlr.changedType);
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
    
    
    var updatePercentages = function(){
        
        //1. update percentages from budget.
        budgetCtlr.calculatePercentages();
        
        //2. get new budget.
        
        var percentages = budgetCtlr.allPercentages();
        //3. Update the UI.
        //console.log(percentages);
        
        UICtlr.displayPercLabel(percentages);
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
            
        //4. updating budget
            updateBudget();
            
        //5. updating the percentages.
            updatePercentages();
            
            
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
                
                
                //1. delete from DS
                budgetCtlr.deleteItem(type,ID);
                
                //2. delete from UI
                UICtlr.deleteItem(itemID);
                
                //3. update n show new budget
                updateBudget();
                
                //4. update the percentages.
                updatePercentages();
            }
        
    };
    
    return {    
        init:function(){
        console.log('Application has started.');
        setupEventListener();
        UICtlr.displayMonth();
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




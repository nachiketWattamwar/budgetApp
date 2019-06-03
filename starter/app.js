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
    
    
    var data = { 
        allItems:{
            exp:[],
            inc:[]
        },
        
        totals:{
            exp: 0,
            inc: 0
        }
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
            expenseList: '.expenses__list'
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
                    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                else{
                
                element = DOMStrings.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                
                newHtml = html.replace('%id%',obj.id);
                newHtml = newHtml.replace('%description%',obj.description);
                newHtml = newHtml.replace('%value%',obj.value);
                
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
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
            
            DOMStringsFunction:function(){
                return DOMStrings;
            }
            
            
            
        };
                    
})();


var controller = (function(budgetCtlr,UICtlr) {
                  
    
    var setupEventListener = function(){
        
    var DOMstring = UICtlr.DOMStringsFunction();
    document.querySelector(DOMstring.addButton).addEventListener('click',ctrlAddItem);
    
    //event listener when keyboard is pressed.
    document.addEventListener('keypress',function(event){
        
        if (event.keyCode === 13) 
            {
                //console.log("inside key");
                ctrlAddItem();
            }      
    });       
    };
    
    var ctrlAddItem = function(){
        
        //1. get input fields
        var input = UICtlr.getInput(); 
        //console.log(input);
        
        
        if(input.description !== "" && isNaN(input.value))
            {
                
        //2. add item to budget controller
        var newItem = budgetCtlr.addItem(input.type,input.description,input.value);
        
        //3. adding into UI
        UICtlr.addItemList(newItem,input.type);
        UICtlr.clearFields();
            }
        
        else{
            alert("Please enter valid description and value.");
        }
        
        
        
    };
    
    return {    
        init:function(){
        console.log('Application has started.');
        setupEventListener();
    }
    };

        })(budgetController,UIcontroller);

    controller.init();




'use strict';

// var AWS = require('aws-sdk');  this should be used in prod
var Alexa = require('alexa-sdk');
var nutritionixAPI = require('./nutritionixAPI');

var APP_ID = undefined;
var SKILL_NAME = 'ms_nutrition';

    //Cleaning up the results from the API call and retrieving an especific or multiple nutritional facts
function getSpecificFact(nFact, nutritionalFacts){
    var response = "";
    for(var key in nutritionalFacts){
        if(key.indexOf(nFact) > -1) // if the current index of the nutritional facts data contains the required value then...
        {
            var tempKey = key.replace(/nf_/ig, '');
            tempKey = tempKey.replace(/_/ig,' ')
            console.log(`KEY: ${tempKey}`);
            console.log(`WORD: ${nFact}`);
            if(nutritionalFacts[key] == null) {
                response += 0;
            }
            else{
                response += nutritionalFacts[key];
            }
            if(tempKey.indexOf("calories") > -1){
                response += ` ${tempKey}, `;
            }
            else if(tempKey.indexOf("cholesterol") > -1 || tempKey.indexOf("sodium") > -1){
                response += `mg ${tempKey}, `;
            }
            else { response += `g of ${tempKey}, `}
        }
    }
    response = response.substring(0, response.length-2);
    console.log(`Requested nutritional Fact is = ${response}`);
    var tempIndex = response.lastIndexOf(',');
    if(tempIndex > 0){
        var finalResponse = `${response.slice(0, tempIndex + 1)} and ${response.slice(tempIndex + 1)}`;
        return finalResponse;
    }
    else{
        return response;
    }
}




var WELCOME_MESSAGE = `Welcome to Skye's Nutrition!  You can ask me about information regarding to various types of food, 
                        or you can ask me about the content of particular nutritional fact of a type of food.  What would you like to do?`;
var HELP_MESSAGE = `I know lots of things about Nutrition.  You can ask me about a type of food, and I'll tell you what I know.  
                    You can also ask me about the content of a particular nutritional fact of a type of food, for example, how many calories are in a taco?.  What would you like to do?`;
var EXIT_SKILL_MESSAGE = `Thank you for using Skye's Nutrition! Lets talk soon!`;

var states = {
    START: "_START",
    NUTRITION: "_NUTRITION"
}

const handlers = {
    "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    },
    "GetFoodInfoIntent": function(){
        this.handler.state = states.START;
        this.emitWithState("GetFoodInfoIntent");
    },
    "GetNutritionIntent": function (){
        this.handler.state = states.START;
        this.emitWithState("GetNutritionIntent");
    },
    "AMAZON.HelpIntent": function(){
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function(){
        this.handler.state = states.START;
        this.emitWithState("Start")
    }   
}

var startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function () {
        this.emit(":ask", WELCOME_MESSAGE, HELP_MESSAGE);
    },
    "GetNutritionIntent": function(){
        var item = this.event.request.intent.slots; // Getting slots array from intent??  
        console.log(`The things inside the slots for nutrition are ${JSON.stringify(item, null, 4)}`);

        var nFact = item.NFacts.value;
        console.log(`Requested nutritial fact is ${nFact}`);
        var tFood = item.Food.value;
        console.log(`Requested nutritial fact is ${tFood}`);

        var nutritionixTemp = nutritionixAPI.NutritionixAPI.getInfo(tFood);
        nutritionixTemp.then(value => JSON.parse(value))
        .then(currentInfo => {
                //Saving nutritional facts from returned info
            var nutritionalFacts = currentInfo.hits[0].fields;
            console.log(`Here are all the nutritional Facts ${JSON.stringify(nutritionalFacts,null,4)}`);
             this.emit(":tell", `A ${tFood} contains at least ${getSpecificFact(nFact, nutritionalFacts)}`);
        })
        // this.emit(":tell", "This is a test");
        
    },
    "GetFoodInfoIntent": function(){
        var item = JSON.stringify(this.event.request.intent.slots, null, 4); // Getting slots array from intent??
        
        console.log(`The things inside the slots for food info are ${item}`);
        this.emit(":tell", "This is a test");
        
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
})


//Exports lambda function handlers
exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers, startHandlers);
    alexa.execute();
};

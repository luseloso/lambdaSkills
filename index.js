'use strict';

// var AWS = require('aws-sdk');  this should be used in prod
var Alexa = require('alexa-sdk');
var nutritionixAPI = require('./nutritionixAPI');

var APP_ID = undefined;
var SKILL_NAME = 'ms_nutrition';


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

var startHandlers = Alexa.CreateStateHangler(states.START,{
    "Start": function () {
        this.emit(":ask", WELCOME_MESSAGE, HELP_MESSAGE);
    },
    "GetNutritionIntent": function(){
        var item = getItem(this.event.request.intent.slots); // Getting slots array from intent??
        
        console.log(`The things inside the slots for nutrition are ${item}`);
        this.emit(":tell", "This is a test");
        
    },
    "GetFoodInfoIntent": function(){
        var item = getItem(this.event.request.intent.slots); // Getting slots array from intent??
        
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
    alexa.registerHandlers(handlers, startHandlers, nutritionHandlers);
    alexa.execute();
};

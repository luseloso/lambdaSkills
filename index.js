'use strict';

var AWS = require('aws-sdk');
var nutritionixAPI = require('./nutritionixAPI');


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


function processEvent(event, context, callback) {


    console.log(`incoming event: ${JSON.stringify(event,null,4)}`);
    if (typeof event.Records !== 'undefined') {
        try {
            console.log("Incoming message was JSON");
            var o = JSON.parse(event.Records[0].Sns.Message);
            console.log(JSON.stringify(o,null,4));
            var intent = o.intent;
            var slots = o.slots;
            
            
            var nFact = slots.NFacts.value;
            console.log(`Requested nutritial fact is ${nFact}`);
            var tFood = slots.Food.value;
            console.log(`Requested nutritial fact is ${tFood}`);

            var nutritionixTemp = nutritionixAPI.NutritionixAPI.getInfo(tFood);
            nutritionixTemp.then(value => JSON.parse(value))
            .then(currentInfo => {
                    //Saving nutritional facts from returned info
                var nutritionalFacts = currentInfo.hits[0].fields;
                console.log(`Here are all the nutritional Facts ${JSON.stringify(nutritionalFacts,null,4)}`);
                var response = `A ${tFood} contains at least ${getSpecificFact(nFact, nutritionalFacts)}`;
                callback(null, response);
            })
        } 
        catch (e) {	
            console.log("Incoming message was not JSON");
            callback(null, "There was an error");
        }
    }       
}


exports.handler = (event, context, callback) => {

    processEvent(event, context, callback);
    
};

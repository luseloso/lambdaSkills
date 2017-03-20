//
// File:	nutritionixAPI.js
// Date:	03/20/2017
// Author:	Luis Lopez
// Notes:	Connect to the food API and allow ms_nutrition to request data from it
//
"use strict";
const rp = require('request-promise');
const qs = require('querystring')

class NutritionixAPI
{
    static getInfo(food)
    {
        const options =
        {
            baseUrl: 'https://api.nutritionix.com/v1_1/search',
            qs: 
            {
                "fields":   ["*"],
                "appId": NutritionixAPI.__apID,
                "appKey": NutritionixAPI.__apiKey             
            },
            simple : true,
            useQuerystring : true
            
        };        
        return rp.get(food, options);
    }
}

NutritionixAPI.__apiKey = '697085c6313ed2b30573e2587e1ebb47';
NutritionixAPI.__apID = '0fa655d8';

exports.NutritionixAPI = NutritionixAPI;
# CS4400 - Internet Applications

## Assignment 1

The objective of this first assignment is to develop a simple Internet Application which demonstrates the following:
1. A reactive client running in an Internet Browser using Vue.Js – demonstrating some simple knowledge of the V- directives and mustache syntax and interacting with a Server-Side application using at least one Web API primitive
2. A Server-side application which exposes at least one API primitive and consumes the services of a 3rd party Web API – not able be to do this from the client side due to ‘same-origin’ restrictions.

I am asked to produce an application that inputs the city that someone is planning to go to.  
The server-side should use the openweathermap API to get the weather forecast for that city for the next 5 days.  
I should then display for the user some summary information including:
1. Packing: if there is rain anytime over the next 5-days indicate that the user should bring an umbrella
2. Indicate whether the user should pack for Cold (temp range -10..+10), Warm (+10-+20) or Hot (20+)
3. Give a summary table for the next 5 days showing: Temperature, Wind Speed and Rainfall level

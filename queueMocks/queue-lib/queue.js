"use strict";

let items = []
const enqueue = (element) =>
{     
    // adding element to the queue 
    items.push(element); 
    try
    {
        console.log(`Enqueue object ${JSON.stringify(element)} to queue`)
    }
    catch(e){}
} 

function dequeue() 
{ 
    // removing element from the queue 
    // returns underflow when called  
    if(isEmpty()) 
        return "Underflow"; 
     
    let result = items.shift(); 
    try
    {
        console.log(`Dequeue object '${JSON.stringify(result)}' from queue`)
    }
    catch(e){}

    return result; 
} 

function front() 
{ 
    // returns the Front element of  
    // Dequeue without removing it. 
    if(isEmpty()) 
        return "No elements in Queue"; 
    return items[0]; 
} 

function isEmpty() 
{ 
    return items.length == 0; 
} 

module.exports = {
    isEmpty,
    front,
    dequeue,
    enqueue
}

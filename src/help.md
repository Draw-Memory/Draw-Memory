# Help map

let numbers = [-1, 2, -3, 4, -5];
let positiveNumbers = numbers.map(num => num > 0 ? num : undefined);
console.log(positiveNumbers); // [undefined, 2, undefined, 4, undefined]

In this example, we declare an array of numbers [-1, 2, -3, 4, -5]. 
We then use the map() method to create a new array 
called positiveNumbers by applying 
a callback function to each element of the original array. 
The callback function checks if the current element is greater than 0. 
If it is, the function returns the element. 
If it isn’t, the function returns undefined. 
The resulting array positiveNumbers 
contains only the elements that are greater than 0, 
ith the other elements replaced by undefined.
# Javascript
## Help map

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
# SQLite
## Help INSERT INTO
sqlite3 library in Node.js to run an SQL command.
A complete SQL INSERT statement with sqlite3 in Node.js should look something like this:

JavaScript

db.run("INSERT INTO table_name (column1, column2, column3, ...) VALUES (?, ?, ?, ...)", [value1, value2, value3, ...], function(err) {
  if (err) {
    return console.log(err.message);
  }
  // get the last insert id
  console.log(`A row has been inserted with rowid ${this.lastID}`);
});
AI-generated code. Review and use carefully. More info on FAQ.
Please replace table_name with the name of your table, and column1, column2, column3, ... with the names of the columns you want to insert data into. Similarly, replace value1, value2, value3, ... with the corresponding values you want to insert.

The ? in the VALUES clause are placeholders for the values you want to insert, and they are replaced by the values in the array [value1, value2, value3, ...]. This is done to avoid SQL injection attacks.
# Glitch
## Save a p5.js drawing as an array of points in a database with Glitch without using a file.

### Capture the drawing: As the user draws on the canvas, capture the x and y coordinates of the points. You can do this by pushing the points into an array in the mouseDragged function.
JavaScript

let points = [];
function mouseDragged() {
  points.push(createVector(mouseX, mouseY));
}

### Send the drawing to the server: Now, you need to send this data to a server where it can be stored in a database. Glitch provides a simple way to host both the front-end and back-end code for your project. You can use the fetch API to send a POST request to your server with the drawing data.

JavaScript

async function uploadDrawing() {
  const response = await fetch('/api', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(points)
  });
  const data = await response.json();
  console.log(data.status);
}

### Server-side code: On the server side, you can use Express.js to handle the POST request and save the data in a database. Here’s a basic example of how you might handle the POST request in your server.js file on Glitch:

JavaScript

app.post('/api', (request, response) => {
  const data = request.body;
  database.insert(data);
  response.json({points: data,timestamp: Date.now()});
});

### The uploadDrawing() function can be called when you want to send the drawing data to the server. This could be when the user finishes their drawing and clicks a “Save” or “Upload” button, for example.

JavaScript

let points = [];

function setup() {
  createCanvas(400, 400);
  background(220);

  let saveButton = createButton('Save Drawing');
  saveButton.mousePressed(uploadDrawing);
}

function draw() {
  if (mouseIsPressed) {
    points.push(createVector(mouseX, mouseY));
    ellipse(mouseX, mouseY, 10);
  }
}

async function uploadDrawing() {
  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(points)
  });
  const data = await response.json();
  console.log(data.status);
}

In this example, a “Save Drawing” button is created in the setup() function. When this button is clicked, it triggers the uploadDrawing() function, which sends the drawing data to the server1234. The drawing data is captured whenever the mouse is pressed and moved. The mouseIsPressed is a p5.js system variable that always contains a true/false value depending on whether the mouse button is currently being pressed.

## Save a p5.js drawing as an array of points in a database with fastify

Fastify, a fast and low overhead web framework for Node.js, to handle the server-side logic.

### Capture the drawing: As the user draws on the canvas, capture the x and y coordinates of the points. You can do this by pushing the points into an array in the mouseDragged function.

JavaScript

let points = [];
function mouseDragged() {
  points.push(createVector(mouseX, mouseY));
}

### Send the drawing to the server: Now, you need to send this data to a server where it can be stored in a database. You can use the fetch API to send a POST request to your server with the drawing data.

async function uploadDrawing() {
  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(points)
  });
  const data = await response.json();
  console.log(data.status);
}

### Server-side code with Fastify: On the server side, you can use Fastify to handle the POST request and save the data in a database. Here’s a basic example of how you might handle the POST request in your server.js file:

fastify.post('/api', async (request, reply) => {
  const data = request.body;
  // Here, you would insert the data into your database.
  // The specific code depends on what kind of database you're using.
  // database.insert(data);
  return {
    status: 'success',
    timestamp: Date.now(),
    points: data
  };
});
/*** * This is the main server script that provides the API endpoints
 * 
 * The API returns the front-end UI handlebars pages, or
 * Raw json if the client requests it with a query parameter ?raw=json
 */
/*** * README: `server.js`: The Node.js server script for your new site. 
 * The JavaScript defines the endpoints in the site API. 
 * The API processes requests, 
 *  ← connects to the database using the `sqlite` script in `src`, and 
 *  ← sends info back to the client 
 *    (the web pages that make up the app user interface, 
 *     built using the Handlebars templates in `src/pages`).
*/

// Utilities we need
const fs = require("fs");
const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data - SEO (Search Engine Optimization)
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
    seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

// We use a module for handling database operations in /src
const data = require("./src/data.json");
const db = require("./src/" + data.database);

/** * Home route for the app
 *
 * Return the poll desenhos from the database helper script
 * The home route may be called on remix in which case the db needs setup
 *
 * Client can request raw data using a query parameter
 */
fastify.get("/", async (request, reply) => {
  /* Params is the data we pass to the client
  - SEO values for front-end UI but not for raw data*/
  let params = request.query.raw ? {} : { seo: seo };

  // Get the available memories from the database
  const desenhos = await db.getDesenhos();
  if (desenhos) {
    params.time      = desenhos.map( time => time);
    params.p5draw = desenhos.map( desenho => desenho);
  }
  // Let the user know if there was a db error
  else params.error = data.errorMessage;

  // Check in case the data is empty or not setup yet
  if (desenhos && params.time.length < 1)
    params.setup = data.setupMessage;

  // ~+++++++++++++++++++ADD PARAMS FROM TODO HERE

  // Send the page desenhos or raw JSON data if the client requested it
  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/index.hbs", params);
});

/** * Post route to process user memory
 *
 * Retrieve memory from body data
 * Send memory to database helper
 * Return updated list of memories
 */
fastify.post("/", async (request, reply) => {
  // We only send seo if the client is requesting the front-end ui
  let params = request.query.raw ? {} : { seo: seo };

  // Flag to indicate we want to show the poll results instead of the poll form
  params.results = true;
  let desenhos;

  // We have a memory - send to the db helper to process and return results
  if (request.body.p5draw) {
    desenhos = await db.saveMemory(request.body.p5draw);
    if (desenhos) {   
      params.time   = desenhos.map( time => time);
      params.p5draw = desenhos.map( desenho => desenho);
    }
  }
  params.error = desenhos ? null : data.errorMessage;

  // Return the info to the client
  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/index.hbs", params);
});

/**
 * Admin endpoint returns log of memories
 *
 * Send raw json or the admin handlebars page
 */
fastify.get("/logs", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  // Get the log history from the db
  params.logHistory = await db.getLogs();

  // Let the user know if there's an error
  params.error = params.logHistory ? null : data.errorMessage;

  // Send the log list
  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/admin.hbs", params);
});

/** * Admin endpoint to empty all logs
 *
 * Requires authorization (see setup instructions in README)
 * If auth fails, return a 401 and the log list
 * If auth is successful, empty the history
 */
fastify.post("/reset", async (request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };

  /* Authenticate the user request by checking against the env key variable
  - make sure we have a key in the env and body, and that they match
  */
  if (
    !request.body.key ||
    request.body.key.length < 1 ||
    !process.env.ADMIN_KEY ||
    request.body.key !== process.env.ADMIN_KEY
  ) {
    console.error("Não autorizado");

    // Auth failed, return the log data plus a failed flag
    params.failed = "As credentiais não são validas (Sabes cartelhano?)";

    // Get the log list
    params.logHistory = await db.getLogs();
  } else {
    // We have a valid key and can clear the log
    params.logHistory = await db.clearHistory();

    // Check for errors - method would return false value
    params.error = params.logHistory ? null : data.errorMessage;
  }

  // Send a 401 if auth failed, 200 otherwise
  const status = params.failed ? 401 : 200;
  // Send an unauthorized status code if the user credentials failed
  return request.query.raw
    ? reply.status(status).send(params)
    : reply.status(status).view("/src/pages/admin.hbs", params);
});

fastify.get("/gravar", async (request, reply) => {
  // We only send seo if the client is requesting the front-end ui
  let params = request.query.raw ? {} : { seo: seo };
  let ok = await db.saveMemory(params.p5draw);
  params.error = ok ? null : data.errorMessage;

  // Return the info to the client
  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/index.hbs", params);
});

fastify.post('/gravar', async(request, reply) => {
  let params = request.query.raw ? {} : { seo: seo };
  let p5draw = request.body;
  let ok = await db.saveMemory(p5draw);
  params.error = ok ? null : data.errorMessage;  

  // Return the info to the client
  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    
    console.log("6");
    console.log(`App is listening on ${address}`);
  }
);
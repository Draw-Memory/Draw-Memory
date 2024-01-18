/** * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// Utilities we need
const fs = require("fs");

// Initialize the database
const dbFile = "./.data/choices.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

/* sqlite wrapper so that we can make async / await connections
- https://www.npmjs.com/package/sqlite
*/
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    // We use try and catch blocks throughout to handle any database errors
    try {
      // The async / await syntax lets us write the db operations in a way that won't block the app
      if (!exists) {
        // Database doesn't exist yet - create Choices and Log tables
        // await db.run(
        //   "CREATE TABLE Choices (id INTEGER PRIMARY KEY AUTOINCREMENT, language TEXT, picks INTEGER)"
        // );

        // Add default choices to table
        // await db.run(
        //   "INSERT INTO Choices (language, picks) VALUES ('Novo', 0), ('Último', 0), ('Aleatório', 0)"
        // );

        // Log can start empty - we'll insert a new record whenever the user chooses a poll option
        // await db.run(
        //   "CREATE TABLE Log (id INTEGER PRIMARY KEY AUTOINCREMENT, time STRING)"
        // );

        // Desenhos can start empty - we'll insert a new record whenever the user guarda
        await db.run(
          // "CREATE TABLE Desenhos (time STRING, path TEXT NOT NULL)"
          "CREATE TABLE Desenhos (time STRING)"

        );
        // Add default choices to table
        await db.run(
          "INSERT INTO Desenhos (time) VALUES (new Date().toISOString())"
        );

      } else {
        // We have a database already - write Choices records to log for info
        console.log(await db.all("SELECT time from Desenhos"));

        //If you need to remove a table from the database use this syntax
        //db.run("DROP TABLE Logs"); //will fail if the table doesn't exist
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Our server script will call these methods to connect to the db
module.exports = {

  /** * Get the Desenhos in the database
   *
   * Return everything in the Desenhos table
   * Throw an error in case of db connection issues
   */
  getDesenhos: async () => {
    // We use a try catch block in case of db errors
    try {
      return await db.all("SELECT time from Desenhos");
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  }, //getDesenhos  
  
  /** * Get the options in the database
   *
   * Return everything in the Choices table
   * Throw an error in case of db connection issues
   */
  getOptions: async () => {
    // We use a try catch block in case of db errors
    try {
      return await db.all("SELECT time from Desenhos");
    } catch (dbError) {
      // Database connection error
      console.error(dbError);
    }
  }, //getOptions

  /** * Process a user vote
   *
   * Receive the user vote string from server
   * Add a log entry
   * Find and update the chosen option
   * Return the updated list of votes
   */
  processMemory: async vote => {
    // Insert new Log table entry indicating the user choice and timestamp
    try {
      // Check the vote is valid
      const option = await db.all(
        "SELECT time from Desenhos WHERE time = ?",
        vote
      );
      if (option.length > 0) {
        // Build the user data from the front-end and the current time into the sql query
        await db.run("INSERT INTO Desenhos (time,path) VALUES (?)", [
          vote,
          new Date().toISOString()
        ]);

        // Update the number of times the choice has been picked by adding one to it
        await db.run(
          "UPDATE Desenhos SET path = xxxx WHERE time = ?",
          vote
        );
      }

      // Return the choices so far - page will build these into a chart
      return await db.all("SELECT time from Desenhos");
    } catch (dbError) {
      console.error(dbError);
    }
  }, //processMemory

  /** Get logs: Return choice and time fields from all records in the Log table */
  getLogs: async () => {
    try {
      // Return the array of log entries to admin page
      return await db.all("SELECT time from Desenhos ORDER BY time DESC");
    } catch (dbError) {
      console.error(dbError);
    }
  }, //getLogs

  /** * Clear logs, reset votes e clear Desenhos
   *
   * Destroy everything in Log table e Desenhos
   * Reset votes in Choices table to zero
   */
  clearHistory: async () => {
    try {
      // Delete the logs
      // await db.run("DELETE from Log");
      
      // Reset the vote numbers
      // await db.run("UPDATE Choices SET picks = 0");
      
      // Delete the logs
      await db.run("DELETE from Desenhos");

      // Return empty array
      return [];
    } catch (dbError) {
      console.error(dbError);
    }
  } //clearHistory

}; //module.exports

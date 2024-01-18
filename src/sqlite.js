/** * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// Utilities we need
const fs = require("fs");

// Initialize the database
const dbFile = "./.data/memories.db";
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
        // Desenhos can start empty - 
        // we'll insert a new record whenever the user guarda
        await db.run(
          // "CREATE TABLE Desenhos"
          "CREATE TABLE Desenhos (time)"
        );

      } else {
        // We have a database already - 
        // write memories records to log for info
        console.log(await db.all("SELECT * from Desenhos"));

      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Our server script will call these methods to connect to the db
module.exports = {

  getDesenhos: async () => {
    try {
      return await db.all("SELECT * from Desenhos");
    } catch (dbError) {
      console.error(dbError);
    }
  },
  
  processMemory: async memorize => {
    try {
      const option = await db.all("SELECT * from Desenhos",memorize);
      if (option.length > 0) {
        // Build the user data from the front-end 
        // and the current time into the sql query
        await db.run("INSERT INTO Desenhos (time) VALUES (?)", [
          // memorize,
          new Date().toISOString()
        ]);
        
      }

      return await db.all("SELECT * from Desenhos");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  getLogs: async () => {
    try {
      // Return the array of log entries to admin page
      return await db.all("SELECT * from Desenhos ORDER BY time DESC");
    } catch (dbError) {
      console.error(dbError);
    }
  }, 

  clearHistory: async () => {
    try {   
      // Delete the logs
      await db.run("DELETE from Desenhos");

      // Return empty array
      return [];
    } catch (dbError) {
      console.error(dbError);
    }
  }

};
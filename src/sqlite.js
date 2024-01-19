/*** Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// Utilities we need
const { timeStamp } = require("console");
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

      if (!exists) {
        await db.run("CREATE TABLE Desenhos (time TEXT)");        
        await db.run("INSERT INTO Desenhos (time) VALUES (?)", 
                      [new Date(Date.now()).toString()]);  
        console.log(await db.all("SELECT * from Desenhos"));
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
    try {console.log(await db.all("SELECT * from Desenhos"));
      return await db.all("SELECT * from Desenhos");      
    } catch (dbError) {
      console.error(dbError);
    }
  },
  
  processMemory: async memorize => {
    try {
      const option = await db.all("SELECT * from Desenhos",memorize);
      if (option.length > 0) {console.log(await db.all("SELECT * from Desenhos"));
        // Build the user data from the front-end 
        // and the current time into the sql query
        await db.run("INSERT INTO Desenhos (time) VALUES (?)", [memorize]);   
      }console.log(await db.all("SELECT * from Desenhos"));
      return await db.all("SELECT * from Desenhos");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  getLogs: async () => {
    try {console.log(await db.all("SELECT * from Desenhos"));
      return await db.all("SELECT time from Desenhos ORDER BY time DESC");
    } catch (dbError) {
      console.error(dbError);
    }
  }, 

  clearHistory: async () => {
    try {   console.log(await db.all("SELECT * from Desenhos"));
      // Delete the logs
      await db.run("DELETE from Desenhos");

      // Return empty array
      return [];
    } catch (dbError) {
      console.error(dbError);
    }
  }

};
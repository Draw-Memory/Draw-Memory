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

      db.run("DROP TABLE Points");      
      db.run("DROP TABLE Desenhos");

      if (!exists) {
        await db.run("CREATE TABLE Points (x INT, y INT)");
        await db.run("CREATE TABLE Desenhos (jsonDraw TEXT, time TEXT)");        
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

  savePoints: async p5draw => {
    try {
      // Build the user data from the front-end and the current time into the sql query
      for (let point of p5draw) {
        await db.run("INSERT INTO Points (x, y) VALUES (?, ?)",[point.x,point.y]);
      }
    
      return await db.all("SELECT * from Points");
    } catch (dbError) {
      console.error(dbError);
    }
  },  
  
  saveMemory: async p5draw => {
    try {
      // Build the user data from the front-end and the current time into the sql query
      await db.run("INSERT INTO Desenhos (jsonDraw, time) VALUES (?, ?)", [
        p5draw,
        new Date(Date.now()).toString()
      ]);

      return await db.all("SELECT * from Desenhos");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  getLogs: async () => {
    try {
      return await db.all("SELECT time from Desenhos ORDER BY time DESC");
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
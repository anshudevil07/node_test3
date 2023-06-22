const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017'; 
const dbName = 'restapi'; 

let db;

async function connect() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    
    // Created "students" collection if it doesn't exist
    const studentsCollection = db.collection('students');
    await studentsCollection.createIndex({ id: 1 }, { unique: true }); // Ensure uniqueness of student IDs
  
    // Add fields to the "students" collection if they don't exist
    await studentsCollection.updateMany({}, { $setOnInsert: { name: '', age: 0, grade: '' } }, { upsert: true });
  }
  

function getDb() {
  return db;
}

module.exports = {
  connect,
  getDb,
};

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

async function createCollection(dbName, collectionName) {
  const mainDb = await MongoClient.connect(process.env.SIMPLE_MONGO_CLIENT_URL);
  const childDb = await mainDb.db(dbName);
  const colCreated = await childDb.createCollection(collectionName);
  await mainDb.close();
  return colCreated || false;
}

module.exports = {
  createCollection,
};

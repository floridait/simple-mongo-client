const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

async function dropCollection(dbName, collectionName) {
  const mainDb = await MongoClient.connect(process.env.SIMPLE_MONGO_CLIENT_URL);
  const childDb = await mainDb.db(dbName);
  const dropCol = await childDb.collection(collectionName);
  const dropped = await dropCol.drop();
  await mainDb.close();
  return dropped || false;
}

module.exports = {
  dropCollection,
};

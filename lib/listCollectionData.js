const mongodb = require('mongodb');
const util = require('util');

const MongoClient = mongodb.MongoClient;

async function listCollectionData(dbName, collectionName) {
  const mainDb = await MongoClient.connect(process.env.SIMPLE_MONGO_CLIENT_URL);
  const childDb = await mainDb.db(dbName);
  const col = await childDb.collection(collectionName);
  const data = await col.find({}).toArray();
  if (data && data.length) {
    console.log(util.inspect(data, false, 4, true));
  }
  await mainDb.close();
}

module.exports = {
  listCollectionData,
};

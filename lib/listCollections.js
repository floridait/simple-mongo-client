const mongodb = require('mongodb');
const alphaSortCollectionNames = require('./sorting.js').alphaSortCollectionNames;

const MongoClient = mongodb.MongoClient;

async function listCollections(dbName) {
  const mainDb = await MongoClient.connect(process.env.SIMPLE_MONGO_CLIENT_URL);
  const childDb = await mainDb.db(dbName);
  const collections = await childDb.collections();
  if (collections && collections.length) {
    console.log('Collections:\n');
    collections.sort(alphaSortCollectionNames);
    for (let i = 0; i < collections.length; i++) {
      const col = collections[i].s.name;
      console.log(col);
    }
  }
  await mainDb.close();
}

module.exports = {
  listCollections,
};

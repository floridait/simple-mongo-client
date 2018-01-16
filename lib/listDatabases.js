const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

async function listDatabases() {
  const mainDb = await MongoClient.connect(process.env.SIMPLE_MONGO_CLIENT_URL);
  const databases = await mainDb.admin().listDatabases();
  if (databases && databases.databases && databases.databases.length) {
    console.log('Databases:\n');
    const dbs = databases.databases;
    for (let i = 0; i < dbs.length; i++) {
      console.log(`db: ${dbs[i].name} size: ${dbs[i].sizeOnDisk} empty: ${dbs[i].empty}`);
    }
  }
  await mainDb.close();
}

module.exports = {
  listDatabases,
};

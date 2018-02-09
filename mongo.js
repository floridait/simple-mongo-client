const mongodb = require('mongodb');
const util = require('util');
const inquirer = require('inquirer');
const runUsage = require('./lib/usage.js').runUsage;
const alphaSortCollectionNames = require('./lib/sorting.js').alphaSortCollectionNames;
const dropCollection = require('./lib/dropCollection.js').dropCollection;
const createCollection = require('./lib/createCollection.js').createCollection;
const listCollections = require('./lib/listCollections.js').listCollections;
const listDatabases = require('./lib/listDatabases.js').listDatabases;
const listCollectionData = require('./lib/listCollectionData.js').listCollectionData;
const downloadFile = require('./lib/downloadFile.js').downloadFile;

const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

let mainDb = null;
let childDb = null;

function noRes(query) { console.log('QUERY no results:', util.inspect(query, false, 4, true)); }

async function main() {
  const url = process.env.SIMPLE_MONGO_CLIENT_URL || null;

  if (!url) {
    console.log('MONGO_URL not set');
    process.exit(1);
  }

  const argus = process.argv;
  if (argus.length < 3) {
    runUsage();
  }

  try {
    mainDb = await MongoClient
      .connect(url, {
        reconnectTries: 20,
        reconnectInterval: 1000,
        keepAlive: 1,
        socketTimeoutMS: 30000,
      });
    if (!mainDb) {
      console.log('ERROR cannot connect to the server:', process.env.SIMPLE_MONGO_CLIENT_URL);
      process.exit(1);
    }
  } catch (_e) {
    console.log('ERROR a connection to the server could not be established');
    process.exit(1);
  }

  if (argus.length < 3) {
    await listDatabases();
  }

  if (argus.length === 3 &&
    argus[2] !== 'url') {
    await listCollections(argus[2]);
  }

  if (argus.length === 3 &&
    argus[2] === 'url') {
    console.log(
      'SIMPLE_MONGO_CLIENT_URL:',
      process.env.SIMPLE_MONGO_CLIENT_URL || 'NOT SET!'
    );
    if (typeof argus[3] !== 'undefined') {
      process.env.SIMPLE_MONGO_CLIENT_URL = argus[3];
      console.log(
        'New set SIMPLE_MONGO_CLIENT_URL:',
        process.env.SIMPLE_MONGO_CLIENT_URL || 'NOT SET!'
      );
    }
  }

  if (argus.length === 4 &&
    argus[3] !== 'drop' &&
    argus[3] !== 'createCollection' &&
    argus[3] !== 'downloadFile') {
    await listCollectionData(argus[2], argus[3]);
  }

  if (argus.length === 4 && argus[3] === 'downloadFile') {
    await downloadFile(argus[2]);
  }

  if (argus.length === 4 && argus[3] === 'drop') {
    childDb = mainDb.db(argus[2]);
    // we want to show all the collections and be able to select mutliple
    // to drop them
    const cols = await childDb.collections();
    if (cols && cols.length) {
      const choices = cols.sort(alphaSortCollectionNames).map(c => c.s.name);
      const questions = [{
        type: 'checkbox',
        message: 'Which collections would you like to drop?',
        name: 'dropCollections',
        choices,
      }];
      const answers = await inquirer.prompt(questions);
      if (answers && answers.dropCollections) {
        answers.dropCollections.forEach(async (dc) => {
          const colDropped = await dropCollection(argus[2], dc);
          if (colDropped) {
            console.log('DROP collection dropped:', dc);
          } else {
            console.log('DROP collection drop failed:', dc);
          }
        });
      }
    }
  }

  if (argus.length === 4 && argus[3] === 'createCollection') {
    const questions = [{
      type: 'input',
      name: 'collectionName',
      message: 'Enter the collection name you want to create:',
    }];
    const answer = await inquirer.prompt(questions);
    if (answer && answer.collectionName && answer.collectionName.length) {
      const colCreated = await createCollection(argus[2], answer.collectionName);
      if (colCreated) {
        console.log('CREATE COLLECTION collection created:', answer.collectionName);
      } else {
        console.log('CREATE COLLECTION failed!', answer.collectionName);
      }
    }
  }

  if (argus.length >= 5) {
    const cmd = argus[4];
    if (cmd !== 'drop' && typeof argus[5] === 'undefined') {
      console.log('ERROR missing query for command:', cmd);
      process.exit(1);
    }
    let query = null;
    let options = null; // for find these are options, update modifiers
    let options2 = null; // if update these are the options
    let objIdString = null; // if objectId then the containing string

    if (cmd !== 'drop') {
      // we need to check if we have object ids in the
      // query and extract them before we do a json parse
      const objIdRegex = /ObjectId\("(.*)"\)/g;
      const objIdStringRegex = /[a-f\d]{24}/i;
      const objIdMatch = argus[5].match(objIdRegex);

      if (objIdMatch) {
        const match = objIdMatch[0];
        objIdString = match.match(objIdStringRegex)[0] || null;
        if (objIdString) {
          argus[5] = argus[5]
            .replace('ObjectId(', '')
            .replace('ObjectID(', '')
            .replace(')', '');
        }
      }
    }

    try {
      if (cmd !== 'drop') {
        query = JSON.parse(argus[5], false);
        if (objIdString) {
          query._id = new ObjectID(objIdString);
        }
      }
    } catch (exception) {
      console.log('ERROR incorrect json query parameter:', argus[5], exception);
      process.exit(1);
    }
    if (cmd !== 'drop' && !query) {
      console.log('QUERY not recognized:', query);
      process.exit(1);
    }
    if (typeof argus[6] !== 'undefined') {
      try {
        options = JSON.parse(argus[6], false);
      } catch (exception) {
        console.log('ERROR incorrect json options or modifiers:', argus[6], exception);
        process.exit(1);
      }
    }
    if (typeof argus[7] !== 'undefined') {
      try {
        options2 = JSON.parse(argus[7], false);
      } catch (exception) {
        console.log('ERROR incorrect json options:', argus[7], exception);
        process.exit(1);
      }
    }

    // start cmd query
    childDb = await mainDb.db(argus[2]);
    const col = childDb.collection(argus[3]);
    switch (cmd) {
      case 'find': {
        const res = await col.find(query, options || {}).toArray();
        if (res && res.length) {
          console.log(util.inspect(res, false, 4, true));
        } else {
          noRes(query);
        }
        break;
      }
      case 'findOne': {
        const res = await col.findOne(query, options || {});
        if (res) {
          console.log(util.inspect(res, false, 4, true));
        } else {
          noRes(query);
        }
        break;
      }
      case 'update': {
        if (!options) {
          console.log('ERROR update requires modifier json string object');
          process.exit(1);
        }
        const res = await col.update(query, options, options2 || {});
        if (res) {
          console.log(
            `UPDATE updated ${res.nModified} documents for query:`,
            util.inspect(query, false, 4, true)
          );
        } else {
          noRes(query);
        }
        break;
      }
      case 'remove': {
        const res = await col.remove(query, options || {});
        if (res) {
          console.log(
            `REMOVE removed ${res.result.n} documents for query:`,
            util.inspect(query, false, 4, true)
          );
        }
        break;
      }
      case 'insert': {
        const res = await col.insert(query, options || {});
        if (res) {
          console.log(
            `INSERT inserted ${res.insertedCount} documents into ${argus[3]} and got ids:`,
            util.inspect(res.insertedIds, false, 4, true)
          );
        } else {
          console.log('INSERT could not insert documents');
        }
        break;
      }
      case 'drop': {
        const dropres = await col.drop();
        if (dropres) {
          console.log(`DROP ${argus[3]} was dropped successfully`);
        } else {
          console.log('DROP failed!');
        }
        break;
      }
      default:
        console.log('ERROR unrecognized command:', cmd);
    }
  }

  mainDb.close();
}

main();

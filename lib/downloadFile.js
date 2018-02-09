const util = require('util');
const inquirer = require('inquirer');
const alphaSortCollectionNames = require('./sorting.js').alphaSortCollectionNames;
const fs = require('fs');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const GridFSBucket = mongodb.GridFSBucket;

const getFile = (db, docId) => {
  const bucket = new GridFSBucket(db);
  return new Promise((resolve, reject) => {
    const downloadStream = bucket.openDownloadStream(ObjectID(docId));
    let res = '';
    downloadStream.on('data', (buf) => {
      res += buf;
    });
    downloadStream.on('end', () => {
      resolve(res);
    });
    downloadStream.on('error', (err) => {
      reject(err);
    });
  });
};

async function downloadFile(dbName) {
  const mainDb = await MongoClient.connect(process.env.SIMPLE_MONGO_CLIENT_URL);
  const childDb = await mainDb.db(dbName);
  const inputQuestions = [{
    type: 'input',
    message: 'Enter the document ID:',
    name: 'fsFilesDocumentId'
  }, {
    type: 'input',
    message: 'Enter the file name (ex: test.xlf):',
    name: 'filename',
  }];
  const inputAnswer = await inquirer.prompt(inputQuestions);
  if (inputAnswer && inputAnswer.fsFilesDocumentId && inputAnswer.fsFilesDocumentId.length &&
    inputAnswer.filename && inputAnswer.filename.length) {
    // we have all the information we need
    try {
      const file = await getFile(childDb, inputAnswer.fsFilesDocumentId);
      if (file) {
        fs.writeFileSync(`${process.env.HOME}/${inputAnswer.filename}`, file);
        console.log('File written to:', `${process.env.HOME}/${inputAnswer.filename}`);
      }
    } catch (exception) {
      console.log('Error:', exception);
    }
    await mainDb.close();
  }
}

module.exports = {
  downloadFile,
};

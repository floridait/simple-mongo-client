function runUsage() {
  console.log(
    'node mongo.js (mongo from now on)\n' +
    'mongo <[url]>\n' +
    ' - lists all databases\n' +
    ' - [url] shows the mongo db connection string\n\n' +
    'mongo <database> <[drop|createCollection|downloadFile]>\n' +
    ' - list all collections in database\n' +
    ' - [drop] options allows you to select collections to drop\n' +
    ' - [createCollection] allows you to create a collection with a prompt\n' +
    ' - [downloadFile] allows you to download a file using the prompt\n\n' +
    'mongo <database> <collection> <[insert|update|find|findOne|drop]>\n' +
    ' - list records in the collection\n' +
    ' - <insert> <json string data>\n' +
    ' - <update> <selector json string> <json string data>\n' +
    ' - <find> <selector json string> <[data|options...]>\n' +
    ' - <findOne> <selector json string> <[data|options...]>\n' +
    ' - <drop> select item from list to drop\n\n'
  );
}

module.exports = {
  runUsage,
};

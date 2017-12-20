# Simple Mongo Client

## Install

```
cd ~/Programming/dev-tools/simple-mongo-client
yarn
```

I use FISH so here is the fish way. You can make an alias in bash or whatever...

```
function mongo --description="simple-mongo-client"
  set -gx SIMPLE_MONGO_CLIENT_URL "mongodb://test:test@localhost:3001/chhub?ssl=true&authSource=chhub"
  node ~/Programming/dev-tools/simple-mongo-client/mongo.js $argv;
end
```

## Usage

First set the mongo url for the session. Using FISH Shell it would look like this.

```
set -x MONGO_URL "mongodb://test:test@localhost:3001/chhub?ssl=true&authSource=chhub"
```

To show a list of available databases in that url do the following.

```
node mongo.js
```

The output will look like this

```
➜ mac ➜ ..Programming/mongo-client node mongo.js
node mongo.js <database> [<collection> <[insert|update|find|findOne]> <selector> <[data|options]> [<options>]]

Databases:

db: 24TTest-1487328219475 size: 1200128 empty: false
db: admin size: 81920 empty: false
db: chhub size: 626688 empty: false
db: chmarketplace size: 950272 empty: false
db: local size: 5468160 empty: false
```

One you know which database you want to query you would do the next step to list the possible collections.

```
node mongo.js 24TTest-1487328219475
```

Now you would see output like this

```
➜ mac ➜ ..Programming/mongo-client node mongo.js 24TTest-1487328219475
Collections:

translationTasks
documentConversionJobs
fs.files
analysis
fs.chunks
quoteEnquiries
quotes
vendorConnectors
documentConversions
lspVendors
orderProgress
projects
translationDeliveries
```

Are you starting to notice the pattern? Now to see all the documents in the collection do the following:

```
node mongo.js 24TTest-1487328219475 fs.files
```

And once again your output for the above command:

```
➜ mac ➜ ..Programming/mongo-client node mongo.js 24TTest-1487328219475 fs.files
[ { _id: 5a096103c58e5447a7f03892,
    length: 8826,
    chunkSize: 261120,
    uploadDate: 2017-11-13T09:08:20.057Z,
    md5: '254d3c692fd755affe39c0c91b17f583',
    filename: 'lorum_lorum_lorum_lorum_long_name_to_test_the_ui.docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    metadata:
     { userId: 'tru3G3n1u51337C0DE',
       translationTaskId: 'zAJodDdJLZykhYBpv' } },
  { _id: 5a096104c58e5447a7f03894,
    length: 9239,
    chunkSize: 261120,
    uploadDate: 2017-11-13T09:08:20.074Z,
    md5: '2a5f9571198adfd052bfe2eb731527d6',
    filename: 'lorum3.docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    metadata:
     { userId: 'tru3G3n1u51337C0DE',
       translationTaskId: 'zAJodDdJLZykhYBpv' } },
  { _id: 5a096104c58e5447a7f03896,
    length: 8826,
    chunkSize: 261120,
    uploadDate: 2017-11-13T09:08:20.091Z,
    md5: '254d3c692fd755affe39c0c91b17f583',
    filename: 'lorum2.docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    metadata:
     { userId: 'tru3G3n1u51337C0DE',
       translationTaskId: 'zAJodDdJLZykhYBpv' } },
  { _id: 5a09610e95ed4b001d9d074d,
    length: 14127,
    chunkSize: 261120,
    uploadDate: 2017-11-13T09:08:30.745Z,
    md5: '900f5f9d9bf4f8d64f52d783eb78a5b4',
    filename: 'lorum_lorum_lorum_lorum_long_name_to_test_the_ui.docx.xlf',
    contentType: 'application/xliff+xml',
    metadata:
     { type: 'converted',
       sourceDocumentId: '5a096103c58e5447a7f03892',
       documentConversionId: 'Sj3M6RGduwnCn9SDd',
       userId: 'tru3G3n1u51337C0DE',
       translationTaskId: 'zAJodDdJLZykhYBpv',
       targetLanguage: 'en-US' } },
  { _id: 5a09610e95ed4b001d9d074f,
    length: 14100,
    chunkSize: 261120,
    uploadDate: 2017-11-13T09:08:30.753Z,
    md5: '00b04eaa8f2dcccfb26e15bc9e3779a6',
    filename: 'lorum_lorum_lorum_lorum_long_name_to_test_the_ui.docx.xlf',
    contentType: 'application/xliff+xml',
    metadata:
     { type: 'converted',
       sourceDocumentId: '5a096103c58e5447a7f03892',
       documentConversionId: 'inqmE2zyTvkEJpsD8',
       userId: 'tru3G3n1u51337C0DE',
       translationTaskId: 'zAJodDdJLZykhYBpv',
       targetLanguage: 'fr' } },

...
```

Now you habe multiple options. You can use the commands find, findOne, update, and remove. For `find` you need to specify also a query and optional options like so:

```
node mongo.js 24TTest-1487328219475 fs.files find '{"_id":ObjectId("5a096103c58e5447a7f03892")}'
```

The above command will give an output like:

```
➜ mac ➜ ..Programming/mongo-client node mongo.js 24TTest-1487328219475 fs.files find '{"_id":ObjectId("5a096103c58e5447a7f03892")}'
[ { _id: 5a096103c58e5447a7f03892,
    length: 8826,
    chunkSize: 261120,
    uploadDate: 2017-11-13T09:08:20.057Z,
    md5: '254d3c692fd755affe39c0c91b17f583',
    filename: 'lorum_lorum_lorum_lorum_long_name_to_test_the_ui.docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    metadata:
     { userId: 'tru3G3n1u51337C0DE',
       translationTaskId: 'zAJodDdJLZykhYBpv' } } ]
```

We can also only show certain fields by doing the following:

```
node mongo.js 24TTest-1487328219475 fs.files find '{}' '{"fields":{"_id":1}}'
```

And the output:

```
[ { _id: 5a096103c58e5447a7f03892 },
  { _id: 5a096104c58e5447a7f03894 },
  { _id: 5a096104c58e5447a7f03896 },
  { _id: 5a09610e95ed4b001d9d074d },
  { _id: 5a09610e95ed4b001d9d074f },
  { _id: 5a09610e95ed4b001d9d0751 },
  { _id: 5a09610e95ed4b001d9d0752 },
  { _id: 5a09611295ed4b001d9d0755 },
  { _id: 5a09611295ed4b001d9d0756 },
  { _id: 5a09611295ed4b001d9d0759 },
  { _id: 5a09611295ed4b001d9d075c },
  { _id: 5a09611295ed4b001d9d075a },
  { _id: 5a096b78a34088001efd70af },
  { _id: 5a096b78a34088001efd70b0 },
  { _id: 5a096b78a34088001efd70ae },
  { _id: 5a096b7bdfd6bb001dd89d06 },
  { _id: 5a096b7bdfd6bb001dd89d07 },
  { _id: 5a096b7bdfd6bb001dd89d05 },
  { _id: 5a096d55bf685f4ee2e8e0f3 },
  { _id: 5a096d600cecd1001e9252e5 },
  { _id: 5a096da6f63dfd001d81bd0b },
  { _id: 5a096da8734342001d987458 } ]
```


## Drop it like it's ~HOT~

We can now easily drop collections. Below we will drop the collection test1 in 2 ways.

### Single collection drop


```
node mongo.js chmarketplace test1 drop
```

The output of the above command should look like `DROP test1 was dropped successfully`.

### Mutliple selection dropping

We can drop multiple collections at once. We can also use this way to drop single collections. Which way you choose for single collection dropping is up to you.

```
node mongo.js chmarketplace drop
```

You will get a multi select menu that looks like this:

```
➜ mac ➜ ..dev-tools/simple-mongo-client git:(master) ✗ mongo chmarketplace drop
? Which collections would you like to drop? (Press <space> to select, <a> to toggle all, <i> to invert s
election)
❯◯ counters
 ◯ currencies
 ◯ fs.chunks
 ◯ fs.files
 ◯ jobs
 ◯ meteor_accounts_loginServiceConfiguration
 ◯ orders
(Move up and down to reveal more choices)
```

Just like the instructions in the second row show you, you can select one or more with space and toggle with a or invert with i. This makes it really simple instead of having to do it single handed with multiple clicks in RoboMongo.


## Create collections

For completion of the tool we also have a way of creating empty collections quickly for testing purpose or whatever else.

```
node mongo.js chmarketplace createCollection
```

You will be prompted to enter a collection name.

```
➜ mac ➜ ..dev-tools/simple-mongo-client git:(master) ✗ mongo chmarketplace createCollection
? Enter the collection name you want to create:
```

Just enter the collection name and finished.
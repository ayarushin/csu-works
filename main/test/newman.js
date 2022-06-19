const newman = require('newman');

newman.run({
  collection: require('./integrations/Integrations.postman_collection.json'),
  reporters: 'cli'
}, (err) => {
  if (err) { throw err; }
  console.log('collection run complete!');
});
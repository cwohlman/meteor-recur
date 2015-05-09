Package.describe({
  name: 'cwohlman:recur',
  version: "0.1.0",
  // Brief, one-line summary of the package.
  summary: 'A simple recurrence parser for meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:cwohlman/meteor-recur.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.export('Recur');

  api.versionsFrom('1.1.0.2');
  api.use([
    'underscore'
    , 'momentjs:moment@2.10.3'
  ]);

  api.addFiles('recur.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use([
    'underscore'
    , 'momentjs:moment'
  ]);
  api.use('cwohlman:recur');
  api.addFiles('recur-tests.js');
});

'use strict';

var Command = require('../lib/command');
var requireAccess = require('../lib/requireAccess');
var api = require('../lib/api');
var utils = require('../lib/utils');
var prompt = require('../lib/prompt');
var chalk = require('chalk');
var RSVP = require('rsvp');

module.exports = new Command('disable:hosting')
  .description('stop serving web traffic to your Firebase Hosting site')
  .option('-y, --confirm', 'skip confirmation')
  .before(requireAccess)
  .action(function(options) {
    return prompt(options, [
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to disable Firebase Hosting?\n  ' + chalk.bold.underline('This will immediately make your site inaccessible!')
      }
    ]).then(function() {
      if (!options.confirm) {
        return RSVP.resolve();
      }

      return api.request('POST', '/projects/' + options.project + '/releases', {
        auth: true,
        data: {
          hosting: {
            disabled: true
          }
        },
        origin: api.deployOrigin
      });
    }).then(function() {
      if (options.confirm) {
        utils.logSuccess('Hosting has been disabled for ' + chalk.bold(options.project) + '. Deploy a new version to re-enable.');
      }
    });
  });

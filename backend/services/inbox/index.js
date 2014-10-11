'use strict';

var inbox = require('inbox'),
    MailParser = require('mailparser').MailParser,
    read = require('node-read'),
    bluebird = require('bluebird');

function downloadMessage(uid, dontRemoveConversation) {

  var mailparser = new MailParser();

  this.createMessageStream(uid).pipe(mailparser);

  function removeConversation(message) {

    if (!dontRemoveConversation) {
      message.text = message.text.split('\n').filter(function(line) {

        return line.indexOf('>') !== 0;

      }).join('\n').trim();
    }

    return message;

  }

  return new bluebird(function(resolve, reject) {

    mailparser.on('end', function(result) {

      if (result.text) {

        resolve(removeConversation(result));

      } else {

        read(result.html, function(err, article) {

          result.text = article.content;
          resolve(removeConversation(result));

        });

      }

    });

    mailparser.on('error', reject);

  });

}

function processNewMessages(mailboxId, messageHandler, archiveFolderId) {

  var client = this;

  return client.openMailboxAsync(mailboxId).then(function() {

    return client.listMessagesAsync(0);

  }).then(function(messages) {

    var promises = [];

    messages.forEach(function(message) {

      var promise = client.downloadMessage(message.UID).then(messageHandler).then(function() {

        return client.addFlagsAsync(message.UID, ['\\Seen']);

      }).then(function() {

        if (archiveFolderId) {
          return client.moveMessageAsync(message.UID, archiveFolderId);
        } else {
          return false;
        }

      });

      promises.push(promise);

    });

    return bluebird.all(promises);

  });

}

module.exports = function() {

  return function(config) {

    return function(accountName) {

      return new bluebird(function(resolve, reject) {

        var inboxConfig = config.get('inbox:' + accountName);

        if (!inboxConfig) {
          return reject('Unknown inbox config ' + accountName);
        }
        var client = inbox.createConnection(inboxConfig.port, inboxConfig.host, inboxConfig.options);
        bluebird.promisifyAll(client);

        client.connect();

        client.on('connect', function() {
          resolve(client);
        });

        client.on('error', reject);

        client.downloadMessage = downloadMessage;
        client.processNewMessages = processNewMessages;

      });

    };

  };

};

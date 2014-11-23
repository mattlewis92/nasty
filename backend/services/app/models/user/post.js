'use strict';

module.exports = function(schema) {

  schema.post('save', function() {

    if (this.wasNew && this.email) {

      this.sendEmail({
        subject: 'Welcome to the app!',
        template: {
          name: 'general',
          locals: {
            title: 'Welcome ' + this.name.first + '!',
            content: 'We\'re excited you\'re here! Learn more about the app by clicking the link below!',
            button: {
              text: 'Click me!',
              link: 'https://google.com/'
            }
          }
        }
      });

    }

  });

};

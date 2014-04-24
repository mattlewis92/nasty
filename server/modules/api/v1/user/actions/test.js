module.exports = {
  action: function() {
    this.json({hello: this._processed.hello});
  },
  before: ['user#something']
};

'use strict';

var toTitleCase = function(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

module.exports = function(mongoose) {

  return {
    name: {
      first: {
        type: String,
        required: true,
        trim: true,
        set: function(val) {
          return toTitleCase(val);
        }
      },
      last: {
        type: String,
        required: true,
        trim: true,
        set: function(val) {
          return toTitleCase(val);
        }
      }
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    token_salt: {
      type: String,
      required: true,
      select: false
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'de']
    },
    password_reset: {
      token: {
        type: String,
        select: false
      },
      expires_at: {
        type: Date,
        select: false
      }
    }
  };

};

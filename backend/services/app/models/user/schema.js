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
        trim: true,
        set: function(val) {
          return toTitleCase(val);
        }
      }
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false
    },
    token_salt: {
      type: String,
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
      },
      ip_address: String
    },
    avatar: {
      url: mongoose.SchemaTypes.Url,
      file: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'file'
      },
      source: {
        type: String,
        default: 'local'
      }
    },
    social_network_accounts: [{
      provider: {
        type: String,
        required: true
      },
      account_id: {
        type: String,
        required: true
      },
      account_name: String,
      profile_url: mongoose.SchemaTypes.Url,
      status: {
        type: String,
        enum: ['authenticated', 'unauthenticated'],
        required: true
      },
      authentication: {
        type: mongoose.SchemaTypes.Mixed,
        select: false
      },
      profile: mongoose.SchemaTypes.Mixed
    }]
  };

};

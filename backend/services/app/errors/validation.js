'use strict';

/**
 * @apiDefineErrorStructure ValidationError
 * @apiError (412 - Validation Error) {String} message A static string explaining there were errors.
 * @apiError (412 - Validation Error) {Object} details An object explaining the specific fields that had errors.
 * @apiErrorExample Validation error example:
 *  {
 *   "message": "There were errors with your request",
 *   "details": {
 *       "email": {
 *           "param": "email",
 *           "msg": "Valid email required"
 *       },
 *       "forename": {
 *           "param": "forename",
 *           "msg": "Required"
 *       },
 *       "surname": {
 *           "param": "surname",
 *           "msg": "Required"
 *       },
 *       "password": {
 *           "param": "password",
 *           "msg": "8 to 20 characters required"
 *       }
 *   }
}
 */
module.exports = function(errors, statusCode) {

  Error.call(this);
  this.message = 'There were errors with your request';
  this.details = errors;
  this.statusCode = statusCode || 412;
  this.stack = (new Error()).stack;
  this.displayToUser = true;

};

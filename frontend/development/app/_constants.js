'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.constants')
  .constant('Fingerprint', Fingerprint);

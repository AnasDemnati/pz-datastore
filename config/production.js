'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            'http://easyshop.cloudno.de',

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            '8080',

  // MongoDB connection options
  mongo: {
    // uri:    'mongodb://otawara:rouidate159357@ds011432.mlab.com:11432/easyshopdb'
    uri: 'mongodb://anasdemnati2:rouidate159357@ds213688.mlab.com:13688/leader-account-system'
            // process.env.MONGOLAB_URI ||
            // process.env.MONGOHQ_URL ||
            // process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
  }
};

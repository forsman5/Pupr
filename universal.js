var mysql = require('mysql');

//file to keep all methods and such that need to be used across both passport.js and controller
module.exports = {
  //establish database connection
  dbConnection: mysql.createConnection({
    host: "petlanddb.cv18qdrgjzn8.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: "petland",

    //cast any bit types to true / false (1 / 0)
    typeCast: function castField( field, useDefaultTypeCasting ) {
      // We only want to cast bit fields that have a single-bit in them. If the field
      // has more than one bit, then we cannot assume it is supposed to be a Boolean.
      if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

          var bytes = field.buffer();

          // A Buffer in Node represents a collection of 8-bit unsigned integers.
          // Therefore, our single "bit field" comes back as the bits '0000 0001',
          // which is equivalent to the number 1.
          return( bytes[ 0 ] === 1 );

      }

      return( useDefaultTypeCasting() );
    }
  }),
  sendEmail: function() {
    // TODO
  },
  NUMBER_OF_SALTS: 10
};

const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email LIKE $1;`, [`%${email}%`]) // USE LIKE because emails are case insensitive
    .then((result) => {
      if (!result.rows) {
        return null
      }
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`, [`${id}`])
    .then((result) => {
      if(!result.rows) {
        return null;
      }
      return result.rows[0];
    })
    .catch((error) => {
      return error.message;
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.email, 'password'];

  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
    .then((result) => {
      if (!result.rows) {
        return null;
      }
      return result.rows[0];
    })
    .catch((error) => {
      return error.message;
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT * FROM reservations 
            JOIN users ON users.id = reservations.guest_id
            WHERE guest_id = '${guest_id}'
            LIMIT ${limit};`)
    .then((result) => {
      if(!result.rows){
        return null;
      }
      return result.rows;
    })
    .catch((error) => {
      return error.message;
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      return error.message;
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;

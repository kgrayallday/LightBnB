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

  const queryParams = [];
  // City, min cost, max cost, min rating

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.owner_id) {
    console.log('⭐️ owner_id: ', properties.owner_id);
    queryParams.push(options.owner_id);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }

  if (options.city) {
    console.log('⭐️ city: ', options.city);
    queryParams.push(`%${options.city}%`);
    // if (queryParams.length >= 1) {
    //   queryString += `AND city LIKE $${queryParams.length} `;
    // } else {
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    console.log('⭐️ min/night: ', options.minimum_price_per_night);
    queryParams.push(`${options.minimum_price_per_night}`);
    if (queryParams.length >= 1) {
      queryString += `AND cost_per_night > $${queryParams.length} `;
    } else {
    queryString += `WHERE cost_per_night > $${queryParams.length} `;
    }
  }

  if (options.maximum_price_per_night) {
    console.log('⭐️ max/night ', options.maximum_price_per_night);
    queryParams.push(`${options.maximum_price_per_night}`);
    if (queryParams.length >= 1) {
      queryString += `AND cost_per_night < $${queryParams.length} `;
    } else {
    queryString += `WHERE cost_per_night < $${queryParams.length} `;
    }
  }

  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    console.log('⭐️ min rating: ', options.minimum_rating);
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log('⭐️⭐️ ⭐️  queryString: ', queryString);
  console.log('⭐️⭐️ ⭐️  queryParams: ', queryParams);
  return pool.query(queryString, queryParams).then((res) => res.row);

    // .catch((error) => {
    //   return error.message;
    // });
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

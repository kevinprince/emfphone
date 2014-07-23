function subscriber(){}

subscriber.prototype = new Object;

subscriber.prototype.create = function(id) {
  return db.query_insert('INSERT INTO users (username) VALUES($)', [id]);
};

subscriber.prototype.get = function(id) {
  return db.get_one_line_assoc('SELECT * FROM users WHERE id=$', [id]);
};

subscriber.prototype.user_exists = function(username) {
  return db.get_one_line_assoc('SELECT * FROM users WHERE username=$', [username]);
};

subscriber.prototype.update_location = function(username, location) {
  return db.query('UPDATE user SET location=$ WHERE username=$', [location, username]);
};

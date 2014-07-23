function subscriber(){}

subscriber.prototype = new Object;

subscriber.prototype.db = function() {
  return new db_client('emf', 'mysql');
};

subscriber.prototype.create = function(id) {
  return this.db.query_insert('INSERT INTO users (username) VALUES($)', [id]);
};

subscriber.prototype.get = function(id) {
  return this.db.get_one_line_assoc('SELECT * FROM users WHERE id=$', [id]);
};

subscriber.prototype.user_exists = function(username) {
  return this.db.get_one_line_assoc('SELECT * FROM users WHERE username=$', [username]);
};

subscriber.prototype.update_location = function(username, location) {
  return this.db.query('UPDATE user SET location=$ WHERE username=$', [location, username]);
};

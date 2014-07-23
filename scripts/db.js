function db_client(db_account, db_type){
       if(!db_account) return false;
       if(!db_type) db_type = 'pgsql';
       this.connect = null;
       this.account = db_account;
       this.db_types = {'pgsql':0, 'mysql':1};
       this.db_type = this.db_types[db_type];
       this.last_insert_id = ['SELECT LASTVAL()','LAST_INSERT_ID()'];
       return this;
   }
   db_client.prototype = new Object;
   db_client.prototype.query = function(q, a) {
       this.connect = null;
       this.connect = new Message("database");
       this.connect.account = this.account;
       this.connect.query = this.query_replase(q, a);
       if (!this.connect.dispatch()) return false;
       if (this.connect.error) {
           Engine.debug('SQL ' + this.connect.error);
           return false;
       }
       return true;
   };
   db_client.prototype.query_replase = function(q, a) {
       if (a) {
           if (typeof(a) !== 'object') return this.jtreplace(q, a);
           for (var i = 0; i < a.length; i++) {
               q = this.jtreplace(q, a[i]);
           }
       }
       return q;
   };
   db_client.prototype.jtreplace = function(q, a) {
       var list = [];
       list.push(q.substr(0, q.indexOf('$')), a, q.substr(q.indexOf('$') + 1, q.length));
       return list.join();
   };
   db_client.prototype.get_array_list = function(q, a)
   {
       if (!this.query(q, a)) return false;
       var rows = [];
       for (var r = 0; r < this.connect.rows; r++) {
           rows.push(this.connect.getRow(r));
       }
       return rows;
   };
   db_client.prototype.get_one_line_assoc = function(q, a)
   {
       if (!this.query(q, a)) return false;
       return this.connect.getRow(0);
   };
   db_client.prototype.get_value_query = function(q, a)
   {
       if (!this.query(q, a)) return false;
       if (this.connect.rows == 1 && this.connect.columns == 1) return this.connect.getResult(0, 0);
       return false;
   };
   db_client.prototype.getKeyValArray = function(q, a)
   {
       if (!this.query(q, a)) return false;
       var rows = {};
       for (var r = 0; r < this.connect.rows; r++) {
           rows[this.connect.getResult(r, 0)] = this.connect.getResult(r, 1);
       }
       return rows;
   };
   db_client.prototype.get_assoc_column = function(q, a)
   {
       if (!this.query(q, a)) return false;
       var rows = [];
       for (var r = 0; r < this.connect.rows; r++) {
           rows.push(this.connect.getResult(r, 0));
       }
       return rows;
   };
   db_client.prototype.query_insert = function(q, a)
   {
       q = q + ';'+ this.last_insert_id[this.db_type];
       if (!this.query(q, a)) return false;
       if (this.connect.rows == 1 && this.connect.columns == 1) return this.connect.getResult(0, 0);
       return true;
   };

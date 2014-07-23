#require "db.js"


db = new db_client('emf', 'mysql');

dbacc = "emf";

// The IP of the Tropo gateway for SMS.
vlr_sip = "10.0.5.121:6061";

// Call timer for MO calls, in minutes.
call_timer = 5;

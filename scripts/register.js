/**
 * reg_cache.js
 * This file is based on the YATE Project http://YATE.null.ro
 *
 * SIP/IAX caching proxy to mobile registrar implemented in Javascript
 *
 * Yet Another Telephony Engine - a fully featured software PBX and IVR
 * Copyright (C) 2012 Null Team
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA.
 */

#require "main.js"
#require "subscriber.js"


/* on every register request
 *
 * 1. reject invalid requesrs
 * 2. reject UK mobile subscribers
 * 3. if exists update location else drop user
 *
 */
function onRegister(msg)
{

  //no number or data = no registration
  if (msg.number == "" || msg.data == "" || msg.number == undefined){
    msg.retValue(400);
    return false;
  }

  //if IMSI is a UK operator drop it
  if (msg.number.substr(0,7) == "IMSI234"){
    msg.retValue(403);
    return false;
  }

  //if number identifies as IMSI
  if (msg.number.substr(0,4) == "IMSI"){
    username = msg.number.substr(4);
  } else {
    username = msg.number;
  }

  sub = subscriber.new();
  location = msg.data;

  if (sub.user_exists(username) !== false){
    sub.update_location(username.sqlEscape(), location.sqlEscape());
  } else {
    msg.retValue(404);
    return false;
  }

  msg.retValue(200);
	return true;

}

Engine.debugName("register");
Message.trackName("register");
Message.install(onRegister,"user.register",80);

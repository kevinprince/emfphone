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
#require "libsql.js"


function onRoute(msg)
{
	Engine.debug(Engine.DebugInfo,"onRoute " + msg.caller + " -> " + msg.called);

	var called = msg.called;
	var caller = msg.caller;

	// Set the caller ID
	if (caller.match(/IMSI/)) {
		query = "SELECT msisdn FROM register WHERE imsi=" + sqlStr(caller.substr(4));
		res = rowQuery(query);
		if (res) {
			msg.caller = "+" + res.msisdn;
			msg.callername = "+" + res.msisdn;
		}
	}

	// Set a time limit.
	msg.timeout = 1000*60*call_timer;
	// TODO: It would be nice to have a warning tone before the cutoff.

  switch(called){
    case "sos":
    case "101":
    case "110":
    case "112":
    case "113":
    case "114":
    case "911":
    case "999":
      return false;
  }

	// Target address is an MSISDN or an IMSI.
	// MSISDNs are fixed at 7 digits.
	if (called.length == 7 || called.match(/IMSI/))
	{
		return routeIMSI(msg);
	}

	return false;
}

function routeIMSI(msg)
{
	Engine.debug(Engine.DebugInfo,"routeIMSI " + msg.caller + " -> " + msg.called);
	var called = msg.called;
	var caller = msg.caller;
	// Get the IMSI and IP of the called phone.
	var scalled = sqlStr(called);
	var scalled4 = sqlStr(called.substr(4));
	var query = "SELECT location FROM register WHERE (msisdn="
		+ scalled + " OR imsi= " + scalled4 + ")";
	var res = rowQuery(query);
	if (!res)
		return false;
	msg.uri = res.location.substr(4);
	msg.retValue(res.location);

	Engine.debug(Engine.DebugInfo,"routeTropo" + msg.caller + " -> " + msg.called
    + "(" + res.location + ")");

	return true;
}

Engine.debugName("bman_route");
Message.trackName("bman_route");
Message.install(onRoute,"call.route",80);

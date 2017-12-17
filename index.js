#!/usr/bin/env node

const vorpal = require('vorpal')();
require('dotenv').config();

var autostrom = require("./autostrom.js");	



vorpal
  .command('account <user_id>')    
  .description("Display local account information ")  
  .action(autostrom.account);

vorpal
  .command('start <user_id> <plz> <reading>')    
  .description("Start charging session for local user at given zip code and given Meter Point Reading (in Wh)")  
  .action(autostrom.startSession);
  
vorpal
  .command('stop <user_id> <plz> <reading> <charged_energy>')    
  .description("Stop charging session for local user at given zip code and given Meter Point Reading (in Wh) with given charged energy (in Wh)")  
  .action(autostrom.stopSession);
    
if(typeof process.env.rpcprovider !="undefined") {	
		global.rpcprovider=process.env.rpcprovider;
} else {
		global.rpcprovider="https://fury.network/rpc";
}
var cli = new require("stromdao-cli-helper")(vorpal);

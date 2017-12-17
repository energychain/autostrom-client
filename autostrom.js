var StromDAOBO = require("stromdao-businessobject"); 
var request = require('then-request');
const vorpal = require('vorpal')();

module.exports = {
	getGSI:function(plz,node,callback) {
	request('GET',"https://stromdao.de/crm/service/gsi/?plz="+plz).then(function(data) {
			var json=JSON.parse(data.getBody());
			//  Validate Signature
			if(json.hash!=node.hash(json.data)) {
			  vorpal.log("ERR: Hash check failed");			  
			  throw "ERR";
			}
			if(json.by!=node.verify(json.signature)) {
			  vorpal.log("ERR: Signer check failed");			  
			  throw "ERR";
			}
			if(json.by!="0xEe5D4A98Ca5A77b5245Af9F235Eab4CB405be185") {
			  vorpal.log("ERR: Wrong Signer");			  
			  throw "ERR";
			}	
			node.storage.setItemSync("gsi",data.getBody().toString());			
			if(typeof callback != "undefined") {
					callback(json);
			}
	});					
	},
	account:function(args,callback) {
		var node = new StromDAOBO.Node({external_id:args.user_id,testMode:true,rpc:global.rpcprovider});		
		vorpal.log("Address:",node.wallet.address);
		vorpal.log("Private Key:",node.wallet.privateKey);
		callback();
	},
	startSession:function (args,callback) {
	var node = new StromDAOBO.Node({external_id:args.user_id,testMode:true,rpc:global.rpcprovider});
	autostrom.getGSI(args.plz,node,function(json) {
		node.mpr().then(function(mpr) {			
			mpr.storeReading(args.reading).then(function(o) {					
					var gsi = JSON.parse(json.data.gsi);
					var now = new Date().getTime()/1000;
					vorpal.log("Netzdienlichkeitprämie Autostrom");
					for(var i=0;i<gsi.length;i++) {
						if(gsi[i].epochtime>now) {
							vorpal.log(new Date(gsi[i].epochtime*1000).toLocaleString(),(gsi[i].value/1000000000).toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 }));
						}
					}
					callback();
			});
		});
	});
	},
	stopSession:function(args,callback) {
	var node = new StromDAOBO.Node({external_id:args.user_id,testMode:true,rpc:global.rpcprovider});	
	var receipt={};
	receipt.start = {};
	receipt.start.gsi=node.storage.getItemSync("gsi");
	node.mpr().then(function(mpr) {		
		mpr.readings(node.wallet.address).then(function(last_reading) {
			receipt.start.time = last_reading.time.toString();
			receipt.start.power = last_reading.power.toString();
			receipt.end={};
			
			mpr.storeReading(args.reading).then(function(o) {
				mpr.readings(node.wallet.address).then(function(o) {
					receipt.end.time=o.time.toString();
					receipt.end.power=o.power.toString();
					
					autostrom.getGSI(args.plz,node,function(gsi_end) {										
						var gsi_start=JSON.parse(JSON.parse(receipt.start.gsi).data.gsi);
						
						receipt.end.gsi=gsi_end;
						
						 var ee_val=gsi_start[0].value;
						 var ee_cnt=1;
						 
						 for(var i=0;i<gsi_start.length;i++) {
							var b=gsi_start[i];
							if(b.epochtime<last_reading.time) {
									start_ee=b;
							} else {
								if(b.epochtime<o.time.toString()) {
									ee_val+=b.value;
									ee_cnt++;
								}												
							}
						 }
						
						var ee_prm=0;
						if(ee_cnt!=0) ee_prm=((ee_val/ee_cnt)*(args.charged_energy/1000))/100;
						
						receipt.value = {};
						receipt.value.power=args.charged_energy;
						receipt.value.ee = ee_val;
						receipt.value.bonus = ee_prm;
						receipt.value.cnt = ee_cnt;													
						
						
						
						var msg={};
						msg.by=node.wallet.address;
						msg.data=JSON.stringify(receipt);
						msg.hash=node.hash(msg.data);
						msg.signature=node.sign(msg.data);
						
						var FormData = request.FormData;
						var data = new FormData();
						 
						data.append('json', JSON.stringify(msg));
						request('POST',"https://stromdao.de/crm/service/gsi/receipt/", {form: data}).then(function(d) {
								node.storage.setItemSync("gsi",null); 
								var resp=JSON.parse(d.getBody().toString());
								vorpal.log("https://www.stromkonto.net/?account="+node.wallet.address+"&sc="+resp.blg);
								callback();
						});
					});
				});				
			});
		});
	});
}
};
autostrom = module.exports;

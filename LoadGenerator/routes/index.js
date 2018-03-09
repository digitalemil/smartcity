var express = require('express');
var router = express.Router();
var app = express();
var url= require('url');
var request = require('request');

let listener= process.env.LISTENER;
let posts= 0;
let stopped= false;
let delay= 10;
var radius_meters = Number(process.env.RADIUS);
let json= new String(process.env.APPDEF);
json= json.replace(/\'/g, '\"');
let appdef= JSON.parse(json);
appdef.byod= "yes";
appdef.fname= "oystercardjourneys.csv";
appdef.frequency= 10;

let fields= new Array(); 
let types= new Array();

var londonAir = require('london-air');
   
let n= 0;
const fs = require('fs');
let length;
let lines= new Array();
let loclines= new Array();
let locations= new Object();
let locationkeys= new Array();
let nl= 0;
let sentlines= 0;
let fisjson= false;


function parkingMeterData() {

  for(i= 0; i< 256; i++) {
    let n= Math.floor(Math.random()* locationkeys.length);
      let key= locationkeys[n];
      let obj= new Object();
      obj.id= id++;
      obj.type= 5;
      obj.message1= key.toString();
      let v= Math.floor(Math.random()*2);
    
      obj.message2= v==0?"Free":"Occupied" 
      obj.value= v;
      obj.status= obj.message2;
      obj.event_timestamp= getDateTime(obj.id);
      let max= Math.floor(Math.random()*250);
      obj.intvalue1= Math.floor(max* Math.random());
      if(v!=0)
        obj.intvalue1= max;
      obj.intvalue2= max;
      obj.location= locations[key]
      posts++;
 
      request.post(listener, {form:JSON.stringify(obj)}, function(err, response, body) {
        if(err!=null) {
          console.log(err+" "+JSON.stringify(obj));
      }
      });
  }
  setTimeout(solarPanelData, 30000);
}

function trafficLightsData() {

  for(i= 0; i< 256; i++) {
    let n= Math.floor(Math.random()* locationkeys.length);
      let key= locationkeys[n];
      let obj= new Object();
      obj.id= id++;
      obj.type= 4;
      obj.message1= key.toString();
      let v= Math.floor(Math.random()*3);
    
      obj.message2= v==0?"Red":(v==1?"Yellow":"Green") 
      obj.value= v;
      obj.status= getRandomStatus();
      obj.event_timestamp= getDateTime(obj.id);
      obj.intvalue1= getRandomInt();
      obj.intvalue2= getRandomInt();
      obj.location= locations[key]
      posts++;
 
      request.post(listener, {form:JSON.stringify(obj)}, function(err, response, body) {
        if(err!=null) {
          console.log(err+" "+JSON.stringify(obj));
      }
      });
  }
  setTimeout(solarPanelData, 30000);
}


function solarPanelData() {

  for(i= 0; i< 64; i++) {
    let n= Math.floor(Math.random()* locationkeys.length);
      let key= locationkeys[n];
      let obj= new Object();
      obj.id= id++;
      obj.type= 3;
      obj.message1= key.toString();
      obj.message2= "";
      obj.status= getRandomStatus();
      obj.event_timestamp= getDateTime(obj.id);
      let max= Math.floor(1+Math.random()*4)*100;
      obj.intvalue1= Math.floor(Math.random()* max);
      obj.value= Math.floor((1.00001*obj.intvalue1)/max*100.0);
      obj.intvalue2= max;
      obj.location= locations[key]
      posts++;
 
      request.post(listener, {form:JSON.stringify(obj)}, function(err, response, body) {
        if(err!=null) {
          console.log(err+" "+JSON.stringify(obj));
      }
      });
  }
  setTimeout(solarPanelData, 30000);
}

function londonAirData() {
  londonAir.pollution.getHourlyPollutionLevels(null, function(error, response) {
    if(error!= null) {
      setTimeout(londonAirData, 1000);  
      return;
    }
    
    let obj= JSON.parse(response);
    let data= new Array();
    
    let n= 0;
    for(i= 0; i< obj.HourlyAirQualityIndex.LocalAuthority.length; i++) {
      if(obj.HourlyAirQualityIndex.LocalAuthority[i].Site== undefined)
        continue;
      for(j= 0; j< obj.HourlyAirQualityIndex.LocalAuthority[i].Site.length; j++) {
        data[n++]= obj.HourlyAirQualityIndex.LocalAuthority[i].Site[j];
      }
    }
    for(i =0; i< data.length; i++) {
      let obj= new Object();
      obj.id= id++;
      obj.type= 2;
      obj.message1= data[i]["@SiteName"];

      let species;
      if(obj.message2= data[i].Species.isArray) 
        species= data[i].Species[0];
        else
        species= data[i].Species;

      obj.message2= species["@SpeciesDescription"];
      obj.value= species["@AirQualityIndex"];
      obj.status= species["@AirQualityBand"];
      obj.event_timestamp= getDateTime(obj.id);
      obj.intvalue1= data[i]["@OwnerID"];
      obj.intvalue2= 0;
      obj.location= data[i]["@Latitude"]+","+data[i]["@Longitude"];
      posts++;
 
      request.post(listener, {form:JSON.stringify(obj)}, function(err, response, body) {
        if(err!=null) {
          console.log(err+" "+JSON.stringify(obj));
      }
      });
    }})
    setTimeout(londonAirData, 1000*60*60);
  };




for(var i= 0; i< appdef.fields.length; i++) {
 // console.log(JSON.stringify(appdef.fields));
  fields[i] = appdef.fields[i].name;
  types[i] = appdef.fields[i].type;
}
//console.log(JSON.stringify(fields));

/* GET home page. */
router.get('/', function(req, res, next) {
  let autostart= appdef.autostart;
  if(autostart== undefined || autostart== null || autostart== "") {
    autostart= false;
  }
  res.render('index', { title: appdef.name, posts: posts, autostart: autostart, byod: appdef.byod, fname:appdef.fname});
});

let begintime= new Date().getTime();
let endtime= new Date().getTime()+ 4*60*60*1000;
console.log("Now: "+new Date().getTime());
console.log("Begin: "+begintime);
console.log("End: "+endtime+" "+(begintime< endtime));
let id= begintime;

delay= 20;




function readDataFile() {
  console.log("Reading file...");
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(process.env.APPDIR+"/public/"+appdef.fname)
});

  lineReader.on('line', function (line) {
  if(line.length== 0)
    return;
   // console.log("Line: "+line);
  if(nl== 0) {
    try {
      let jl= JSON.parse(line);
      fisjson= true;
    }
    catch(ex) {
      fisjson= false;
    }
  }
  lines[nl++]= line;
});

lineReader.on('close', function() {
  if(appdef.autostart==="true") {
    setTimeout(loadFromFile, Math.floor(1000/appdef.frequency));  
  }
  console.log("Lastline read... ");
  readLocationFile();
});

};

readDataFile();


function readLocationFile() {
  console.log("Reading file...");
  let nloc= 0;
var locReader = require('readline').createInterface({
  input: require('fs').createReadStream(process.env.APPDIR+"/public/tubestations.txt")
});

  locReader.on('line', function (line) {
  if(line.length== 0)
    return;
  let locsplits= line.split("\t");
  locations[locsplits[0]]= locsplits[1]+","+locsplits[2];
  locationkeys[nloc++]= locsplits[0];
  if(nl== 0) {
    try {
      let jl= JSON.parse(line);
      fisjson= true;
    }
    catch(ex) {
      fisjson= false;
    }
  }
  lines[nl++]= line;
});

locReader.on('close', function() {
   console.log("Last location read... ");
   londonAirData();
   parkingMeterData();
   trafficLightsData();
   solarPanelData();
   loadFromOysterFile();
});

};

function getMessageString(i) {
  try {
    let csv= lines[i+1];
    let splits= csv.split(",");
    splits[4]= splits[4].substring(1, splits[4].length - 1);
    let obj= new Object();
    obj.id= id++;
    obj.type= 1;
    obj.message1= splits[4];
    splits[15]= splits[15].substring(1, splits[15].length - 1); 
    obj.message2= splits[15];
    obj.value= 1;
    obj.status= "ok";
    obj.event_timestamp= getDateTime(obj.id);
    splits[7]= splits[7].substring(1, splits[7].length - 1);
    obj.intvalue1= splits[7];
    obj.intvalue2= splits[0];
    if(locations[splits[4]] == undefined) {
      return null;
    }
    obj.location= locations[splits[4]];
    return obj;
  }
  catch(e) {
    return null;
  }
};

function loadFromOysterFile() {
    let msg= null;
    
    while(msg== null) {
      msg= getMessageString(sentlines++);
    }
    console.log("Message: "+JSON.stringify(msg));
    
  posts++;
 
  request.post(listener, {form:JSON.stringify(msg)}, function(err, response, body) {
    if(err!=null) {
      console.log(err);
   }
  });

  sentlines++;
  if(sentlines >=  nl) {
    sentlines= 0;
  }
  setTimeout(loadFromOysterFile, Math.floor(1000/appdef.frequency));
};


function getRandomLocation() {
  console.log("**DEBUG: Location is: "+JSON.stringify(location))
  if ( isNaN(location.latitude) ){
    //Location has not been passed as parameter, use airport coordinates
    let a= airports[Math.floor(Math.random() * 6977)];
    let splits= a.split(",");
    return splits[6].trim()+","+splits[7].trim();
  }  
};

function getRandomInt() {
  return Math.floor(Math.random() * 101);
};

function getRandomLong() {
  return Math.floor(Math.random() * 10001);
};

function getRandomFloat() {
  return (Math.random() * 1000001);
};

function getRandomBoolean() {
  if(Math.random()> 0.5)
    return true;
  return false;
};


let now= new Date().getTime();
let d1= new Date(now);
let d2= new Date(now+2020);

function getDateTime(dt) {
  let d= new Date(dt);

  let day= d.getUTCDate();

  		let daystring= ""+day;
			
  			if(day< 10)
    				daystring="0"+daystring;
  			let month= d.getUTCMonth()+1;
  			let monthstring= ""+month;
  			if(month< 10)
    				monthstring="0"+monthstring;
            		
		        let hour= d.getUTCHours();
			let hourstring= ""+hour;
  			if(hour< 10)
    				hourstring="0"+hourstring;
            		
			let minute= d.getUTCMinutes();
			let minutestring= ""+minute;
  			if(minute< 10)
    				minutestring="0"+minutestring;
            		    
      let ms= d.getUTCMilliseconds()/1000;
			let second= d.getUTCSeconds();
     	let secondstring= ""+(second+ms);
  			if(second< 10)
    				secondstring="0"+secondstring;
          //  console.log(d.getFullYear()+"-"+monthstring+"-"+daystring+"T"+hourstring+":"+minutestring+":"+secondstring+"Z");
  return d.getFullYear()+"-"+monthstring+"-"+daystring+"T"+hourstring+":"+minutestring+":"+secondstring+"Z";
};

function getRandomDateTime() {
  let now= new Date().getTime();
  let d= new Date(now - Math.floor(Math.random()*1000*100000*14));
  let day= d.getUTCDate();
			let daystring= ""+day;
			
  			if(day< 10)
    				daystring="0"+daystring;
  			let month= d.getUTCMonth()+1;
  			let monthstring= ""+month;
  			if(month< 10)
    				monthstring="0"+monthstring;
            		
		        let hour= d.getUTCHours();
			let hourstring= ""+hour;
  			if(hour< 10)
    				hourstring="0"+hourstring;
            		
			let minute= d.getUTCMinutes();
			let minutestring= ""+minute;
  			if(minute< 10)
    				minutestring="0"+minutestring;
            		    
      let ms= d.getUTCMilliseconds()/1000;
			let second= d.getUTCSeconds();
			let secondstring= ""+(second+ms);
  	
      	if(second< 10)
    				secondstring="0"+secondstring
			    

  return d.getFullYear()+"-"+monthstring+"-"+daystring+"T"+hourstring+":"+minutestring+":"+secondstring+"Z";
};


function getRandomStatus() {
  let v= Math.random();
  if(v< 0.9)
    return "ok";
  if(v< 0.95)
    return "Error 0x45ab65: needs cleaning";
  return "No signal"    
};

function getRandomForType(t) {
  if(t === "String") 
    return getRandomString();
  if(t === "Integer") 
    return getRandomInt();
  if(t === "Long") 
    return getRandomLong();
  if(t === "Double") 
    return getRandomFloat();
  if(t === "Boolean") 
    return (Math.random()>0.5)?true:false;
  if(t === "Date/Time" || t === "Date/time") 
    return getRandomDateTime();
  if(t === "Location") 
    return getRandomLocation();
};

 

module.exports = router;



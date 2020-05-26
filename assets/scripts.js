// Home
var hue_ip = '192.168.1.17';
var api_key = '7EkPnY9swLgvHyD7ct4fVoyHIsa8N9YC1ChmQJ9d';

// Büro
// var api_key = 'ja1eBaEzxfPjVzfd0kB4bDC713pP2yzZXq1ieRhc';
// var hue_ip = '192.168.178.25';


// V O R G E H E N
// 1. rooms laden
// 2. lampen den rooms zuteilen
// 3. zeugs der lampen laden
// 4. anzeigen


let all_rooms = [];
let all_lamps = [];
let all_scenes = [];


function get_rooms(){
  $.get( 'http://' + hue_ip + '/api/' + api_key + '/groups/', function(data){
    ui_reset();
    got_rooms( data );
  })
  .done(function() {
    
  })
  .fail(function() {
    console.log( "error" );
    console.log( data );
  })
  .always(function() {
    
  });
}


function got_rooms( data ){
  all_rooms = [];
  all_lamps = [];

  log(data);
  var Items = JSON.parse(JSON.stringify(data));

  for(var key in Items){
    var item = Items[key];
    var room = new clsRoom(item, key);
    all_rooms.push(room);
  }

  listRooms();
}


function listRooms(){
  log(all_rooms);
  
  for (var ind in all_rooms) {
    var room = all_rooms[ind];
    var html = room.getHTML();

    ui_addToList(html);
  }

  // event-handler
  $( ".lamp" ).on("click", function(){
    var lampid = $(this).data("lampid");
    toggleLamp(lampid);
  });

  $( ".lamp" ).on("click", async function(){
    var lampid = $(this).data("lampid");
    lamp_wait_state(lampid);
  });

  $( ".room_switch" ).on("click", async function(){
    var roomid = $(this).data("switch-room");
    var value = $(this).data("switch-value");

    toggleRoom(roomid, value);
  });

  $( ".room_switch" ).on("click", async function(){
    var roomid = $(this).data("switch-room");
    room_wait_state(roomid);
  });


  $( ".scene" ).on("click", function(){
    var sceneid = $(this).data("sceneid");
    var roomid = $(this).data("roomid");
    console.log(sceneid + roomid);
    setScene(sceneid, roomid);
  });

  $( ".scene" ).on("click", async function(){
    var sceneid = $(this).data("sceneid");
    scene_wait_state(sceneid);
  });
  
}

// ------------------------------------------------------------------------
function toggleRoom(roomid, value){
  var room = getRoom(roomid);
  var newval = false;
  if (value == false){newval = true}; 

  for(var key in room.lamps){
    var item = room.lamps[key];
    var lampid = item.lampid;

    setLampState(lampid, newval);
  }
}

function toggleLamp(lampid){
  var thisLamp = getLamp(lampid);
  log(thisLamp);
  console.log (thisLamp.state);
  var newstat;

  if (thisLamp.state == true){
    newstat = false;
    thisLamp.state = false;
  }else{
    newstat = true;
    thisLamp.state = true;
  }

  setLampState(lampid, newstat);
}


function setLampState(lampid, newstat){
  $.ajax({
    contentType: 'application/json',
    data: '{"on":' + newstat + '}',
    dataType: 'json',
    success: function(data){
        console.log(data);
        get_rooms();
    },
    error: function(){
      alert("error");
      console.log(data);
    },
    processData: false,
    type: 'PUT',
    url: 'http://' + hue_ip + '/api/' + api_key + '/lights/' + lampid + '/state/'
  });
}

function setScene(sceneid, roomid){
  console.log('http://' + hue_ip + '/api/' + api_key + '/groups/' + roomid + '/action/');
  $.ajax({
    contentType: 'application/json',
    data: '{"scene" : "' + sceneid + '"}',
    dataType: 'json',
    success: function(data){
        console.log(data);
        get_rooms();
    },
    error: function(){
      alert("error");
      console.log(data);
    },
    processData: false,
    type: 'PUT',
    url: 'http://' + hue_ip + '/api/' + api_key + '/groups/' + roomid + '/action/'
  });
};



// -------------------------------------------------------


function getLamp(lampid){
  for( i = 0; i < all_lamps.length; i++){
    if (all_lamps[i].lampid == lampid){
      return all_lamps[i];
    }
  }
  return false;
}

function getRoom(roomid){
  for( i = 0; i < all_rooms.length; i++){
    if (all_rooms[i].uniqueID == roomid){
      return all_rooms[i];
    }
  }
  return false;
}
function getScene(sceneid){
  for( i = 0; i < all_scenes.length; i++){
    if (all_scenes[i].sceneid == sceneid){
      return all_scenes[i];
    }
  }
  return false;
}




// ------------------------------------------------------------------------
// Helper
function isObject(obj) {
  return obj !== null && typeof obj === 'object' && Array.isArray(obj) === false;
}
function getRoomID(){
  return "room" + Math.floor((Math.random() * 100000) + 1);
}
function getLampID(){
  return "lamp" + Math.floor((Math.random() * 100000) + 1);
}
function getSceneID(){
  return "scene" + Math.floor((Math.random() * 100000) + 1);
}
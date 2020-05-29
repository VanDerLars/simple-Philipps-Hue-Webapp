// Home
// var hue_ip = '192.168.1.17';
// var api_key = '7EkPnY9swLgvHyD7ct4fVoyHIsa8N9YC1ChmQJ9d';

// Büro
// var api_key = 'ja1eBaEzxfPjVzfd0kB4bDC713pP2yzZXq1ieRhc';
// var hue_ip = '192.168.178.25';


// V O R G E H E N
// 1. rooms laden
// 2. lampen den rooms zuteilen
// 3. zeugs der lampen laden
// 4. anzeigen


// startup
$(document).ready(function(){

  // create a bridge Object
  bridge = new clsBridge();
  hue_ip = bridge.ip;
  api_key = bridge.api_key;
  
  // load everything
  get_rooms();
});




// variables
let bridge = null;
let hue_ip = '';
let api_key = '';
let all_rooms = [];
let all_lamps = [];
let all_scenes = [];


// go for it
function get_rooms(){
  $.get( '//' + hue_ip + '/api/' + api_key + '/groups/', function(data){
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
    var lamp = getLamp(lampid)
    lamp.toggleLamp();
    // toggleLamp(lampid);
  });

  $( ".lamp" ).on("click", async function(){
    var lampid = $(this).data("lampid");
    lamp_wait_state(lampid);
  });

  $( ".room_switch" ).on("click", async function(){
    var roomid = $(this).data("switch-room");
    var value = $(this).data("switch-value");

    var room = getRoom(roomid);
    room.toggleRoom();

    // toggleRoom(roomid, value);
  });

  $( ".room_switch" ).on("click", async function(){
    var roomid = $(this).data("switch-room");
    room_wait_state(roomid);
  });


  $( ".scene" ).on("click", function(){
    var sceneid = $(this).data("sceneid");
    var roomid = $(this).data("roomid");
    var scene = getScene(sceneid);
    console.log(scene);

    scene.setScene();
    
    // setScene(sceneid, roomid);
  });

  $( ".scene" ).on("click", async function(){
    var sceneid = $(this).data("sceneid");
    scene_wait_state(sceneid);
  });
  
}
// http//192.168.178.25/api/ja1eBaEzxfPjVzfd0kB4bDC713pP2yzZXq1ieRhc/groups/4/action/{"scene" : "Z7CP6oAoiPzxlKw"}
// http//192.168.178.25/api/ja1eBaEzxfPjVzfd0kB4bDC713pP2yzZXq1ieRhc/groups/3/action/{"scene" : "Z7CP6oAoiPzxlKw"}

// ------------------------------------------------------------------------





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

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
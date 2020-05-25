// Home
// var hue_ip = '192.168.1.17';
// var api_key = '7EkPnY9swLgvHyD7ct4fVoyHIsa8N9YC1ChmQJ9d';

// Büro
var api_key = 'ja1eBaEzxfPjVzfd0kB4bDC713pP2yzZXq1ieRhc';
var hue_ip = '192.168.178.25';


// V O R G E H E N
// 1. rooms laden
// 2. lampen den rooms zuteilen
// 3. zeugs der lampen laden
// 4. anzeigen



function addLampToList(name, room, state){
  var lamp = new clsLamp(name, room, state);
  var html = lamp.getHTML();
  log(html);

  var oldhtml = $( ".list" ).html();
  log(oldhtml);
  $( ".list" ).html(oldhtml + html);
}




function get_rooms(){
  $.get( 'http://' + hue_ip + '/api/' + api_key + '/groups/', function(data){
    ui_reset();
    got_rooms( data );
    log( "first success" );
  })
  .done(function() {
    log( "second success" );
  })
  .fail(function() {
    log( "error" );
  })
  .always(function() {
    log( "finished" );
  });
}


let rooms = [];
function got_rooms( data ){
  rooms = [];

  log(data);
  var Items = JSON.parse(JSON.stringify(data));

  for(var key in Items){
    var item = Items[key];
    var room = new clsRoom(item);
    rooms.push(room);
  }

  listRooms();
}


function listRooms(){
  log(rooms);
  
  for (var ind in rooms) {
    var room = rooms[ind];
    var html = room.getHTML();

    ui_addToList(html);
  }
}










function isObject(obj) {
  return obj !== null && typeof obj === 'object' && Array.isArray(obj) === false;
}
function getRoomID(){
  return "room" + Math.floor((Math.random() * 100000) + 1);
}
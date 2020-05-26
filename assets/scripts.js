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


let all_rooms = [];
let all_lamps = [];


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


function got_rooms( data ){
  all_rooms = [];
  all_lamps = [];

  log(data);
  var Items = JSON.parse(JSON.stringify(data));

  for(var key in Items){
    var item = Items[key];
    var room = new clsRoom(item);
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
    toggleLamp(lampid)
  });
}

// ------------------------------------------------------------------------
function toggleLamp(lampid){
  var thisLamp = getLamp(lampid);
  log(thisLamp);
}


function getLamp(lampid){
  for( i=1;i<all_lamps.length-1;i++){
    if (all_lamps[i].lampid = lampid){
      return all_lamps[i];
    }
  }
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
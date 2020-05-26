
// UI
function toggle_debug(){
$('.content').toggleClass('debug-hidden');
}
function ui_reset(){
    $( ".list" ).html("");
}
function ui_addToList(html){
    var oldhtml = $( ".list" ).html();
    $( ".list" ).html(oldhtml + html);
}


$(document).ready(function(){
    get_rooms();
});



function switchView(view){
    if(view == 'left'){
        $('.switch-item.right').removeClass('selected');
        $('.switch-item.left').addClass('selected');

        $('.content').addClass('lamps');
        $('.content').removeClass('scenes');
    }else{
        $('.switch-item.right').addClass('selected');
        $('.switch-item.left').removeClass('selected');

        $('.content').removeClass('lamps');
        $('.content').addClass('scenes');
    }
}


function lamp_wait_state(lampid){
    var thisLamp = getLamp(lampid);
    $('.lamp_' + thisLamp.lampid).addClass("load");
}
function scene_wait_state(sceneid){
    var thisScene = getScene(sceneid);
    $('#scene_' + thisScene.uniqueID).addClass("load");
}

function room_wait_state(roomid){
    var thisRoom = getRoom(roomid);
    var id = thisRoom.uniqueID;
    $('#switch_' + id).addClass("load");
}


// helper
var log_on = true;
function toggle_log(){
    if(log_on == true){
        log_on = false
        console.log('log: false');
    }else{
        log_on = true
        console.log('log: true');
    }
}

function log(text){
    if(log_on == true){
        console.log(text);
        
        if (isObject(text) == true){
            text = text.stringify;
        };
        $( ".result" ).html(text + '<hr>' + $( ".result" ).html());
    }
}
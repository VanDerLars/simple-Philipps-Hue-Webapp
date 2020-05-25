
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
        
        
        if (isObject(text) == true){text = text.stringify};
        $( ".result" ).html(text + '<hr>' + $( ".result" ).html());
    }
}
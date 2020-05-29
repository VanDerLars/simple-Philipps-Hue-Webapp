class clsBridge{
    constructor(){
        this.getIP();
        this.getUser();
    }

    getIP(){
        //https://discovery.meethue.com/
        var bridgelocation;
        jQuery.ajax({
          url: 'https://discovery.meethue.com/',
          success: function (result) {
            bridgelocation = result;
          },
          async: false
        });
        if(bridgelocation.length == 0){
            console.log('no Bridge detected');
            this.ip = "error";
        }else{
            console.log('Bridge detected in the wider network');
            this.data = bridgelocation;

            var bridgeItem = this.data["0"];
            console.log(bridgeItem);

            this.ip = bridgeItem.internalipaddress;
            this.id = bridgeItem.id;
        }

    }
    getUser(){
        
        var username_from_cookie = getCookie("username");

        if (username_from_cookie == ""){
                // get new username from bridge
            var userdata;
            this.url = 'http://' + this.ip + '/api/';
            console.log (this.url);

            $.ajax({
                contentType: 'application/json',
                data: '{"devicetype":"simple_hue_webapp_by_lars_lehmann"}',
                dataType: 'json',
                success: function(data){
                    userdata = data;
                },
                error: function(data){
                    console.log("error");
                    console.log(data);
                },
                processData: false,
                type: 'POST',
                url: this.url,
                async: false
            });
            this.userdata = userdata;
            var userItem = this.userdata[0];

            console.log(userItem);

            if ('error' in userItem){
                // error
                var r = confirm('Welcome, \n\nPress now the button of your Philips Hue Bridge to grant this site access. \n\nAfter that, you have 15 seconds to click the "OK" button here.');
                if (r == true) {
                    alert('Retry to connect...');
                    this.getUser();
                } else {
                    alert('Hue Bridge not connected');
                }
            }else{
                // success
                if ('success' in userItem){
                    var username = userItem.success.username;
                    this.api_key = username;
                    setCookie("username", username, 10000);
                    console.log("username saved in a cookie.")
                }else{
                    alert('An unexpected Error occured.');
                }
            }

        } else {
            // username from cookie
            this.api_key = username_from_cookie;
            console.log('got username from cookie: ' + username_from_cookie);
        }

        // this.api_key = '7EkPnY9swLgvHyD7ct4fVoyHIsa8N9YC1ChmQJ9d';
    }
}




class clsRoom{
    constructor(data, roomid) {
      this.data = data;
  
      this.name = data.name;
      this.type = data.type;
      this.state = data.state;
      this.lights = data.lights;
      this.uniqueID = getRoomID();
      this.lamps = [];
      this.scenes = [];
      this.roomid = roomid;
      
      this.getLights();
      this.getScenes();
    }
  
    getLights(){
    //   log (this);
  
      for (var idx = 0; idx < this.lights.length; idx++) {
        var item = this.lights[idx];
        
        // synch call for getting the lamp
        var lampData;
        jQuery.ajax({
          url: 'http://' + hue_ip + '/api/' + api_key + '/lights/' + item + '/',
          success: function (result) {
            lampData = result;
          },
          async: false
        });

        var lamp = new clsLamp(lampData, this, item);
        all_lamps.push(lamp);
        this.lamps.push(lamp);

        this.lampstatuses = this.getStatus();
      }
  
    }

    getScenes(){
        var scenedata = '';
        all_scenes = [];

        jQuery.ajax({
          url: 'http://' + hue_ip + '/api/' + api_key + '/scenes/',
          success: function (result) {
            scenedata = result;
          },
          async: false
        });

        for(var key in scenedata){
            var item = scenedata[key];

            var scene = new clsScene(item, this.roomid, key);
            all_scenes.push(scene);

            if (this.roomid == scene.group){
                this.scenes.push(scene);
            }
          }
    }

    getHTML(){
        var lampHTML = this.getLampHTML();
        var sceneHTML = this.getSceneHTML();
        var stat = this.lampstatuses;
        var ret = `
            <div class="room" id="` + this.uniqueID + `">
                <div class="room_switch ` + stat + `" id="switch_` + this.uniqueID + `" data-switch-room="` + this.uniqueID + `" data-switch-value="` + stat + `">
                    <div class="status"></div>
                    Switch
                </div>
                <div class="name">` +  this.name + `</div>
                <div class="type">` +  this.type + `</div>
                <div class="lamps">` +  lampHTML + `</div>
                <div class="scenes">` +  sceneHTML + `</div>
            </div>
        `;
        return ret;
    }
    getLampHTML(){
        var html = "";
        for(var key in this.lamps){
            var item = this.lamps[key];
            var oldhtml = html;
            var thishtml = item.html;
            html = oldhtml + thishtml;
        }
        return html;
    }
    getSceneHTML(){
        var html = "";
        for(var key in this.scenes){
            var item = this.scenes[key];
            var oldhtml = html;
            var thishtml = item.html;
            html = oldhtml + thishtml;
        }
        return html;
    }
    getStatus(){
        var has_true = false;
        var has_false = false;
        for(var key in this.lamps){
            var item = this.lamps[key];
            if(item.state == true){has_true = true}
            if(item.state == true){has_false = true}
        }

        if(has_true == true, has_false == false){
            return 'false';
        }
        if(has_true == false, has_false == true){
            return 'true';
        }
    }

    toggleRoom(){
        var stat = this.lampstatuses;
        var room = this;
        var newval = false;

        if (stat == 'false'){newval = true}; 
      
        for(var key in room.lamps){
          var item = room.lamps[key];
      
          item.setLampState(newval);
        }
      }


  }
  
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


class clsScene{
    constructor(data, room, id){
        this.data = data;

        this.roomid = room;
        this.sceneid = id;

        this.name = data.name;
        this.group = data.group;
        this.lamps = data.lights;
        this.type = data.type;

        this.uniqueID = getSceneID();

        this.html = this.getHTML();
    }

    getHTML() {
        var ret = `
            <div class="scene" id="scene_` + this.uniqueID + `" data-sceneid="` + this.sceneid + `" data-roomid="` + this.roomid + `">
                <div class="status"></div>
                <div class="scene_name">` + this.name + `</div>
                <div class="scene_type">Type: ` + this.type + `</div>
            </div>
        `;
        return ret;
    }

    setScene(){
        $.ajax({
          contentType: 'application/json',
          data: '{"scene" : "' + this.sceneid + '"}',
          dataType: 'json',
          success: function(data){
              get_rooms();
          },
          error: function(){
            alert("error");
          },
          processData: false,
          type: 'PUT',
          url: 'http://' + hue_ip + '/api/' + api_key + '/groups/' + this.group + '/action/'
        });
      };
      
}




  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  class clsLamp{
    constructor(data, room, id) {
      this.data = data;
      this.lampid = id;
  
      this.name = data.name;
      this.state = data.state.on;
      this.room = room;
      this.uniqueID = getLampID();

      this.html = this.getHTML();
    }

    getHTML() {
        var ret = `
            <div class="lamp ` + this.state + ` lamp_` + this.lampid + `" id="` + this.uniqueID + `" data-lampid="` + this.lampid + `">
                <div class="status"></div>
                <div class="lamp_name">` + this.name + `</div>
                <div class="lamp_state">Status: ` + this.state + `</div>
            </div>
        `;
        return ret;
    }
  
    toggleLamp(){
        var thisLamp = this;
        
        var newstat;
      
        if (thisLamp.state == true){
          newstat = false;
          thisLamp.state = false;
        }else{
          newstat = true;
          thisLamp.state = true;
        }
      
        this.setLampState(newstat);
      }

      setLampState(newstat){
        $.ajax({
          contentType: 'application/json',
          data: '{"on":' + newstat + '}',
          dataType: 'json',
          success: function(data){
              get_rooms();
          },
          error: function(){
            alert("error");
          },
          processData: false,
          type: 'PUT',
          url: 'http://' + hue_ip + '/api/' + api_key + '/lights/' + this.lampid + '/state/'
        });
      }


  }
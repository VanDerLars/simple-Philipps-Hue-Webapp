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
        // console.log(lampData);

        var lamp = new clsLamp(lampData, this, item);
        // console.log (lamp);
        all_lamps.push(lamp);
        this.lamps.push(lamp);

        this.lampstatuses = this.getStatus();
      }
  
    //   log(this.lamps);
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
        // console.log(lampHTML);
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
        // console.log(html);
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
        // console.log(html);
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
  }
  
  // ------------------------------------------------------------


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
}




  // ------------------------------------------------------------
  
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
  
  }
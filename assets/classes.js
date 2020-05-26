class clsRoom{
    constructor(data) {
      this.data = data;
  
      this.name = data.name;
      this.type = data.type;
      this.state = data.state;
      this.lights = data.lights;
      this.uniqueID = getRoomID();
      this.lamps = [];
      
      this.getLights();
    }
  
    getLights(){
      log (this);
  
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
        console.log(lampData);
        
        var lamp = new clsLamp(lampData, this, item);
        all_lamps.push(lamp);
        this.lamps.push(lamp);
      }
  
      log(this.lamps);
    }
  
    getHTML(){
        var lampHTML = this.getLampHTML();
        // console.log(lampHTML);
        var ret = `
            <div class="room" id="` + this.uniqueID + `">
            <div class="name">name: ` +  this.name + `</div>
            <div class="type">type: ` +  this.type + `</div>
            <div class="lamps_title">lamps:</div>
            <div class="lamps">` +  lampHTML + `</div>
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
            <div class="lamp ` + this.state + `" id="` + this.uniqueID + `" data-lampid="` + this.lampid + `">
                <div class="lamp_name">Name: ` + this.name + `</div>
                <div class="lamp_state">Status: ` + this.state + `</div>
            </div>
        `;
        return ret;
    }
  
  }
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
  
        var lamp = new clsLamp(lampData, this);
        this.lamps.push(lamp);
      }
  
      log(this.lamps);
    }
  
    getHTML(){
        var lampHTML = this.getLampHTML();
        // console.log(lampHTML);
        return `
            <div class="room" id="` + this.uniqueID + `">
            <div class="name">name: ` +  this.name + `</div>
            <div class="type">type: ` +  this.type + `</div>
            <div class="lamps">lamps: ` +  lampHTML + `</div>
            </div>
        `;
    }
    getLampHTML(){
        var html = "";
        for(var key in this.lamps){
            var item = this.lamps[key];
            var oldhtml = html;
            var thishtml = item.getHTML;
            html = oldhtml + thishtml;
        }
        log(html);
        return html;
    }
  }
  
  // ------------------------------------------------------------
  
  class clsLamp{
    constructor(data, room) {
      this.data = data;
  
      this.name = data.name;
      this.state = data.state.on;
      this.room = room;
    }

    getHTML(){
        var ret = `
            <div class="lamp">
                <div class="name">` + this.name + `</div>
                <div class="room">` + this.room + `</div>
                <div class="state">` + this.state + `</div>
            </div>
        `;
        console.log(ret);
        return ret;
    }
  
  }
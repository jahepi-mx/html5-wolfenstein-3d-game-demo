let atlasInstance = null;

class Atlas {
    
    constructor() {
        this.loaded = false;
        this.loadedCount = 0;
        this.xmls = ["assets/sprites/sprites.xml"];
        this.keys = ["sprites"];
    }
    
    static getInstance() {
        if (atlasInstance === null) {
            atlasInstance = new Atlas();
        }
        return atlasInstance;
    }
    
    getLoadedRatio() {
        return this.loadedCount / this.xmls.length;
    }

    loadAll(callback, downloadCallback) {
        
        if (this.loaded) return;
        
        for (var i = 0; i < this.keys.length; i++) {
            this[this.keys[i]] = {};
        }
        this.load(0, callback, downloadCallback);
    }

    load(index, callback, downloadCallback) {        
        var xmlRequest = new XMLHttpRequest();
        xmlRequest.open("GET", this.xmls[index], true);
        var self = this;
        xmlRequest.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
               var xml = xmlRequest.responseXML;
               var elements = xml.getElementsByTagName("SubTexture");
               for (var i = 0; i < elements.length; i++) {
                   var name = elements[i].getAttribute("name");
                   name = name.replace(".png", "");
                   var x = elements[i].getAttribute("x");
                   var y = elements[i].getAttribute("y");
                   var width = elements[i].getAttribute("width");
                   var height = elements[i].getAttribute("height");
                   self[self.keys[index]][name] = {x: x, y: y, width: width, height: height};
               }
               if (index + 1 >= self.xmls.length) {
                    self.loadedCount++;
                    self.loaded = true;
                    if (downloadCallback !== null) {
                        downloadCallback();
                    }
                    if (callback !== null) {
                        callback();
                    }
                } else {
                    self.loadedCount++;
                    if (downloadCallback !== null) {
                        downloadCallback();
                    }
                    self.load(index + 1, callback, downloadCallback);
                }
            }
        };
        xmlRequest.send();
    }
};

var Response = function() {
    this.success = true;
    this.message = "";
    //this.object = '';
    this.resMessage = function(msg) {
        this.message = msg;
    };
   /* this.setObject = function(object) {
        if (object == null || typeof object !== 'object') {
            this.object = {};
        } else {
            this.object = object;
        }
    };*/

};

module.exports = function(options) {
    return new Response(options);
};





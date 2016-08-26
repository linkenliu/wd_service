
var Response = function() {
    //this.success = true;
    this.result_code = 0;
    this.result = "ok";
    //this.object = '';
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





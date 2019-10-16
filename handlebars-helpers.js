module.exports = {
    ifObject: function(item, options) {
        if(typeof item === "object") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    },
    notIfObject: function(item, options) {
        if(typeof item !== "object") {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    }
}
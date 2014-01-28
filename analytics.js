(function(global, factory) {
  if(typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.analytics = factory();
  }
}(this, function() {

  // Use hostname for GA Category
  var _category = location.hostname;

  /**
   * To Title Case 2.1 - http://individed.com/code/to-title-case/
   * Copyright 2008-2013 David Gouch. Licensed under the MIT License.
   * https://github.com/gouch/to-title-case
   */
  function toTitleCase(){
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
      if (index > 0 &&
          index + match.length !== title.length &&
          match.search(smallWords) > -1 &&
          title.charAt(index - 2) !== ":" &&
          (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
          title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }

      if (match.substr(1).search(/[A-Z]|\../) > -1) {
        return match;
      }

      return match.charAt(0).toUpperCase() + match.substr(1);
    });
  }

  function warn(msg) {
    console.warn("[analytics] " + msg);
  }

  function getGAQueue() {
    return _gaq || [];
  }

  // Event Tracking, see:
  // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
  function event(action, options) {
    options = options || {};
    var eventArgs = ["_trackEvent", _category],
        label = options.label,
        value = options.value,
        noninteraction = options.noninteraction;

    if(!action) {
      warn("Expected `action` arg.");
      return;
    }
    eventArgs.push(toTitleCase(action));

    // label: An optional string to provide additional dimensions to the event data.
    if(label) {
      if(typeof label !== "string") {
        warn("Expected `label` arg to be a String.");
      } else {
        eventArgs.push(label);
      }
    }

    // value: An optional integer that you can use to provide numerical data about
    // the user event.
    if(value) {
      if(typeof value !== "number") {
        warn("Expected `value` arg to be a Number.");
      } else {
        // Force value to int
        eventArgs.push(value|0);
      }
    }

    // noninteraction: An optional boolean that when set to true, indicates that
    // the event hit will not be used in bounce-rate calculation.
    if(noninteraction) {
      if(typeof noninteraction !== "boolean") {
        warn("Expected `noninteraction` arg to be a Boolean.");
      } else {
        eventArgs.push(noninteraction === true);
      }
    }

    getGAQueue().push(eventArgs);
  }

  return {
    event: event
  };

}));

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
  function toTitleCase(s){
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    s = trim(s);

    return s.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
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

  // GA strings need to have leading/trailing whitespace trimmed, and not all
  // browsers have String.prototoype.trim().
  function trim(s) {
    return s.replace(/^\s+|\s+$/g, '');
  }

  // See if s could be an email address. We don't want to send personal data like email.
  function mightBeEmail(s) {
    // There's no point trying to validate rfc822 fully, just look for ...@...
    return (/[^@]+@[^@]+/).test(s);
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
    if(mightBeEmail(action)) {
      warn("`action` arg looks like an email address, skipping.");
      return;
    }
    eventArgs.push(toTitleCase(action));

    // label: An optional string to provide additional dimensions to the event data.
    if(label) {
      if(typeof label !== "string") {
        warn("Expected `label` arg to be a String.");
      } else {
        if(mightBeEmail(label)) {
          warn("`label` arg looks like an email address, skipping.");
        } else {
          eventArgs.push(trim(label));
        }
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

module("event() - ga.js API", {
  setup: function() {
    _gaq = [];
  },
  teardown: function() {
    _gaq = null;
  }
});

function createEventArray() {
  return ["_trackEvent", window.location.hostname];
}

test("Simple event is logged", function() {
  var eventArray = createEventArray(),
      eventName = "Simple";

  analytics.event(eventName);

  eventArray.push(eventName);
  deepEqual(_gaq, [eventArray]);
});

test("Actions are Title Cased", function() {
  var eventArray = createEventArray(),
      eventName = "simple",
      eventNameTitleCase = "Simple";

  analytics.event(eventName);

  eventArray.push(eventNameTitleCase);
  deepEqual(_gaq, [eventArray]);
});

test("Actions are trimmed", function() {
  var eventArray = createEventArray(),
      eventName = "     simple      ",
      eventNameTitleCase = "Simple";

  analytics.event(eventName);

  eventArray.push(eventNameTitleCase);
  deepEqual(_gaq, [eventArray]);
});

test("Actions containing email addresses are redacted", function() {
  var eventArray = createEventArray(),
      eventName = "REDACTED (Potential Email Address)";

  analytics.event("email@address.com");

  eventArray.push(eventName);
  deepEqual(_gaq, [eventArray]);
});

test("Action is a required arg", function() {
  analytics.event();
  deepEqual(_gaq, []);
});

test("Labels that aren't a string are skipped", function() {
  var eventArray = createEventArray(),
      eventName = "Simple";

  analytics.event(eventName, {label: 1});

  eventArray.push(eventName);
  deepEqual(_gaq, [eventArray]);
});

test("Labels that are strings are allowed", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      labelName = "Simple Label";

  analytics.event(eventName, {label: labelName});

  eventArray.push(eventName);
  eventArray.push(labelName);
  deepEqual(_gaq, [eventArray]);
});

test("Labels that are strings are trimmed", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      labelName = "      Simple Label       ",
      labelNameTrimmed = "Simple Label";

  analytics.event(eventName, {label: labelName});

  eventArray.push(eventName);
  eventArray.push(labelNameTrimmed);
  deepEqual(_gaq, [eventArray]);
});

test("Labels that are strings can't contain email addresses", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      labelName = "email@example.com",
      labelNameRedacted = "REDACTED (Potential Email Address)";

  analytics.event(eventName, {label: labelName});

  eventArray.push(eventName);
  eventArray.push(labelNameRedacted);
  deepEqual(_gaq, [eventArray]);
});

test("Values that are numbers are allowed", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      value = 1;

  analytics.event(eventName, {value: value});

  eventArray.push(eventName);
  eventArray.push(value);
  deepEqual(_gaq, [eventArray]);
});

test("Values that are numbers are converted to ints", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      value = 1.1,
      valueInt = 1;

  analytics.event(eventName, {value: value});

  eventArray.push(eventName);
  eventArray.push(valueInt);
  deepEqual(_gaq, [eventArray]);
});

test("Values that aren't numbers are ignored", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      value = "1";

  analytics.event(eventName, {value: value});

  eventArray.push(eventName);
  deepEqual(_gaq, [eventArray]);
});

test("Non-Interaction boolean is allowed", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      noninteraction = true;

  analytics.event(eventName, {noninteraction: noninteraction});

  eventArray.push(eventName);
  eventArray.push(noninteraction);
  deepEqual(_gaq, [eventArray]);
});

test("Non-Interaction non-booleans are ignored", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      noninteraction = "true";

  analytics.event(eventName, {noninteraction: noninteraction});

  eventArray.push(eventName);
  deepEqual(_gaq, [eventArray]);
});

test("Multiple optional args are allowed", function() {
  var eventArray = createEventArray(),
      eventName = "Simple",
      label = "Label",
      value = 1,
      noninteraction = true;

  analytics.event(eventName, {
    label: label,
    value: value,
    noninteraction: noninteraction
  });

  eventArray.push(eventName);
  eventArray.push(label);
  eventArray.push(value);
  eventArray.push(noninteraction);
  deepEqual(_gaq, [eventArray]);
});


//---------------------------------------------------------------------------


module("event() - analytics.js API", {
  setup: function() {
    _gaq = [];
  },
  teardown: function() {
    _gaq = null;
    ga = null;
  }
});

test("Using ga() without optional args works as expected", function() {
  var category = window.location.hostname,
      action = "action",
      actionTitleCase = "Action";

  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    equal(cmd, "send");
    equal(fieldObject["hitType"], "event");
    equal(fieldObject["eventCategory"], category);
    equal(fieldObject["eventAction"], actionTitleCase);
  };

  analytics.event(action);
});

test("Using ga() with optional label works as expected", function() {
  var category = window.location.hostname,
      action = "action",
      actionTitleCase = "Action",
      label = "label";

  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    equal(cmd, "send");
    equal(fieldObject["hitType"], "event");
    equal(fieldObject["eventCategory"], category);
    equal(fieldObject["eventAction"], actionTitleCase);
    equal(fieldObject["eventLabel"], label);
  };

  analytics.event(action, {label: label});
});

test("Using ga() with optional label and value works as expected", function() {
  var category = window.location.hostname,
      action = "action",
      actionTitleCase = "Action",
      label = "label",
      value = 1;

  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    equal(cmd, "send");
    equal(fieldObject["hitType"], "event");
    equal(fieldObject["eventCategory"], category);
    equal(fieldObject["eventAction"], actionTitleCase);
    equal(fieldObject["eventLabel"], label);
    equal(fieldObject["eventValue"], value);
  };

  analytics.event(action, {label: label, value: value});
});

test("Using ga() with optional noninteraction works as expected", function() {
  var category = window.location.hostname,
      action = "action",
      actionTitleCase = "Action",
      nonInteraction = true;

  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    equal(cmd, "send");
    equal(fieldObject["hitType"], "event");
    equal(fieldObject["eventCategory"], category);
    equal(fieldObject["eventAction"], actionTitleCase);
    equal(fieldObject["nonInteraction"], nonInteraction);
  };

  analytics.event(action, {noninteraction: nonInteraction});
});

test("Using ga() with optional nonInteraction works as expected", function() {
  var category = window.location.hostname,
      action = "action",
      actionTitleCase = "Action",
      nonInteraction = true;

  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    equal(cmd, "send");
    equal(fieldObject["hitType"], "event");
    equal(fieldObject["eventCategory"], category);
    equal(fieldObject["eventAction"], actionTitleCase);
    equal(fieldObject["nonInteraction"], nonInteraction);
  };

  analytics.event(action, {nonInteraction: nonInteraction});
});

test("Missing action arg causes ga() to never fire", function() {
  var count = 0;
  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    count++;
  };

  analytics.event();
  count++;
  equal(count, 1);
});

test("Using ga() with action that looks like an email causes redaction", function() {
  var category = window.location.hostname,
      action = "email@address.com",
      actionRedacted = "REDACTED (Potential Email Address)";

  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    equal(cmd, "send");
    equal(fieldObject["hitType"], "event");
    equal(fieldObject["eventCategory"], category);
    equal(fieldObject["eventAction"], actionRedacted);
  };

  analytics.event(action);
});

test("Using ga() with label that looks like an email causes redaction", function() {
  var category = window.location.hostname,
      action = "Action",
      label = "email@address.com",
      labelRedacted = "REDACTED (Potential Email Address)";

  // Provide a mock implementation of ga()
  ga = function(cmd, fieldObject) {
    equal(cmd, "send");
    equal(fieldObject["hitType"], "event");
    equal(fieldObject["eventCategory"], category);
    equal(fieldObject["eventAction"], action);
    equal(fieldObject["eventLabel"], labelRedacted);
  };

  analytics.event(action, {label: label});
});

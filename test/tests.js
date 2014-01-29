module("event()", {
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

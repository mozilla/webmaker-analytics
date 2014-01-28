### Webmaker Analytics

Client-side analytics utilities for Webmaker apps.

### Usage

The `analytics` module can be used as part of an AMD module system, or on the global.
It assumes that the Google Analytics (GA) snippet has already been included and setup
in the containing page. If it has not, all analytic methods below will be NO-OPs and
do nothing.

#### event(action, options)

The `event` method is used to record
[custom GA events](https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide).
It takes two arguments:
* `action` - A required string that is uniquely paired with each category, and commonly used
to define the type of user interaction for the web object. The `action` is converted
to Title Case for consistency.
* `options` - An optional set of extra arguments, which can include:
** `label` - An optional string to provide additional dimensions to the event data.
** `value` - An integer that you can use to provide numerical data about the user event.
** `noninteraction` - A boolean that when set to true, indicates that the event hit will
not be used in bounce-rate calculation.

NOTE: the data types of the optional properties on `options` are important, and mismatches
will cause values to be ignored.

Each event will be tracked using the page's hostname as the Category automatically.

Example 1:

```html
<script src="analytics.js"></script>
<script>
  ...
  function playIntroVideo() {
    analytics.event("Play", {label: "Main page welcome video"});
    video.play();
  }
</script>
```

Example 2:

```javascript
define(["analytics"], function(analytics) {

  ...

  return {
    login: function() {
      analytics.event("login");
      login();
    },

    logout: function() {
      analytics.event("logout");
      logout();
    }
  };

});
```

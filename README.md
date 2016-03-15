# mediaQuery.js
mediaQuery.js is both a jQuery extension and plugin with two different components. The first component is the extension:

```javascript
$.mediaQuery('>479 && <768');
```

which can only be passed a single string consisting of a query to the current viewport, returning either true or false. Rather than using css-like syntax (e.g. 'max-width: 480px and min-width: 768'), it instead uses mathematical and programming symbols.

The second component is an event binder based on the passed media query. This component is a jQuery plugin (rather than an extension), which will bind a function that runs when the media query is matched to the viewport and another that runs when the viewport is unmatched. For example:

```javascript
$(element).mediaQuery('>480 && <768', matchingFunction(collection), unMatchingFunction(collection));
```

I've also tried to make it as user-friendly as possible, so the script makes console warnings if something goes wrong.

# How to Use
## Extension
For the extension, pass a string in the following format: 

```javascript
$.mediaQuery('>500');
```

This will check if the window is currently greater than 500px wide, returning either true or false.

More elaborate queries are possible, such as:

```javascript
$.mediaQuery('>500 && <1500');
$.mediaQuery('>320 && <768 && >1200');
$.mediaQuery('(>320 && <768) || (>1200 && <1600)');
```

each of these will test against the value of window.innerWidth and return a boolean. You can nest paranthesis as many times as you like.

## Plugin

This method will attach 2 callbacks to the document ready event and the window resize event, or simply run the functions if the ready event has passed. These two functions will be invoked when the media query is matched and unmatched, respectively, and will each be passed the jQuery collection upon which the plugin is invoked. For example:

```javascript
$(el).mediaQuery('(>320 && <768) || >1200', matchingFunction($(el)), unMatchingFunction($(el));
```

When the window is either between 320px and 768px wide or greater than 1200px, the matchingFunction will be invoked with $(el) as its argument. When this range is left -- in other words, when the window is less than 320px or between 768px and 1200px wide -- the unMatchingFunction will be invoked, again with $(el) as its argument.

The unMatchingFunction is optional.

### Optional Toggle
By default, there is a toggle in place so that the callbacks are only invoked a single time when either the matched or unmatched ranges are entered. This can be disabled by passing a boolean as either the fourth argument or the third one (if you have elected not to pass an unMatchingFunction), allowing the function to run every time the window resize event is fired. 

True is the same as passing nothing -- it means, 'please include the toggle.' You must pass false to have the functions run at every window resize.

For example:

```javascript
$.mediaQuery('(>320 && <768) || >1200', matchingFunction(argument), unMatchingFunction(argument), false);
```

If the toggle is left on, it may not produce the expected behavior. For example, if you run:

```javascript
$(el).('>320', function(el) { el.css('background', 'black'); });
$(el).('>768', function(el) { el.css('background', 'red'); });
```

the background of 'el' would not turn black at 767px as you might expect. The range of >320 must be exited, meaning the window would have to be resized to at least 319, and then reentered again to get the matching function invoked.

Without the toggle, the function will run at every resize, and the background of 'el' will change black at 767px. For example:

```javascript
$(el).('>320', function(el) { el.css('background', 'black'); }, false);
$(el).('>768', function(el) { el.css('background', 'red'); });
```

This can accomplished with the toggle still on, of course, if you pass an unmatching callback:

```javascript
$(el).('>768', function(el) { el.css('background', 'black'); }, function(el) { el.css('background', 'red'); });
```

This is the preferred way, but I grant that you may not always be able to bind these functions at the same time.

# I Hope You Enjoy!
Please let me know if you have any feedback! I mostly focused on the parsing capabilities, as that was the most interesting part to program. Thanks for reading :)



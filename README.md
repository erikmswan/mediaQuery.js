# mediaQuery.js
mediaQuery.js is both a jQuery extension and plugin with two different main components. The first is the extension:

```javascript
$.mediaQuery();
```

which can only be passed a single string consisting of a query to the current viewport, returning either true or false.  And rather than using css-like syntax (e.g. 'max-width: 480px and min-width: 768'), it instead uses mathematical and programming symbols.

The second component is an event binder based on the passed media query. This component is a jQuery plugin (rather than an extension), which will bind a function that runs when the media query is matched to the viewport, and another that runs when the viewport is unmatched.

```javascript
$(element).mediaQuery('>480 && <768', matchingFunction(argument), unMatchingFunction(argument));
```


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

each of these testing against the value of window.innerWidth and returning a boolean.

## Plugin

This method will attach the 2 callbacks to the document ready event and the window resize event. These two functions will be invoked when the media query is match and unmatched, respectively, and will each be passed the jQuery node list upon which the plugin is invoked. For example:

```javascript
$.mediaQuery('>500 && <1500');
$.mediaQuery('>320 && <768 && >1200', matchingFunction(argument), unMatchingFunction(argument));
```

By default, there is a toggle in place so that the functions are only run once when either the matched or unmatched ranges are entered. This can be disabled by passing a boolean as the fourth and final argument, allowing the function to run every time the window resize event is fired. For example:

```javascript
$.mediaQuery('>320 && <768 && >1200', matchingFunction(argument), unMatchingFunction(argument), true);
```

Note: My next to do is to make the third argument optional, allowing it to also be the boolean.

I hope you enjoy :)

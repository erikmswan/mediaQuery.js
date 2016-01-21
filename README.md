# mediaQuery.js
A jQuery extension to pass strings as media queries with future plans to incorporate callbacks for automatic event binding appropriate to the passed media query.

This extension currently only has parsing capabilities, returning a boolean. So it only accepts a single string argument for now.


# How to use:
Pass a string in the following format: 

```javascript
$.mediaQuery('>500');
```

This will check if the window is currently greater than 500px wide, returning either true or false.

This also supports limited logic functionality (more to come), which is used as such: 

```
$.mediaQuery('>500 && <1500');
```

Comparison operators supported: >=, <=, >, <, =

Logic operators supported: && (with || to come)


# Future plans
I plan to allow callbacks to be passed -- one for when the media query is matched, and another 'reset' function for when the passed range is exited, either on pageload or through browser resizing. The 'matched' function will be invoked on pageload and bound to window resize, utilizing (perhaps optional) toggles to make sure the function runs a sensible amount of times (usually once). Otherwise, if it receives a single string, it falls back to the boolean return function.
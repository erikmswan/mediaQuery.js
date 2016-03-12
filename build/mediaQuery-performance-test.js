

// Performance test of mediaQuery.js

// Using built-in jQuery
var t0 = performance.now(); 

$(window).width() > 123 ? console.log(true) : console.log(false);
$(window).width() < 1450 ? console.log(true) : console.log(false);
$(window).width() > 560 ? console.log(true) : console.log(false);

var t1 = performance.now(); 

console.log('took ' + (t1 - t0).toFixed(4) + ' to resolve function');

// Test results 
// 1 arg: 0.27, .21, .18, .18, .205, .195, .185, .185
// 2 args: .27, .27, .27, .305, .3, .28, .3, .295, .28
// 3 args: 0.68, 0.395, .48, .425, .525, .365, .42, .395, .38


// Using mediaQuery.js
var t2 = performance.now(); 

// $.mediaQuery('>123 || <1450 || >560'); 
$.mediaQuery('>123 || <1450 || >560'); 

var t3 = performance.now(); 

console.log('took ' + (t3 - t2).toFixed(4) + ' to resolve function');

// Test results 
// 1 arg: 0.085, 0.255, 0.09, .095, .09, .09, .095, .095, .09
// 2 args: 0.135, 0.11, .115, .13, .13, .135, .125, .13, .14
// 3 args: .17, .16, .15, .165, .17, .32, .305, .165, .46, .15, .255, .155
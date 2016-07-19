// media-query.js


(function($) {

	// ERROR HANDLING ------------------------------------/

	function Error(name, message) {
		this.name = name;
		this.message = message;
	}


	// PARSING EXTENSION ------------------------------------/

	$.extend({
		mediaQuery: function() {


			// PARSING ARGS ----------------------------------/

			var stringToParse,
					acceptedCharacters = {
						comparison: {
							'<': '<',
							'>': '>',
							'=': '='
						},
						logic: {
							'&': '&',
							'|': '|',
							'(': '(',
							')': ')'
						},
						value: {
							'0': '0',
							'1': '1',
							'2': '2',
							'3': '3',
							'4': '4',
							'5': '5',
							'6': '6',
							'7': '7',
							'8': '8',
							'9': '9',
							// true
							t: 't', r: 'r', u: 'u', e: 'e',
							// false
							f: 'f', a: 'a', l: 'l', s: 's'
						},
						space: {
							' ': ' '
						}
					};

			// Converting the arguments array to an actual array
			var args = Array.prototype.slice.call(arguments);

			// Throw error if wrong data type or too many arguments
			try {
				if (typeof args[0] !== 'string') {
					console.log('first if');
					throw new Error('Data Type Error', 'Please only pass one string argument with an optional boolean to include the raw and evaluated data instead. Queries can be chained by including them in one string separated by the && operator, e.g. ">768 && <1024"');

				} else if (typeof args[0] === 'string' && typeof args[1] !== 'boolean' && typeof args[1] !== 'undefined') {
					console.log(typeof args[0]);
					throw new Error('Data Type Error', 'The second argument must be a boolean, which will determine whether the method returns the raw and evaluated data instead.');

				} else if (args.length > 2) {
					throw new Error('Too Many Aguments', 'Please only pass one string argument with an optional boolean to include the raw and evaluated data instead. Queries can be chained by including them in one string separated by logic operators, e.g. "(>768 && <1024) || (<320 && >1600)"');
				}
			} catch(e) {
				console.warn(e.name + ': ' + e.message);
				return;
			}


			// PARSE STRING TO FIND SCOPES ------------------------------------/

			// Check passed character with all accepted character categories
			function verifyChar(char) {
				if (acceptedCharacters.comparison[char] || acceptedCharacters.logic[char] || acceptedCharacters.value[char] || acceptedCharacters.space[char]) {
					return true;
				} else {
					throw new Error('Verify character failed', 'The passed string contains an invalid character. Received: ' + ch);
				}
			}

			// Get next character and verify it against declared accepted characters
			function nextChar(string, i) {

				// Grab next character using iterator passed as argument
				var ch = string.charAt(i);

				// Verify character and catch
				try {
					verifyChar(ch);
				} catch(e) {
					console.warn(e.name + ': ' + e.message);
					return;
				}

				return ch;
			}


			// Parse the string, evaluating units until flat results object array is produced
			function stringParse(string) {

				// prep unit variable
				var scope = '';

				for (var at = 0; at < string.length;) {

					// console.group('stringParse');
					// Grab next character
					var ch = nextChar(string, at);
					at++;
					// console.log('ch: ' + ch);

					// if opening parenthesis, start recursive call
					if (string.indexOf('(') >= 0 && string.indexOf(')') < 0) {
					 try {
						 throw new Error('Syntax Error', 'A close parenthesis is missing');
					 } catch(e) {
						 console.warn(e.name + ': ' + e.message);
						 return;
					 }
				 	} else if (string.indexOf('(') > -1 || string.indexOf(')') > -1) {
						console.log('stringParse -- found parenthesis');
						console.log('stringParse -- string: ' + string);
						if (acceptedCharacters.logic[ch] === '(') {

							console.group('Open Parenthesis');
							console.log('string.slice(at): ' + string.slice(at));
							// Call recursive function to walk nested parenthesis scopes
							var parsedUnit = stringParse(string.slice(at))

							scope += parsedUnit.parsedUnit;
							at += parsedUnit.indexesToSkip + 1;
							console.log('stringParse -- open parenthesis, end recursion. parsedUnit: ' + parsedUnit + '; parsedUnit.parsedUnit: ' + parsedUnit.parsedUnit + '; at: ' + at);
							console.groupEnd();
						} else if (acceptedCharacters.logic[ch] === ')') {
							console.group('Closed Parenthesis');

							// end of recursive functionn -- parse the whole scope and return it to stringParse

							// To explain: once the deepest nested parenthetical is isolated,
							// it is sent to the scopeParse, logicParse, and eval functions.
							// What is returned from this chain is a boolean, which is then
							// converted to a string and concatenated to a higher level of 'scope'.
							//
							// In other words, an expression like this: >2000 || ((>320 && <768) || (>1600 && <1900))
							// is turned into this: 										>2000 || (true || (>1600 && <1900))
							// then:																		>2000 || (true || false)
							// then: 																		>2000 || true
							// and finally: 														true
							var recursiveReturn = {
								parsedUnit: scopeParse(scope),
								indexesToSkip: scope.length
							}
							console.log('indexesToSkip: ' + recursiveReturn.indexesToSkip);
							console.log('recursiveReturn.parsedUnit: ' + recursiveReturn.parsedUnit);
							console.groupEnd();
							return recursiveReturn;
						} else {
							// If current character is not ( or ), then add it to scope
							scope += ch;
							console.log('No parenthesis -- scope after += ch: ' + scope);
						}
					// making sure both ends of parentheses are present
					} else {
						// If current character is not ( or ), then add it to scope
						scope += ch;
					}

				}
				console.log('scope: ' + scope);
				console.dir('scopeParse(scope): ' + scopeParse(scope));
				console.groupEnd();

				// Parse scope and save to variable to check for undefined
				var scopeCheck = scopeParse(scope);

				try {
					if (typeof scopeCheck === 'undefined') {
						throw new Error('Syntax Error', 'One of the expressions returned undefined, meaning there is a syntax error')
					}
				} catch(e) {
					console.warn(e.name + ': ' + e.message);
					return;
				}

				return scopeCheck;
			}


			// PARSE SINGLE SCOPE ------------------------------------/

			function scopeParse(string) {
				console.group('scopeParse');

				// Check for failed character verifications, which become undefined
				try {
					if (string.indexOf('undefined') > -1) {
						throw new Error('Syntax Error', 'An unacceptable character was passed that became undefined');
					}
				} catch(e) {
					console.warn(e.name + ': ' + e.message);
					return;
				}

				// Once the 'scope' is extracted from parentheses, this function will send it to the logic and eval functions
				// prep data to send for logic parsing
				var currentUnit = {
					value: [],
					comparison: [],
					logic: []
				}

				// Array tracking variables
				var logIterator = 0,
						valIterator = 0;

				for (var at = 0; at < string.length;) {

					var ch = nextChar(string, at);
					at++;

					// Check for logical operators, and if found, add next number and comparison operators to new array index position
					// The logIterator goes from 0 to 1 and back so that both characters in the || and && operators are included in a single array value
					if (acceptedCharacters.logic[ch] && logIterator < 1) {

						currentUnit.logic[valIterator] = ch;
						logIterator++;

					} else if (acceptedCharacters.logic[ch] && logIterator === 1) {

						currentUnit.logic[valIterator] += ch;
						valIterator++; // a completed logic operator signals the need for a new index position for subsequent values
						logIterator = 0;
					}

					// Collect relevant values, overwriting default 'undefined' for empty array values by
					// keeping an index of characters added

					// COMPARISON OPERATORS
					if (acceptedCharacters.comparison[ch] && currentUnit.comparison[valIterator] === undefined) {
						currentUnit.comparison[valIterator] = ch;
					} else if (acceptedCharacters.comparison[ch]) {
						currentUnit.comparison[valIterator] += ch;
					}

					// VALUES
					if (acceptedCharacters.value[ch] && currentUnit.value[valIterator] === undefined) {
						currentUnit.value[valIterator] = ch;
					} else if (acceptedCharacters.value[ch]) {
						currentUnit.value[valIterator] += ch;
					}
				}
				console.log('string: ' + string);
				console.log('currentUnit: ' + currentUnit);
				console.dir(currentUnit)
				console.groupEnd();
				return logicParse(currentUnit);
			}


			// EVALUATE SCOPE LOGIC ------------------------------------/

			function logicParse(unit) {
				// Once the scope array has been prepped,
				// this function will evaluate all logic and return a single boolean
				console.group('logicParse');
				console.log('unit: ');
				console.dir(unit);
				var evalResults = [],
						evalFinalResult = true;

				for (var i = 0; i < (unit.logic.length === 0 ? 1 : unit.logic.length);) {

					try {
						// If no logic, simply evaluate single
						if (unit.logic.length === 0) {
							console.log('no logic operators');
							evalResults.push(unitEval(unit.comparison[i], unit.value[i]));

						// Otherwise evaluate && and ||
						} else if (unit.logic[i] === '&&') {
							console.log('found &&');
							evalResults.push(unitEval(unit.comparison[i], unit.value[i]) && unitEval(unit.comparison[i + 1], unit.value[i + 1]));
							console.log('i: ' + unitEval(unit.comparison[i], unit.value[i]) + '; i + 1: ' + unitEval(unit.comparison[i + 1], unit.value[i + 1]));
							console.log('evalResults[' + i + ']: ' + evalResults[i]);

						} else if (unit.logic[i] === '||') {
							console.log('found ||');
							evalResults.push(unitEval(unit.comparison[i], unit.value[i]) || unitEval(unit.comparison[i + 1], unit.value[i + 1]));
							console.log('evalResults[' + i + ']: ' + evalResults[i]);

						} else if (unit.logic.length < (unit.value.length - 1)) {
							throw new Error('Logic Error', 'Too few logic operators found -- please check your syntax. Number of logic operators: ' + unit.logic.length + ' vs number of values: ' + unit.value.length + '. logic.length should always be === to (value.length - 1)');
						}
					} catch(e) {
						console.warn(e.name + ': ' + e.message);
						return;
					}


					i++;
				}

				// Walk the array and look for any false values. This final result is passed all the way up the function chain
				evalResults.forEach(function(el) {
					if (el === false || el === 'false') {
						evalFinalResult = false;
					} else if (el === undefined) {
						evalFinalResult = undefined;
					}
				});

				console.log(evalResults);
				console.log(evalFinalResult);
				console.groupEnd();
				return evalFinalResult;
			}


			// EVALUATE MATH UNITS ------------------------------------/

			function unitEval(comparison, value) {

				var evalResult; // Setting up result outside loop to return
				console.group('eval');
				console.log('value: ' + value);
				try {
					if (value !== 'true' && value !== 'false') {
						console.log("isn't boolean");
						// convert stringified comparison operator to real operator and evaluate
						switch (comparison) {
							case '<':
								window.innerWidth < value ? evalResult = true : evalResult = false;
								break;
							case '>':
								window.innerWidth > value ? evalResult = true : evalResult = false;
								break;
							case '>=':
								window.innerWidth >= value ? evalResult = true : evalResult = false;
								break;
							case '<=':
								window.innerWidth <= value ? evalResult = true : evalResult = false;
								break;
							case '=':
								window.innerWidth === parseInt(value) ? evalResult = true : evalResult = false;
								break;
							default:
								if (value !== 'true' && value !== 'false' && (typeof comparison === 'undefined')) {
									throw new Error('Syntax Error', 'Missing comparison operator.');
								} else if (value !== 'true' && value !== 'false') {
									throw new Error('Syntax Error', 'Incorrect comparison operator. Received: ' + comparison);
								}
								break;
						}
					} else if (value === 'true') {
						// convert string to boolean
						evalResult = true;
						console.log('is boolean -- evalResult: ' + evalResult + '; value: ' + value);
					} else if (value === 'false') {
						// convert string to boolean
						evalResult = false;
					} else {
						throw new Error('Data Type Error', 'Expected number or true or false in eval function, instead received ' + value);
					}
				} catch(e) {
					console.warn(e.name + ': ' + e.message);
					return;
				}

				console.groupEnd();
				return evalResult;
			}

			console.groupEnd();

			// PARSE AND EVALUATE!
			return stringParse(args[0]);

		}
	});


	// EVENT-BINDING PLUGIN  ------------------------------------/

	$.fn.mediaQuery = function(query, matchingFunc, nonMatchingFunc, toggle) {

		// Verifying args
		var acceptedTypes = {
			firstArg: ['string'],
			secondArg: ['function'],
			thirdArg: ['function', 'boolean', 'undefined'],
			fourthArg: ['boolean', 'undefined']
		}

		try {
			if ((acceptedTypes.firstArg.indexOf(typeof query) < 0) || (acceptedTypes.secondArg.indexOf(typeof matchingFunc) < 0)) {

				throw new Error('Data Type Error', 'Expected first and second arguments to be a string and function, respectively, and instead received a(n) ' + typeof arguments[0] + ' and ' + typeof arguments[1]);
			} else if (acceptedTypes.thirdArg.indexOf(typeof nonMatchingFunc) < 0) {

				throw new Error('Data Type Error', 'Expected optional third argument to be a function, boolean, or undefined, and intead received a(n) ' + typeof arguments[2]);
			} else if (acceptedTypes.fourthArg.indexOf(typeof toggle) < 0) {

				throw new Error('Data Type Error', 'Expected optional fourth and final argument to be a boolean or undefined, and instead received a(n) ' + typeof arguments[3]);
			} else if (arguments.length > 4) {

				throw new Error('Too many arguments', 'Please only pass up to four arguments with the following data types: string, function[, function||boolean[, boolean]]. Instead received ' + arguments.length + ' arguments.');
			}
		} catch(e) {
			console.warn(e.name + ': ' + e.message);
			return;
		}

		// Prepping arguments so that third is optional
		if (typeof nonMatchingFunc === 'boolean') {
			toggle = nonMatchingFunc;
		}

		// Function invoking matched or unmatched media query --------------------/
		var toggled = true;

		function matchMedia(el, ready) {
			if ($.mediaQuery(query)) {
				if ((toggle === undefined) || toggle) {
					if (toggled) {
						matchingFunc.bind(null, el);
						toggled = false;
					}
				} else if (!toggle) {
					matchingFunc.bind(null, el);;
				}
			}	else if (!$.mediaQuery(query)) {
				if ((toggle === undefined) || toggle) {
					// making sure nonMatchingFunc runs on pageload
					toggled = ready ? false : true;
					if (!toggled && typeof nonMatchingFunc === 'function') {
						nonMatchingFunc.bind(null, el);
						toggled = true;
					}
				} else if (!toggle && typeof nonMatchingFunc === 'function') {
					nonMatchingFunc.bind(null, el);
				}
			}
		}

		var that = this;

		if (document.readyState === 'complete') {
			matchMedia($(that), true);
		}
		$(document).on('ready', function() {
			matchMedia($(that), true);
		});
		$(window).on('resize', function() {
			matchMedia($(that));
		});
	}

})(jQuery);

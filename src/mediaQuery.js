// media-query.js


(function($) {

	$.extend({
		mediaQuery: function() {



			// PARSING ARGS ----------------------------------/

			var at, // index of current character
				ch, // current character
				stringToParse,
				acceptedCharacters = {
					comparison: {
						'<': '<',
						'>': '>',
						'=': '='
					},
					logic: {
						'&': '&',
						'|': '|'
					},
					number: {
						'0': '0',
						'1': '1',
						'2': '2',
						'3': '3',
						'4': '4',
						'5': '5',
						'6': '6',
						'7': '7', 
						'8': '8',
						'9': '9'
					},
					space: {
						' ': ' '
					}
				};


			// ERROR HANDLING ------------------------------------/

			function error(name, message) {
				throw {
					name: name,
					message: message,
				};
			}


			// Get next character based on index
			function next(string) {

				// Get next character in string. Return empty string when there are no more characters.
				ch = string.charAt(at);
				at++;
				return ch;
			}


			// Check passed character with all accepted character categories
			function verifyChar(char) {
				
				if (acceptedCharacters.comparison[char] || acceptedCharacters.logic[char] || acceptedCharacters.number[char] || acceptedCharacters.space[char]) {
					return true;
				} else {
					error('Parse Error', 'Expected number or comparison or logic operator, and instead received: ' + char);
				}
			}


			// Parse given string
			function parse(string) {
				var collectedValues = {
					logic: [],
					comparison: [],
					number: []
				};	

				// Array tracking variables
				var logIterator = 0,
					valIterator = 0;

				for (at = 0; at < string.length;) {

					// Grab next character
					next(string);

					// Verify character and catch
					try { 
						verifyChar(ch);
					} catch(e) {
						console.log(e.name + ': ' + e.message);
						return;
					}

					
					// Check for logical operators, and if found, add next number and comparison operators to new array index position
					// The logIterator goes from 0 to 1 and back so that both characters in the || and && operators are included in a single array value
					if (acceptedCharacters.logic[ch] && logIterator < 1) { 

						collectedValues.logic[valIterator] = ch;
						logIterator++;

					} else if (acceptedCharacters.logic[ch] && logIterator === 1) {

						collectedValues.logic[valIterator] += ch;
						valIterator++; // a completed logic operator signals the need for a new index position for subsequent values
						logIterator = 0;
					}

					// Collect relevant values, overwriting default 'undefined' for empty array values by 
					// keeping an index of characters added

					// COMPARISON OPERATORS
					if (acceptedCharacters.comparison[ch] && collectedValues.comparison[valIterator] === undefined) { 
						collectedValues.comparison[valIterator] = ch; 
					} else if (acceptedCharacters.comparison[ch]) {
						collectedValues.comparison[valIterator] += ch; 
					}

					// NUMBERS
					if (acceptedCharacters.number[ch] && collectedValues.number[valIterator] === undefined) { 
						collectedValues.number[valIterator] = ch; 
					} else if (acceptedCharacters.number[ch]) {
						collectedValues.number[valIterator] += ch; 
					}
				}
				
				return collectedValues;
			}



			// Converting the arguments array to an actual array
			var args = Array.prototype.slice.call(arguments);
			

			// Throw error if wrong Data Types
			try {
				if (typeof args[0] !== 'string' && typeof args[0] !== 'function') {
					error('Data Type Error', 'The possible data types for arguments are: (callback, string) || (string)');
				}	
			} catch(e) {
				console.log(e.name + ': ' + e.message);
				return;
			}
			


			// SIMPLE BOOLEAN RETURN ------------------------------/

			function booleanReturn(arg, collectedValuesReturn) {

				var collectedValues;


				// Validate data type and parse passed argument
				try {
					if (typeof arg === 'string') {

						// PARSE IT!
						collectedValues = parse(arg);

					} else {
						error('Data Type Error', 'The possible data types for arguments are: (callback, string) || (string). Queries can be chained by including them in one string separated by the || operator, e.g. ">768 || <1024"');
					}
				} catch(e) {
					console.log(e.name + ': ' + e.message);
					return;
				}


				var result = [], // Setting up result outside loop to return
					errorThrown = false; // Setting up error catcher to break function


				// Loop through collected values to evaluate query
				for (var i = 0; i < collectedValues.number.length; i++) {

					// convert stringified comparison operator to real operator and evaluate
					switch (collectedValues.comparison[i]) {
						case '<':
							window.innerWidth < collectedValues.number[i] ? result.push('true') : result.push('false');
							break;
						case '>':
							window.innerWidth > collectedValues.number[i] ? result.push('true') : result.push('false');
							break;
						case '>=':
							window.innerWidth >= collectedValues.number[i] ? result.push('true') : result.push('false');
							break;
						case '<=':
							window.innerWidth <= collectedValues.number[i] ? result.push('true') : result.push('false');
							break;
						case '=':
							window.innerWidth === parseInt(collectedValues.number[i]) ? result.push('true') : result.push('false');
							break;
						default:
							try { 
								error('Syntax Error', 'Incorrect comparison operator. Received: ' + collectedValues.comparison[i]); 
							} catch(e) { 
								console.log(e.name + ': ' + e.message); 
								errorThrown = true;
							}
							break;
					}
				}

				// Exit function if error received
				if (errorThrown) { return false; }


				// Return true unless a value in the result array is false
				// Also include the collected values as index 1
				var returnValue = [true, collectedValues];


				// ---------------------------*
				// LOGIC FUNCTIONALITY GOES HERE
				// ---------------------------*


				result.forEach(function(el) {
					if (el === 'false') {
						returnValue[0] = false;
						return;
					}
				});

				// use second argument to determine whether to return the boolean along with the collected values
				return collectedValuesReturn === 'true' ? returnValue : returnValue[0];
			}


			// Return invoked function && return 
			if (typeof args[0] === 'string' && typeof args[1] === 'undefined') { 
				return booleanReturn(args[0]); 
				// use booleanReturn(args[0], 'true'); to have the collected values returned as well
			} else if (typeof args[0] === 'string' && typeof args[1] === 'string') {
				try {
					error('Arguments Error', 'Please keep queries confined to one string separated by the || operator, e.g. ">768 || <1024"');
				} catch(e) {
					console.log(e.name + ': ' + e.message);
				}
			}



			// FUNCTION INVOKED IN MEDIA QUERY --------------------/

			// If function is the first argument, there must be a string as the second argument to define the media query
			if (typeof args[0] === 'function' && args[1] === 'string') {

				// ---------------------------*
				// AUTOMATIC FUNCTION BINDING GOES HERE
				// ---------------------------*

			} else {

			}

		}
	});

})(jQuery);

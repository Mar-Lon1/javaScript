// Wait for the HTML document to be fully loaded and parsed before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Print a helpful instruction panel in the developer console to let users know the scientific keyboard commands
    console.log(`
--- SCIENTIFIC KEYBOARD CONTROLS ---
Digits / Basic: [0-9], [.], [+], [-], [*], [/], [%]
Equals / Evaluate: [Enter] or [=]
Clear: [Escape] or [AC]
Backspace: [Backspace]
Powers / Roots:
  [^] - Exponentiation (x to the power of y)
  [q] - Square of x (x^2)
  [r] - Square root of x
Constants:
  [p] - Pi (3.14159...)
  [e] - Euler's number (2.71828...)
Trigonometry (in Radians):
  [s] - sine (sin)
  [c] - cosine (cos)
  [t] - tangent (tan)
  [S] - arcsine (asin)
  [C] - arccosine (acos)
  [T] - arctangent (atan)
Logarithms:
  [l] - natural log (ln)
  [g] - base-10 log (log)
Other:
  [a] - absolute value (abs)
  [!] - factorial (x!)
`);

    // Get the HTML element that displays the calculator's screen using its ID
    const displayElement = document.getElementById('display');

    // Select all the button elements in the document
    const buttons = document.querySelectorAll('button');

    // Store the value currently typed or displayed on the screen (defaults to "0")
    let currentValue = '0';

    // Store the previous value that was entered before selecting an operator
    let previousValue = '';

    // Store the currently active mathematical operator (+, -, X, /, ^)
    let operator = null;

    // A flag to check if the display should be cleared when the next digit is pressed
    let shouldResetDisplay = false;

    // Helper function to update the text shown on the calculator's screen
    function updateDisplay() {
        // Set the text content of the display element to the current value
        displayElement.textContent = currentValue;
    }

    // Helper function to reset all variables back to their initial default states
    function clear() {
        // Reset the current input value back to "0"
        currentValue = '0';
        // Clear out the saved previous input value
        previousValue = '';
        // Remove any currently selected operator
        operator = null;
        // Turn off the flag that resets the display
        shouldResetDisplay = false;
        // Update the screen to show the newly reset state
        updateDisplay();
    }

    // Helper function to change the sign of the current number (positive to negative or vice versa)
    function toggleSign() {
        // Check if the current value is "0" or "Error" to prevent changing its sign
        if (currentValue === '0' || currentValue === 'Error') {
            // Stop executing the function if it is "0" or "Error"
            return;
        }
        // If the number already has a minus sign, remove it; otherwise, add one to the front
        currentValue = currentValue.startsWith('-') ? currentValue.slice(1) : '-' + currentValue;
        // Update the screen with the new signed value
        updateDisplay();
    }

    // Helper function to convert the current value to a percentage (divides by 100)
    function percentage() {
        // Check if the current value is "Error" to avoid invalid calculations
        if (currentValue === 'Error') {
            // Stop executing the function if it is in an error state
            return;
        }
        // Convert the string to a floating number, divide by 100, and convert it back to string
        currentValue = (parseFloat(currentValue) / 100).toString();
        // Update the screen with the new percentage value
        updateDisplay();
    }

    // Helper function to handle number digits and decimal point button clicks
    function inputDigit(digit) {
        // If the display needs to reset (like after clicking an operator), reset the value
        if (shouldResetDisplay) {
            // Set current value to the clicked digit
            currentValue = digit === '.' ? '0.' : digit;
            // Set the flag back to false since display is now reset
            shouldResetDisplay = false;
        } else {
            // Check if the clicked button is a decimal point
            if (digit === '.') {
                // If the current value already contains a decimal point, do nothing to prevent duplicates
                if (currentValue.includes('.')) {
                    // Exit the function to prevent duplicate decimal points
                    return;
                }
                // Append the decimal point to the current string value
                currentValue += '.';
            } else {
                // If current value is just "0", replace it with the digit to avoid leading zeros
                currentValue = currentValue === '0' ? digit : currentValue + digit;
            }
        }
        // Update the screen to display the updated number
        updateDisplay();
    }

    // Helper function to handle math operator button clicks (+, -, X, /, ^)
    function inputOperator(nextOperator) {
        // If current value is "Error", don't allow operator selection
        if (currentValue === 'Error') {
            // Stop executing the function
            return;
        }
        // Convert the current string value to a number for checking
        const inputValue = parseFloat(currentValue);

        // If we already have an operator and we are expecting a second operand
        if (operator && shouldResetDisplay) {
            // Update the operator to the new operator selection
            operator = nextOperator;
            // Exit early since we just updated the operator
            return;
        }

        // If previousValue is empty, store the current display value as previousValue
        if (previousValue === '') {
            // Save current value to the previousValue holder
            previousValue = currentValue;
        } else if (operator) {
            // If we already have a previous value and an operator, calculate the intermediate result first
            const result = calculate(parseFloat(previousValue), operator, inputValue);
            // Store the result as the new current value
            currentValue = String(result);
            // Save the result as the new previous value for the next operation
            previousValue = String(result);
            // Update the screen to show the result
            updateDisplay();
        }

        // Flag that we need to clear the display when the next number is typed
        shouldResetDisplay = true;
        // Save the newly clicked operator for the upcoming calculation
        operator = nextOperator;
    }

    // Helper function to perform the mathematical calculation
    function calculate(firstOperand, op, secondOperand) {
        // If the operator is addition (+)
        if (op === '+') {
            // Add the two operands together
            return firstOperand + secondOperand;
        }
        // If the operator is subtraction (-)
        if (op === '-') {
            // Subtract the second operand from the first operand
            return firstOperand - secondOperand;
        }
        // If the operator is multiplication (X)
        if (op === 'X') {
            // Multiply the two operands together
            return firstOperand * secondOperand;
        }
        // If the operator is division (/)
        if (op === '/') {
            // Check if the user is trying to divide by zero
            if (secondOperand === 0) {
                // Return division by zero error representation
                return 'Error';
            }
            // Divide the first operand by the second operand
            return firstOperand / secondOperand;
        }
        // If the operator is exponentiation (^)
        if (op === '^') {
            // Calculate firstOperand raised to the power of secondOperand
            return Math.pow(firstOperand, secondOperand);
        }
        // If no operator matched, just return the second operand
        return secondOperand;
    }

    // Helper function to calculate the factorial of a number recursively or iteratively
    function getFactorial(num) {
        // If the number is negative or not an integer, it is invalid for standard factorial
        if (num < 0 || !Number.isInteger(num)) {
            // Return error string
            return 'Error';
        }
        // If the number is too large, JavaScript arithmetic will return Infinity, so we cap it
        if (num > 170) {
            // Return error string for overflow
            return 'Error';
        }
        // Initialize our running product result to 1
        let result = 1;
        // Loop from 2 up to the target number to calculate product
        for (let i = 2; i <= num; i++) {
            // Multiply running product by current iteration index
            result *= i;
        }
        // Return the final computed factorial value
        return result;
    }

    // Helper function to calculate a scientific function of the current display value
    function applyScientificFunction(func) {
        // If the display currently shows Error, do not attempt to run scientific functions
        if (currentValue === 'Error') {
            // Exit early
            return;
        }
        // Parse the current display string into a floating-point number
        const val = parseFloat(currentValue);
        // Declare a variable to store the calculated result
        let result;

        // Match the requested scientific function name
        if (func === 'sin') {
            // Calculate the sine of the value (in radians)
            result = Math.sin(val);
        } else if (func === 'cos') {
            // Calculate the cosine of the value (in radians)
            result = Math.cos(val);
        } else if (func === 'tan') {
            // Calculate the tangent of the value (in radians)
            result = Math.tan(val);
        } else if (func === 'asin') {
            // Arcsine is only defined for numbers between -1 and 1
            if (val < -1 || val > 1) {
                // Set result to error string
                result = 'Error';
            } else {
                // Calculate the arcsine (in radians)
                result = Math.asin(val);
            }
        } else if (func === 'acos') {
            // Arccosine is only defined for numbers between -1 and 1
            if (val < -1 || val > 1) {
                // Set result to error string
                result = 'Error';
            } else {
                // Calculate the arccosine (in radians)
                result = Math.acos(val);
            }
        } else if (func === 'atan') {
            // Calculate the arctangent of the value (in radians)
            result = Math.atan(val);
        } else if (func === 'sqrt') {
            // Square root is only defined for non-negative numbers
            if (val < 0) {
                // Set result to error string
                result = 'Error';
            } else {
                // Calculate the square root of the value
                result = Math.sqrt(val);
            }
        } else if (func === 'ln') {
            // Natural log is only defined for positive values
            if (val <= 0) {
                // Set result to error string
                result = 'Error';
            } else {
                // Calculate natural logarithm (base e)
                result = Math.log(val);
            }
        } else if (func === 'log') {
            // Base-10 log is only defined for positive values
            if (val <= 0) {
                // Set result to error string
                result = 'Error';
            } else {
                // Calculate logarithm base 10
                result = Math.log10(val);
            }
        } else if (func === 'abs') {
            // Calculate the absolute value
            result = Math.abs(val);
        } else if (func === 'sq') {
            // Calculate the square of the value (x^2)
            result = val * val;
        } else if (func === 'fact') {
            // Call the custom factorial function
            result = getFactorial(val);
        }

        // Check if the calculation resulted in an error
        if (result === 'Error') {
            // Set current value to Error
            currentValue = 'Error';
        } else {
            // Format the result to avoid floating point precision issues and convert to string
            currentValue = String(Number(parseFloat(result).toFixed(12)));
        }
        // Tell display to reset on the next key press
        shouldResetDisplay = true;
        // Update display to show the scientific result
        updateDisplay();
    }

    // Helper function to process the equals button press
    function handleEquals() {
        // Check if there is an active operator and a previous value stored
        if (operator && previousValue !== '') {
            // Convert both operands to numbers and calculate the result using the helper
            const result = calculate(parseFloat(previousValue), operator, parseFloat(currentValue));
            // Check if calculation resulted in an error (division by zero)
            if (result === 'Error') {
                // Set the current value to "Error"
                currentValue = 'Error';
            } else {
                // Format the result to avoid floating-point errors (e.g. 0.1 + 0.2 = 0.3)
                // Limit to maximum 12 decimal places and strip trailing zeros by parsing float
                currentValue = String(Number(parseFloat(result).toFixed(12)));
            }
            // Clear the previous value holder
            previousValue = '';
            // Reset the active operator to null
            operator = null;
            // Set flag to true so the next number press resets display rather than appending
            shouldResetDisplay = true;
            // Update the screen with the final calculated result
            updateDisplay();
        }
    }

    // Loop through each button in the calculator and attach a click event listener
    buttons.forEach(button => {
        // Listen for standard click events on the button
        button.addEventListener('click', () => {
            // Retrieve the text inside the button, stripping any whitespace
            const value = button.textContent.trim();

            // If the clear button (AC) was clicked
            if (value === 'AC') {
                // Call the clear helper function
                clear();
            }
            // If the sign toggle button (+/-) was clicked
            else if (value === '+/-') {
                // Call the toggleSign helper function
                toggleSign();
            }
            // If the percentage button (%) was clicked
            else if (value === '%') {
                // Call the percentage helper function
                percentage();
            }
            // If the equals button (=) was clicked
            else if (value === '=') {
                // Call the handleEquals helper function
                handleEquals();
            }
            // If the sine button (sin) was clicked
            else if (value === 'sin') {
                // Call the applyScientificFunction helper function with 'sin'
                applyScientificFunction('sin');
            }
            // If the cosine button (cos) was clicked
            else if (value === 'cos') {
                // Call the applyScientificFunction helper function with 'cos'
                applyScientificFunction('cos');
            }
            // If the tangent button (tan) was clicked
            else if (value === 'tan') {
                // Call the applyScientificFunction helper function with 'tan'
                applyScientificFunction('tan');
            }
            // If one of the mathematical operator buttons was clicked
            else if (value === '+' || value === '-' || value === 'X' || value === '/' || value === '^') {
                // Call the inputOperator helper function with the clicked operator
                inputOperator(value);
            }
            // If any other button (which will be a number digit or decimal dot) was clicked
            else {
                // Call the inputDigit helper function with the digit or dot
                inputDigit(value);
            }
        });
    });

    // Add a keyboard keydown event listener to window to enable scientific functions and physical inputs
    window.addEventListener('keydown', (event) => {
        // Get the character key representing the pressed keyboard button
        const key = event.key;

        // If a standard number key from 0 to 9 was pressed
        if (key >= '0' && key <= '9') {
            // Insert the digit value
            inputDigit(key);
        }
        // If the decimal period key was pressed
        else if (key === '.') {
            // Insert the decimal point
            inputDigit('.');
        }
        // If the plus operator key was pressed
        else if (key === '+') {
            // Set the operator to addition
            inputOperator('+');
        }
        // If the minus operator key was pressed
        else if (key === '-') {
            // Set the operator to subtraction
            inputOperator('-');
        }
        // If the multiplication asterisk key was pressed
        else if (key === '*') {
            // Set the operator to multiplication
            inputOperator('X');
        }
        // If the division slash key was pressed
        else if (key === '/') {
            // Prevent default browser shortcuts (like opening search bar in Firefox/Chrome)
            event.preventDefault();
            // Set the operator to division
            inputOperator('/');
        }
        // If the caret key (Shift + 6) was pressed
        else if (key === '^') {
            // Set the operator to exponentiation (scientific power)
            inputOperator('^');
        }
        // If the percentage key (Shift + 5) was pressed
        else if (key === '%') {
            // Run the percentage converter
            percentage();
        }
        // If the Enter key or Equals key was pressed
        else if (key === 'Enter' || key === '=') {
            // Perform calculation
            handleEquals();
        }
        // If the Backspace key was pressed
        else if (key === 'Backspace') {
            // If current display is not showing Error and not already at "0"
            if (currentValue !== 'Error' && currentValue !== '0') {
                // Remove the last character of the current value string
                currentValue = currentValue.slice(0, -1);
                // If the value becomes empty or is just a negative symbol
                if (currentValue === '' || currentValue === '-') {
                    // Reset current value to "0"
                    currentValue = '0';
                }
                // Update the display screen
                updateDisplay();
            }
        }
        // If the Escape key was pressed
        else if (key === 'Escape') {
            // Clear the calculator state
            clear();
        }
        // If the key for sine (s) was pressed
        else if (key === 's') {
            // Run standard sine function
            applyScientificFunction('sin');
        }
        // If the key for cosine (c) was pressed
        else if (key === 'c') {
            // Run standard cosine function
            applyScientificFunction('cos');
        }
        // If the key for tangent (t) was pressed
        else if (key === 't') {
            // Run standard tangent function
            applyScientificFunction('tan');
        }
        // If the key for arcsine (S) was pressed
        else if (key === 'S') {
            // Run arcsine function
            applyScientificFunction('asin');
        }
        // If the key for arccosine (C) was pressed
        else if (key === 'C') {
            // Run arccosine function
            applyScientificFunction('acos');
        }
        // If the key for arctangent (T) was pressed
        else if (key === 'T') {
            // Run arctangent function
            applyScientificFunction('atan');
        }
        // If the key for square root (r) was pressed
        else if (key === 'r') {
            // Run square root function
            applyScientificFunction('sqrt');
        }
        // If the key for natural log (l) was pressed
        else if (key === 'l') {
            // Run natural log function
            applyScientificFunction('ln');
        }
        // If the key for base-10 logarithm (g) was pressed
        else if (key === 'g') {
            // Run logarithm base 10
            applyScientificFunction('log');
        }
        // If the key for absolute value (a) was pressed
        else if (key === 'a') {
            // Run absolute value function
            applyScientificFunction('abs');
        }
        // If the key for squaring a number (q) was pressed
        else if (key === 'q') {
            // Run square function (x^2)
            applyScientificFunction('sq');
        }
        // If the key for factorial (!) was pressed
        else if (key === '!') {
            // Run factorial function
            applyScientificFunction('fact');
        }
        // If the key for Pi (p) was pressed
        else if (key === 'p') {
            // Put Pi constant as current value
            currentValue = Math.PI.toString();
            // Show new value on screen
            updateDisplay();
        }
        // If the key for Euler's number (e) was pressed
        else if (key === 'e') {
            // Put Euler's constant as current value
            currentValue = Math.E.toString();
            // Show new value on screen
            updateDisplay();
        }
    });
});
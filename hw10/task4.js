// Task 4 – Control Structures

function checkNumberType(num) {
  if (num > 0) {
    return "Positive";
  } else if (num < 0) {
    return "Negative";
  } else {
    return "Zero";
  }
}

// Test with different values
console.log(checkNumberType(42));   // Positive
console.log(checkNumberType(-7));   // Negative
console.log(checkNumberType(0));    // Zero

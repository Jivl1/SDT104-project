// Task 2 – Arrays and Loops

const students = ["Alice", "Bob", "Carol", "David", "Eva"];

// Print each name in uppercase
students.forEach(student => {
  console.log(student.toUpperCase());
});

// Add a new student and log the updated array
students.push("Frank");
console.log("Updated array:", students);

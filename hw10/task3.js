// Task 3 – Object Basics

const hobby = {
  name: "music production",
  isIndoor: true,
  weeklyHours: 10,
  tools: ["DAW", "MIDI controller", "headphones"],

  getHobbySummary() {
    return `${this.name} – ${this.isIndoor ? "indoor" : "outdoor"}, ~${this.weeklyHours}h/week`;
  }
};

// Log a descriptive sentence
const locationLabel = hobby.isIndoor ? "indoor" : "outdoor";
console.log(
  `I enjoy ${hobby.name}. It's an ${locationLabel} hobby. ` +
  `I spend about ${hobby.weeklyHours} hours per week using tools like: ${hobby.tools.join(", ")}.`
);

// Call the summary method
console.log(hobby.getHobbySummary());

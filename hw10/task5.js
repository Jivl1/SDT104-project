// Task 5 – ES6 Class Practice

class Hobby {
  constructor(name, isIndoor, weeklyHours) {
    this.name = name;
    this.isIndoor = isIndoor;
    this.weeklyHours = weeklyHours;
  }

  describe() {
    const type = this.isIndoor ? "indoor" : "outdoor";
    console.log(
      `My hobby is ${this.name}. It's an ${type} activity, and I spend ${this.weeklyHours} hours a week on it.`
    );
  }
}

const hobby1 = new Hobby("music production", true, 10);
const hobby2 = new Hobby("cycling", false, 6);

hobby1.describe();
hobby2.describe();

const tasks = [
  { id: 1, title: "Variables and Data Types", file: "task1.js" },
  { id: 2, title: "Arrays and Loops", file: "task2.js" },
  { id: 3, title: "Object Basics", file: "task3.js" },
  { id: 4, title: "Control Structures", file: "task4.js" },
  { id: 5, title: "ES6 Class Practice", file: "task5.js" }
];

const taskGrid = document.getElementById("task-grid");
const template = document.getElementById("task-template");
const taskState = new Map();

function formatValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return `[ ${value.map(item => typeof item === "string" ? `'${item}'` : String(item)).join(", ")} ]`;
  }

  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value);
    }
  }

  return String(value);
}

function createCard(task) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".task-card");
  const kicker = fragment.querySelector(".task-kicker");
  const title = fragment.querySelector("h2");
  const codeBlock = fragment.querySelector(".code-block");
  const consoleBlock = fragment.querySelector(".console-block");
  const runButton = fragment.querySelector(".run-button");

  kicker.textContent = `Task ${task.id}`;
  title.textContent = task.title;
  runButton.dataset.taskId = String(task.id);

  taskState.set(task.id, { task, codeBlock, consoleBlock, runButton });
  taskGrid.appendChild(card);
}

async function loadCode(task) {
  const response = await fetch(task.file);
  const code = await response.text();
  taskState.get(task.id).codeBlock.textContent = code.trim();
  return code;
}

function runTask(taskId) {
  const state = taskState.get(taskId);
  const code = state.codeBlock.textContent;
  state.consoleBlock.textContent = "";

  const frame = document.createElement("iframe");
  frame.hidden = true;
  document.body.appendChild(frame);

  const reporter = (...parts) => {
    const line = parts.map(formatValue).join(" ");
    state.consoleBlock.textContent += `${line}\n`;
  };

  frame.contentWindow.console.log = reporter;

  try {
    frame.contentWindow.eval(code);
  } catch (error) {
    reporter(`Error: ${error.message}`);
  } finally {
    frame.remove();
    state.consoleBlock.textContent = state.consoleBlock.textContent.trimEnd() || "No output.";
  }
}

async function init() {
  tasks.forEach(createCard);
  await Promise.all(tasks.map(loadCode));

  taskGrid.addEventListener("click", event => {
    const button = event.target.closest(".run-button");
    if (!button) {
      return;
    }

    runTask(Number(button.dataset.taskId));
  });
}

init();

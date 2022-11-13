const previewValue = document.querySelector(".value");
const operationPreview = document.querySelector(".operations");

const numbers = document.querySelectorAll(".number");
const buttons = document.querySelector(".buttons");
const topBar = document.querySelector(".top-bar");
const container = document.querySelector(".container");

let showResult = false;
let anotherNumber = false;
let allowBack = true;
let isDragged = false;
let offset = [];

if (localStorage.getItem("position")) {
  const { left, top } = JSON.parse(localStorage.getItem("position"));
  container.style.top = top;
  container.style.left = left;
}

function changeStyle(value) {
  const data = String(value);
  if (data.length <= 10) {
    previewValue.style.fontSize = "2.5rem";
  } else if (data.length < 20) {
    previewValue.style.fontSize = "1.5rem";
  } else {
    previewValue.style.fontSize = "1.5rem";
    previewValue.style.inlineSize = "18rem";
  }
  previewValue.textContent = data;
  showResult = true;
}

buttons.addEventListener("click", calculatorEvents);
document.addEventListener("keydown", calculatorEvents);

container.addEventListener("mousedown", function (e) {
  if (!e.target.matches(".top-bar")) return;
  isDragged = true;
  topBar.style.cursor = "grabbing";

  offset.push(container.offsetLeft - e.clientX);
  offset.push(container.offsetTop - e.clientY);
});

container.addEventListener(
  "mousemove",
  function (e) {
    e.preventDefault();
    if (isDragged) {
      container.style.left = e.clientX + offset[0] + "px";
      container.style.top = e.clientY + offset[1] + "px";
    }
  },
  true
);

container.addEventListener(
  "mouseup",
  function () {
    isDragged = false;
    topBar.style.cursor = "grab";
    localStorage.setItem(
      "position",
      JSON.stringify({ left: container.style.left, top: container.style.top })
    );
  },
  true
);

function mathOperations(operator, a, b) {
  if (operator.includes("/")) return a / b;
  if (operator.includes("*")) return a * b;
  if (operator.includes("+")) {
    return Number(a) + Number(b);
  }
  if (operator.includes("-")) return a - b;
}

function getOperator() {
  const operations = operationPreview.textContent;
  return operations.replace(/[0-9]/g, "").trim();
}

function autoCalculate(operator) {
  return mathOperations(
    operator,
    Number.parseFloat(operationPreview.textContent),
    previewValue.textContent
  );
}

function calculatorEvents(e) {
  if (
    (e.target.closest(".number") || "012345679".includes(e.key)) &&
    previewValue.textContent.length <= 24
  ) {
    if (previewValue.textContent.length >= 12)
      previewValue.style.fontSize = "1.5rem";

    if (operationPreview.textContent.includes("="))
      operationPreview.textContent = "";

    if (!showResult && !anotherNumber) {
      previewValue.textContent.startsWith("0")
        ? (previewValue.textContent = e.key || e.target.textContent)
        : (previewValue.textContent += e.key || e.target.textContent);
    } else {
      previewValue.style.fontSize = "2.5rem";
      previewValue.textContent = e.key || e.target.textContent;
      showResult = false;
      anotherNumber = false;
    }
  }

  if (e.target.matches("#percentage") || e.key === "%") {
    operationPreview.textContent = `${previewValue.textContent}% = `;
    changeStyle(previewValue.textContent / 100);
  }

  if (e.target.closest("#back") || e.key === "Backspace") {
    if (allowBack) {
      if (
        previewValue.textContent != "0" &&
        !(previewValue.textContent === "Infinity") &&
        previewValue.textContent
      ) {
        const value = previewValue.textContent.split("");
        value.splice(-1);
        previewValue.textContent = value.length > 0 ? value.join("") : 0;
      } else {
        previewValue.textContent = "0";
      }
    } else {
      previewValue.textContent = 0;
      allowBack = true;
      operationPreview.textContent = "";
    }
  }

  if (e.target.closest("#reset")) {
    previewValue.textContent = 0;
    previewValue.style.fontSize = "2.5rem";
    previewValue.style.inlineSize = "";
    showResult = false;
    anotherNumber = false;
  }

  if (e.target.closest("#reset_all") || (e.shiftKey && e.key === "R")) {
    previewValue.textContent = 0;
    operationPreview.textContent = "";
    previewValue.style.fontSize = "2.5rem";
    previewValue.style.inlineSize = "";
    showResult = false;
    anotherNumber = false;
  }

  if (e.target.closest("#inverse")) {
    operationPreview.textContent = `1 / ${previewValue.textContent} = `;
    let data = String(1 / previewValue.textContent);
    data.replace("/0+$/", "");
    changeStyle(data);
  }

  if (
    e.target.closest("#dot") ||
    (e.key === "." && !previewValue.textContent.includes("."))
  ) {
    previewValue.textContent += ".";
  }

  if (e.target.closest("#square")) {
    operationPreview.innerHTML = `${previewValue.textContent}<sup>2</sup> = `;
    changeStyle(previewValue.textContent ** 2);
  }

  if (e.target.closest("#square_root")) {
    operationPreview.textContent = `sqrt(${previewValue.textContent}) = `;
    changeStyle(Math.sqrt(previewValue.textContent));
  }

  if (e.target.closest("#negate") || e.key === "!") {
    data =
      Number(previewValue.textContent) >= 0
        ? -previewValue.textContent
        : previewValue.textContent;
    changeStyle(String(data));
    showResult = false;
  }

  if (e.target.closest("#divide") || e.key === "/") {
    const operator = getOperator();
    if (operator && !operator.includes("=")) {
      const calculatedValue = autoCalculate(operator);
      operationPreview.textContent = `${calculatedValue} / `;
    } else {
      operationPreview.textContent = `${previewValue.textContent} / `;
    }
    anotherNumber = true;
    allowBack = true;
  }

  if (e.target.closest("#multiply") || e.key === "*") {
    const operator = getOperator();
    if (operator && !operator.includes("=")) {
      const calculatedValue = autoCalculate(operator);
      operationPreview.textContent = `${calculatedValue} * `;
    } else {
      operationPreview.textContent = `${previewValue.textContent} * `;
    }
    anotherNumber = true;
    allowBack = true;
  }

  if (e.target.closest("#add") || e.key === "+") {
    const operator = getOperator();
    if (operator && !operator.includes("=")) {
      const calculatedValue = autoCalculate(operator);
      operationPreview.textContent = `${calculatedValue} + `;
    } else {
      operationPreview.textContent = `${previewValue.textContent} + `;
    }
    anotherNumber = true;
    allowBack = true;
  }

  if (e.target.closest("#substract") || e.key === "-") {
    const operator = getOperator();
    if (operator && !operator.includes("=")) {
      const calculatedValue = autoCalculate(operator);
      operationPreview.textContent = `${calculatedValue} - `;
    } else {
      operationPreview.textContent = `${previewValue.textContent} - `;
    }
    anotherNumber = true;
    allowBack = true;
  }

  if (e.target.closest("#equal") || e.key === "Enter" || e.key === "=") {
    const operations = operationPreview.textContent;
    const prevOperand = Number.parseFloat(operations);
    const operator = getOperator();

    if (previewValue.textContent === "Infinity") {
      operationPreview.textContent = "";
      previewValue.textContent = 0;
    } else if (
      operator.includes("*") ||
      operator.includes("/") ||
      operator.includes("+") ||
      operator.includes("-")
    ) {
      operationPreview.textContent =
        operations + previewValue.textContent + " =";

      changeStyle(
        mathOperations(operator, prevOperand, previewValue.textContent)
      );
    } else {
      operationPreview.textContent = previewValue.textContent + " =";
    }
    anotherNumber = false;
    allowBack = false;
  }
}

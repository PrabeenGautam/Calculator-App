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

buttons.addEventListener("click", calculatorEvents);
document.addEventListener("keydown", calculatorEvents);

function calculatorEvents(e) {
  if (
    (e.target.closest(".number") || "012345679".includes(e.key)) &&
    previewValue.textContent.length <= 24
  ) {
    if (previewValue.textContent.length >= 12)
      previewValue.style.fontSize = "1.5rem";

    if (operationPreview.textContent.includes("="))
      operationPreview.textContent = "";

    if (!(showResult || anotherNumber)) {
      previewValue.textContent.startsWith("0") &&
      !previewValue.textContent.includes(".")
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
        if (previewValue.textContent.length <= 12)
          previewValue.style.fontSize = "2.5rem";
      } else {
        previewValue.textContent = "0";
      }
      showResult = false;
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
    changeStyle(String(-previewValue.textContent));
    showResult = false;
  }

  if (e.target.closest("#divide") || e.key === "/") {
    operationsHandler("/");
  }

  if (e.target.closest("#multiply") || e.key === "*") {
    operationsHandler("*");
  }

  if (e.target.closest("#add") || e.key === "+") {
    operationsHandler("+");
  }

  if (e.target.closest("#substract") || e.key === "-") {
    operationsHandler("-");
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
      if (operator.includes("=")) {
        operationPreview.textContent = previewValue.textContent;
      } else {
        operationPreview.textContent =
          operations + previewValue.textContent + " =";
        changeStyle(
          mathOperations(operator, prevOperand, previewValue.textContent)
        );
      }
    } else {
      operationPreview.textContent = previewValue.textContent + " =";
    }
    anotherNumber = false;
    allowBack = false;
  }
}

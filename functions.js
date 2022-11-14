let offset = [];

if (localStorage.getItem("position")) {
  const { left, top } = JSON.parse(localStorage.getItem("position"));
  container.style.top = top;
  container.style.left = left;
}

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

function operationsHandler(op) {
  const operator = getOperator();

  if (!operator || (showResult && operator.includes(op))) {
    operationPreview.textContent = `${previewValue.textContent} ${op} `;
  }

  if (operator && operator !== op) {
    operationPreview.textContent = `${previewValue.textContent} ${op} `;
  }

  if (operator && !showResult) {
    const calculatedValue = autoCalculate(op);
    operationPreview.textContent = `${calculatedValue} ${op} `;
    changeStyle(calculatedValue);
  }

  anotherNumber = true;
  allowBack = true;
}

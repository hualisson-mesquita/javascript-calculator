class Calculator {
    constructor() {
        this.value1 = "";
        this.value2 = "";
        this.operator = "";
        this.result = "";
    }

    status() { //Retorna o status atual da classe.
        if(this.value1 == "" && this.value2 == "" && this.result == "") {
            return "empty";
        } else if(this.value1 != "" && this.value2 == "" && this.result == "") {
            return "incomplete";
        } else if(this.value1 != "" && this.value2 != "" && this.result != "") {
            return "complete";
        }
    }
}

const pageHtml = document.querySelector("html");
const inputBody = document.querySelector("body");
const divSwitch = document.getElementById("div-switch");
const inputResult = document.getElementById("input-result");
const inputNumber = document.getElementById("input-number");
const buttonClear = document.getElementById("button-clear");
const buttonClearEntry = document.getElementById("button-clear-entry");
const buttonBackspace = document.getElementById("button-backspace");
const buttonValues = document.getElementsByClassName("calc-button");

const calc = new Calculator();

const regExNumber = /[0-9]/;
const regExComma = /,/;
const regExNumbersAfterComma = /,[0-9]{2}/;
const regExFormat = /\B(?=(\d{3})+(?!\d))/g;
const regExOperator = /\+|-|\*|\//;

const enterKey = "Enter";
const backSpaceKey = "Backspace";
const commaKey = ",";

const statusEmpty = "empty";
const statusIncomplete = "incomplete";
const statusComplete = "complete";

const maxLength = 15;
let valueInput = "";
let value2Entry = true;

const readKey = (event) => {
    event.preventDefault();
    verifyKey(event.key);
}

const buttonValue = (event) => {
    verifyKey(event.target.value);
}

const verifyKey = (key) => {

    if(key == commaKey) {
        if(getValueInput() == "" && calc.status() != statusComplete) {
            inputZeroAndComma();
        } else if(calc.status() == statusIncomplete && value2Entry == true) {
            clearInputNumber();
            controlValue2Entry(false);
            inputZeroAndComma();
        } else if(calc.status() == statusComplete) {
            clear();
            inputZeroAndComma();
        } else if(!regExComma.test(getValueInput()) && getValueInput() != "" && calc.status() != statusComplete) {
            inputKey(key);
        }
    } else if(regExNumber.test(key)) {
        if(calc.status() == statusIncomplete && value2Entry == true) {
            clearInputNumber();
            controlValue2Entry(false);
        } else if(calc.status() == statusComplete) {
            clear();
        } else if(regExNumbersAfterComma.test(getValueInput())) {
            return;
        } else if(getValueInput().length >= maxLength) {
            return;
        }
        inputKey(key);
    } else if(key == backSpaceKey) {
        if(calc.status() == statusIncomplete && value2Entry == true) {
            clearInputNumber();
            controlValue2Entry(false);
        } else if(calc.status() == statusComplete) {
            clear();
        } else {
            deleteKey();
        }
    } else if(regExOperator.test(key)) {
        if((calc.status() == statusEmpty || calc.status() == statusIncomplete) && getValueInput() != "" && value2Entry == true) {
            calc.operator = key;
            calc.value1 = getValueInput();
            printResult();
        } else if(calc.status() == statusIncomplete && getValueInput() != "" && value2Entry == false) {
            calc.value2 = getValueInput();
            calculate();
            setValueInput(calc.result);
            clearCalculator();
            calc.operator = key;
            calc.value1 = getValueInput();
            printNumber();
            printResult();
            controlValue2Entry(true);
        } else if(calc.status() == statusComplete) {
            clearCalculator();
            calc.operator = key;
            calc.value1 = getValueInput();
            printResult();
            controlValue2Entry(true);
        }
    } else if(key == enterKey) {
        if(calc.status() == statusIncomplete && getValueInput() != "") {
            calc.value2 = getValueInput();
            calculate();
            setValueInput(calc.result);
            printNumber();
            printResult();
        } else if(calc.status() == statusComplete) {
            calc.value1 = calc.result;
            calculate();
            setValueInput(calc.result);
            printNumber();
            printResult();
        }
    }
}

const printResult = () => {
    if(calc.value2 == "") {
        inputResult.innerText = `${getFormattedValue(calc.value1)} ${calc.operator}`;
    } else {
        inputResult.innerText = `${getFormattedValue(calc.value1)} ${calc.operator} ${getFormattedValue(calc.value2)} =`
    }
}

const printNumber = () => {
    inputNumber.innerText = getFormattedValue(getValueInput());
}

const getValueInput = () => {
    return valueInput;
}

const setValueInput = (value) => {
    valueInput = value;
}

const getFormattedValue = (value) => {
    return value.replace(regExFormat, ".");
}

const inputKey = (key) => {
    setValueInput(getValueInput() + key);
    printNumber();
}

const deleteKey = () => {
    const value = getValueInput();
    if(value.length > 0) {
        setValueInput(value.slice(0, value.length - 1));
        printNumber();
    }
}

const inputZeroAndComma = () => {
    inputKey("0,");
}

const calculate = () => {
    let value1 = parseFloat(calc.value1.replace(",", "."));
    let value2 = parseFloat(calc.value2.replace(",", "."));
    let result;
    switch(calc.operator) {
        case "+": result = value1 + value2; break;
        case "-": result = value1 - value2; break;
        case "*": result = value1 * value2; break;
        case "/": result = value1 / value2; break;
        default:  result = ""; break;
    }
    calc.result = result.toFixed(2).replace(".", ",").replace(",00", "");
}

const clear = () => {
    clearCalculator();
    clearInputResult();
    clearInputNumber();
    controlValue2Entry(true);
}

const clearCalculator = () => {
    calc.value1 = "";
    calc.value2 = "";
    calc.operator = "";
    calc.result = "";
}

const clearInputResult = () => {
    inputResult.innerText = "";
}

const clearInputNumber = () => {
    valueInput = "";
    inputNumber.innerText = "";
}

//Arrow function para controlar entrada do segundo valor.
const controlValue2Entry = (entry) => {
    value2Entry = entry;
}

inputBody.addEventListener("keydown", readKey);
divSwitch.addEventListener("click", (event) => {
    divSwitch.classList.toggle("dark-mode");
    pageHtml.classList.toggle("dark-mode");
});
buttonClear.addEventListener("click", clear);
buttonClearEntry.addEventListener("click", clearInputNumber);
buttonBackspace.addEventListener("click", () => { verifyKey("Backspace"); });
for(let i = 0; i < buttonValues.length; i++) {
    buttonValues[i].addEventListener("click", buttonValue);
}
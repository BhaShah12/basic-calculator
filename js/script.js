// const display = document.getElementById('display')
// const keys = document.querySelector('.keys')

// let firstValue = null,
// operator = null,
// waitingForSecondValue = false;

// keys.addEventListener('click',e => {
    
//     if(!e.target.matches('button')) return;
//     const action = e.target.dataset.action;
//     const btnContent = e.target.textContent;
//     const displayed = display.textContent;
    
//     if(!action){
//         if(displayed === '0' || waitingForSecondValue){
//             display.textContent = btnContent;
//             waitingForSecondValue = false;
//         }
//         else{
//             display.textContent = displayed + btnContent;
//         }
//     }
//     else if(action === 'decimal'){
//         if(!displayed.includes('.')){
//             display.textContent = displayed + '.';
//         }
//     }
//     else if (action === 'clear') {
//         firstValue = null;
//         operator = null;
//         waitingForSecondValue = false;
//         display.textContent = '0';
//     }
//     else if (action === 'calculate'){
//         if(operator && firstValue != null){
//             const current = parseFloat(displayed);
//             const result = operate(firstValue, operator, current);
//             display.textContent = result;
//             firstValue = result;
//             operator = null;
//             waitingForSecondValue = true;
//         }
//     }
//     else{
//         const current = parseFloat(displayed);
//         if(operator && waitingForSecondValue){
//             operator = action;
//         }
//         else{
//             if(firstValue===null){
//                 firstValue = current;
//             }
//             else{
//                 const result = operate(firstValue, operator, current);
//                 display.textContent = result;
//                 firstValue = result;
//             }
//             waitingForSecondValue = true;
//             operator = action;
//         }
//     } 
// });

// function operate(a, action, b){
//     switch(action){
//         case 'add': return (a+b).toString();
//         case 'subtract': return (a-b).toString();
//         case 'multiply': return (a*b).toString();
//         case 'divide': return b !== 0 ? (a / b).toFixed(8).replace(/\.?0+$/, '') : 'Error';
//     }
// }


const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  if (operator === 'add') return firstNum + secondNum
  if (operator === 'subtract') return firstNum - secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'divide') return firstNum / secondNum
}

const getKeyType = key => {
  const { action } = key.dataset
  if (!action) return 'number'
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator'
  // For everything else, return the action
  return action
}

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = state

  if (keyType === 'number') {
    return displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
      ? keyContent
      : displayedNum + keyContent
  }

  if (keyType === 'decimal') {
    if (!displayedNum.includes('.')) return displayedNum + '.'
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
    return displayedNum
  }

  if (keyType === 'operator') {
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum
  }

  if (keyType === 'clear') return 0

  if (keyType === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum
  }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset

  calculator.dataset.previousKeyType = keyType

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
      ? modValue
      : displayedNum
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

  if (keyType === 'operator') key.classList.add('is-depressed')
  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
}

const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator_display')
const keys = calculator.querySelector('.calculator_keys')

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return
  const key = e.target
  const displayedNum = display.textContent
  const resultString = createResultString(key, displayedNum, calculator.dataset)

  display.textContent = resultString
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
})
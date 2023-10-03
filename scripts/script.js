const display = document.getElementById('display');
const keys = document.querySelectorAll('button');
const clearKey = document.getElementById('clear');

let state = 'new'; // , 'pre-sign', 'sign' and 'post-sign'
let n1 = '';
let sign = '';
let n2 = '';

keys.forEach(key => {
  key.addEventListener('click', setInput);
});

function setInput(event) {
  let key = event.target;
  let type = key.classList[0];
  let value = key.textContent;
  switch(type) {
    case 'number':
      // The only keys that change AC -> C are the numbers
      clearKey.textContent = 'C';
      switch (state) {
        case 'new':
          state = 'pre-sign';
          n1 = '';
        case 'pre-sign':
          n1 = cleanNumStr(n1 + value);
          n2 = n1;
          display.textContent = n1;
          break;
        case 'sign': // state
          state = 'post-sign';
          n2 = '';
        case 'post-sign':
          n2 = cleanNumStr(n2 + value);
          deselectKeys();
          display.textContent = n2;
          break;
      }
      break;
    case 'sign': // key type
      if (value === '=') {
        // If '=' is pressed before a number, do nothing;
        if (sign === '') {
          break;
        }
        // Else, go calculate.
        state = 'post-sign';
      }
      switch (state) {
        case 'new':
          n1 = '0';
          n2 = '0';
        case 'pre-sign':
          state = 'sign';
        case 'sign': // state
          sign = value;
          selectKey(sign);
          break;
        case 'post-sign':
          if (value === '=') {
            state = 'new';
            deselectKeys();
          } else {
            state = 'sign'
            sign = value;
            selectKey(sign);
          }
          n1 = getResultStr(n1, sign, n2);
          display.textContent = prepForDisplay(n1);
          break;
      }
      break;
    case 'special-function':
      let result = '';
      switch(key.getAttribute('id')) {
        case 'pos-neg':  
          if (display.textContent === '0') {
            state = 'pre-sign';
            n1 = '-0'
            display.textContent = prepForDisplay(n1);
            break;
          }
          // Rollover to percentage.
        case 'percentage':
          switch (state) {
            case 'new': 
            case 'pre-sign':
              result = getResultStr(n1, value);
              n1 = result;
              n2 = n1;
            case 'sign': // state
              break;
            case 'post-sign':
              result = getResultStr(n2, value);
              n2 = result;
              break;
          }     
          display.textContent = prepForDisplay(result);
          break;
        case 'clear':
          clear(value);
          break;
      }
      break;
  }
  console.log(`Key = \'${value}\'`);
  console.log(`'${state}\'`);
  console.log(`n1 = \'${n1}\'`);
  console.log(`sign is \'${sign}\'`);
  console.log(`n2 = \'${n2}\'`);
  console.log(`---------------`);
}

function cleanNumStr(numStr) {
  let nStr = splitNumStr(numStr);

  // Removes zeros to the left by turning the string to a number and back.
  // It adds a '0' before the '.' if it's the first key pressed.
  nStr.integer = (+nStr.integer).toString();

  // Removes additional decimal points.
  if (nStr.decimal.length > 1 && nStr.decimal.endsWith('.')) {
    nStr.decimal = nStr.decimal.slice(0, nStr.decimal.length - 1);
  }

  return `${nStr.integer}${nStr.decimal}`;
}

// Returns an object with an integer and decimal part (if there's any).
function splitNumStr(numStr) {
  let nStr = {
    integer: numStr,
    decimal: ''
  }
  if (numStr.includes('.')) { 
    nStr.integer = numStr.slice(0, numStr.indexOf('.'));
    nStr.decimal = numStr.slice(numStr.indexOf('.')); //Includes the decimal point.
  }
  return nStr;
}

function prepForDisplay(numStr) {
  let nStr = splitNumStr(numStr);
  return `${addThousands(nStr.integer, ',')}${nStr.decimal}`;
}

function addThousands(integerStr, separator) {
  let integerArr = integerStr.split('').reverse();
  for (let i = 3; i < integerArr.length; i += 4) {
    integerArr.splice(i, 0, `${separator}`);
  }
  return integerArr.reverse().join('');
}

function removeThousands(numStr) {
  return numStr.replace(/,/g, '');
}

function selectKey(sign) {
  deselectKeys();
  keys.forEach(key => {
    if (key.textContent === sign) {
      key.classList.add('selected');
    }
  });
}

function deselectKeys() {
  keys.forEach(key => {
    key.classList.remove('selected');
  });
}

function getResultStr(n1, sign, n2) {
  let calc = new Calculator();
  let result = calc.calculate(n1, sign, n2);
  if (sign != '%') {
    let decimalQty = Math.max(getDecimalQty(n1), getDecimalQty(n2));
    if (decimalQty > 0) {
      result = result.toFixed(decimalQty);
    }
  }
  if (result == 'Infinity' || isNaN(result)) {
    result = 'Error';
  }
  return result.toString();
}

function getDecimalQty(numStr) {
  let qty = 0;
  if (numStr != undefined && numStr.includes('.')) {
    qty = numStr.slice(numStr.indexOf('.') + 1).length;
  }
  return qty;
}

function Calculator() {
  this.operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    'x': (a, b) => a * b,
    '÷': (a, b) => a / b,
    '%': (a) => a / 100,
    '+/-': (a) => a * -1,
  }
  this.calculate = (a, sign, b) => {
    return this.operations[sign](+a, +b)
  }
}

function clear(value) {
  switch (value) {
    case 'C': //Clear
      switch(state) {
        case 'new':
        case 'pre-sign':
          clear('AC');
          break;
        case 'post-sign':
          state = 'sign';
          n2 = '0';
          selectKey(sign);
          break;
      }
      clearKey.textContent = 'AC'
      break;
    case 'AC': //All Clear
      state = 'new';
      n1 = '0';
      sign = '';
      n2 = '0';
      deselectKeys();
      break;
  }
  display.textContent = '0';
}
const displayText = document.getElementById('display-text');
const keys = document.querySelectorAll('button');
const clearKey = document.getElementById('clear');

let state; // 'pre-sign','sign' and 'post-sign'.
let n1;
let sign;
let n2;
let result;
let hasDot;
let calc = new Calculator();

window.addEventListener('load', clear('AC'));

keys.forEach(key => {
  key.addEventListener('click', setCalculation);
});

function clear(type) {
  switch (type) {
    case 'C': //Clear
      switch(state) {
        case 'pre-sign':
          n1 = '0';
          break;
        // What happens on 'sign' gets taken care of by the code before the breaks in this and the outer switch.
        case 'sign': 
          break;
        case 'post-sign':
          state = 'sign';
          n2 = '0';
          selectDeselectKeys(sign);
          break;
      }
      clearKey.textContent = 'AC'
      break;
    case 'AC': //All Clear
      state = 'pre-sign';
      n1 = '0';
      sign = '';
      n2 = '0';
      result = '';
      hasDot = false;
      selectDeselectKeys();
      break;
  }
  displayText.textContent = '0';
}

function setCalculation(event) {
  let key = event.target;
  switch(key.classList[0]) {
    case 'special-function':
      switch(key.getAttribute('id')) {
        case 'clear':
          clear(key.textContent);
          break;
        case 'pos-neg':
          
          break;
        case 'percentage':
          
          break;
      }
      break;
    case 'number':
      // The only keys that change AC -> C are the numbers
      clearKey.textContent = 'C';

      // The user can only add one dot per operand.
      if (key.getAttribute('id') === 'dot') {
        if (hasDot) {
          break;
        } 
        hasDot = true;
      }

      if (state === 'pre-sign') {
        if (n1 === '0' && hasDot === false) {
          n1 = '';
        }
        n1 += key.textContent;
        n2 = n1;
        displayText.textContent = n1;
      } else if (state === 'sign') {
        state = 'post-sign';
        selectDeselectKeys();

        // Only true when dot is pressed after the sign
        if (hasDot === true) {
          n2 = `0${key.textContent}`;
        } else {
          n2 = key.textContent;
        }
        
        displayText.textContent = n2;
      } else if (state === 'post-sign') {
        n2 += key.textContent;
        displayText.textContent = n2;
      }
      break;
    case 'sign':
      if ((state === 'pre-sign' || state === 'sign') && key.getAttribute('id') !== 'equal') {
        state = 'sign';
        selectDeselectKeys();
        sign = key.textContent;
        n2 = n1;
        hasDot = false;
        key.classList.add('selected');
      } else if (state === 'post-sign' || key.getAttribute('id') === 'equal') {
        state = 'pre-sign';
        selectDeselectKeys();
        result = calc.calculate(n1, sign, n2);
        n1 = result;
        displayText.textContent = result;
      }
      break;
  }
  updateLog();
}

function selectDeselectKeys(sign) {
  keys.forEach(key => {
    if (sign === undefined) { // No param = Deselect all
      if (key.classList.contains('selected')) {
        key.classList.remove('selected');
      }
    } else { // Select key === sign
      if (key.textContent === sign) {
        key.classList.add('selected');
      }
    }
  });
}

function updateLog() {
  console.log(`state = \'${state}\'`);
  console.log(`n1 = \'${n1}\'`);
  console.log(`sign is \'${sign}\'`);
  console.log(`n2 = \'${n2}\'`);
}

function Calculator() {
  this.operations = {
    '+': (n1, n2) => n1 + n2,
    '-': (n1, n2) => n1 - n2,
    'x': (n1, n2) => n1 * n2,
    '÷': (n1, n2) => n1 / n2,
    '%': (n1) => n1 / 100,
    '+/-': (n1) => n1 * -1,
  }
  this.calculate = (n1, sign, n2) => {
    let result = 0;
    result = this.operations[sign](+n1, +n2)
    return result.toFixed(1);
  }
}
const displayText = document.getElementById('display-text');
const keys = document.querySelectorAll('button');

let state = 'pre-sign'; // ,'sign' and 'post-sign'.
let n1 = '';
let sign = '';
let n2 = '';
let result = '';
let calc = new Calculator();

keys.forEach(key => {
  key.addEventListener('click', setCalculation);
});

function setCalculation(event) {
  let key = event.target;
  switch(key.classList[0]) {
    case 'special-function':
      console.log('Special Function');
      break;
    case 'number':
      if (state === 'pre-sign') {
        n1 += key.textContent;
        n2 = n1;
        displayText.textContent = n1;
      } else if (state === 'sign') {
        state = 'post-sign';
        deselectKeys();
        n2 = key.textContent;
        displayText.textContent = n2;
      } else if (state === 'post-sign') {
        n2 += key.textContent;
        displayText.textContent = n2;
      }
      break;
    case 'sign':
      if ((state === 'pre-sign' || state === 'sign') && key.getAttribute('id') !== 'equal') {
        state = 'sign';
        deselectKeys();
        sign = key.textContent;
        n2 = n1;
        key.classList.add('selected');
      } else if (state === 'post-sign' || key.getAttribute('id') === 'equal') {
        state = 'pre-sign';
        deselectKeys();
        result = calc.calculate(n1, sign, n2);
        n1 = result;
        displayText.textContent = result;
      }
      break;
  }
  updateLog();
}

function clear(type) {
  switch (type) {
    case 'C': //Clear
      break;
    case 'AC': //All Clear
      state = 'pre-sign';
      n1 = '';
      sign = '';
      n2 = '';
      result = '';
      deselectKeys();
      break;
  }
}

function deselectKeys() {
  keys.forEach(key => {
    if (key.classList.contains('selected')) {
      key.classList.remove('selected');
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
    let result = '';
    result = this.operations[sign](+n1, +n2)
    return result;
  }
}
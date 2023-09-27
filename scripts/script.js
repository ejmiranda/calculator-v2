const displayText = document.getElementById('display-text');
const buttons = document.querySelectorAll('button');

let state = 'pre-sign'; // 'sign', 'post-sign' 
let n1 = '';
let sign = '';
let n2 = '';
let result = 0;

buttons.forEach(button => {
  button.addEventListener('click', setCalculation);
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
        updateLog();
      } else if (state === 'sign') {
        state = 'post-sign';
        deselectOperators();
        n2 = key.textContent;
        displayText.textContent = n2;
        updateLog();
      } else if (state === 'post-sign') {
        n2 += key.textContent;
        displayText.textContent = n2;
        updateLog();
      }
      break;
    case 'sign':
      if (state === 'pre-sign' || state === 'sign') {
        state = 'sign';
        sign = key.textContent;
        deselectOperators();
        key.classList.add('selected');
        updateLog();
      } else {
        
      }
      break;
  }
}

function updateLog() {
  console.log(`state = \'${state}\'`);
  console.log(`n1 = ${n1}`);
  console.log(`sign is ${sign}`);
  console.log(`n2 = ${n2}`);
}

function deselectOperators() {
  buttons.forEach(button => {
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
    }
  });
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
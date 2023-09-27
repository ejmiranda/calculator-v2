const displayText = document.getElementById('display-text');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    displayText.textContent = button.getAttribute('id');
  });
});

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

let calc = new Calculator();
console.log(calc.calculate(2, '+', 2));
console.log(calc.calculate(5, '-', 2));
console.log(calc.calculate(5, 'x', 10));
console.log(calc.calculate(50, '÷', 2));
console.log(calc.calculate(9, '%'));
console.log(calc.calculate(100, '+/-'));
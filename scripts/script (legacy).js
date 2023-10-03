const display = document.getElementById('display');
const keys = document.querySelectorAll('button');
const clearKey = document.getElementById('clear');

let state = 'new'; // 'new' 'pre-sign', 'sign' and 'post-sign'.
let n1 = '0';
let sign = '';
let n2 = '0';
let result = '';
let hasDot = false;
let isNegative = false;

// window.addEventListener('load', clear('AC'));
window.addEventListener('load', size);

function size() {
  let text = window.getComputedStyle(display, null);
  let container = window.getComputedStyle(display.parentNode, null);
  // let canvas = document.createElement('canvas');
  // let context = canvas.getContext("2d");
  // context.font = `${text.fontSize} ${text.fontFamily}`;
  // let textWidth = Math.floor(context.measureText(display.textContent).width);
  let textWidth = Math.floor(text.width.slice(0,text.width.length - 2));
  let containerWidth = Math.floor(container.width.slice(0,container.width.length - 2));
  if (textWidth >= containerWidth) {
    //Reduce font
    // display.style.fontSize = '75px'; // 90, 75, 60, 55
    display.textContent.style.width = '100px';
    // Math.min(max_width/width, max_height/height)+"em");
    console.log(text.fontSize);
  }
  textWidth = Math.floor(text.width.slice(0,text.width.length - 2));
  console.log(textWidth);
  console.log(containerWidth);
}

keys.forEach(key => {
  key.addEventListener('click', setCalculation);
});

function setCalculation(event) {
  let key = event.target;
  console.log(`key = \'${key.textContent}\'`);
  let keyType = key.classList[0];
  switch(keyType) {
    case 'number':
      
      // The only keys that change AC -> C are the numbers
      clearKey.textContent = 'C';

      // Only one dot allowed per operand
      if (key.getAttribute('id') === 'dot') {
        if (hasDot) break;
        hasDot = true;
      }

      // No multiple zeros before decimal point
      if (key.textContent === '0') {
        if ((state === 'new' || state === 'pre-sign') && n1.length === 1 && n1.slice(0,1) === '0') break;
        if (state === 'post-sign' && n2.length === 1 && n2.slice(0,1) === '0') {
          state = 'sign';
          break;
        }
      }

      switch(state) {
        case 'new':
          if (key.getAttribute('id') === 'dot') {
            n1 = '0';
          } else {
            n1 = '';
          }
          if (isNegative) {
            n1 = `-${n1}`;
          }
          state = 'pre-sign';
          // Rollover to 'pre-sign'
        case 'pre-sign':
          n1 += key.textContent;
          n2 = n1;
          display.textContent = formatNumberString(n1);
          break;
        case 'sign':
          deselectKeys();
          if (key.getAttribute('id') === 'dot') {
            n2 = '0';
          } else {
            n2 = '';
          }
          if (isNegative) {
            n2 = `-${n2}`;
            isNegative = false;
          }
          state = 'post-sign';
          // Rollover to 'post-sign'
        case 'post-sign':
          if (key.getAttribute('id') === 'dot' && n2.length === 1 && n2.slice(0,1) === '0') {
            n2 = '0';
          } else if (key.textContent != '0' && n2.length === 1 && n2.slice(0,1) === '0') {
            n2 = '';
          }
          if (isNegative) {
            n2 = `-${n2}`;
          }
          n2 += key.textContent;
          display.textContent = formatNumberString(n2);
          break;
      }
      break;
    case 'sign':
      
      if (key.getAttribute('id') === 'equal') {
        if (sign === '') {
          break;
        }
        state = 'post-sign';
      }

      switch(state) {
        case 'new':   
          if (sign === '') break;
        case 'pre-sign':
          state = 'sign';
          // Rollover to 'sign'
        case 'sign':
          hasDot = false;
          isNegative = false;
          sign = key.textContent;
          selectKey(sign);
          break;
        case 'post-sign':
          hasDot = false;
          isNegative = false;
          result = getCalculation(n1, sign, n2);
          if (key.getAttribute('id') === 'equal') {
            deselectKeys();
            state = 'new';
          } else {
            sign = key.textContent;
            selectKey(sign);
            state = 'sign';
          }
          n1 = result;
          console.log(typeof(result));
          display.textContent = formatNumberString(result);
          break;
      }
      break;
    case 'special-function':
      switch(key.getAttribute('id')) {
        case 'clear':
          clear(key.textContent);
          break;
        case 'pos-neg':
          if (display.textContent === '0') {
            display.textContent = '-0';
            isNegative = true;
          } else {
            switch(state) {
              case 'new': 
              case 'pre-sign':
                console.log(n1,key.textContent);
                result = getCalculation(n1, key.textContent);
                n1 = result;
              case 'sign':
                break;
              case 'post-sign':
                result = getCalculation(n2, key.textContent);
                n2 = result;
            }
            display.textContent = formatNumberString(result);
          }
          break;
        case 'percentage':
          switch(state) {
            case 'new': 
            case 'pre-sign':
              result = getCalculation(n1, key.textContent);
              n1 = result;
              n2 = n1;
            case 'sign':
              break;
            case 'post-sign':
              result = getCalculation(n2, key.textContent);
              n2 = result;
          }
          hasDot = hasDecimals(result);
          display.textContent = formatNumberString(result);
          break;
      }
      break;
      // switch(state) {
      //   case 'new': 
      //     break;
      //   case 'pre-sign':
      //     break;
      //   case 'sign':
      //     break;
      //   case 'post-sign':
      //     break;
      // }
  }
  // console.log(`state = \'${state}\'`);
  // console.log(`n1 = \'${n1}\'`);
  // console.log(`sign is \'${sign}\'`);
  // console.log(`n2 = \'${n2}\'`);
  // console.log(`result = \'${result}\'`);
  // console.log(`hasDot = ${hasDot}`);
  // console.log(`---------------`);
  size();
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
    return this.operations[sign](+n1, +n2)
  }
}

function getCalculation(n1, sign, n2) {
  let calc = new Calculator();
  let decimalQty = Math.max(getDecimalQty(n1), getDecimalQty(n2));
  let result = calc.calculate(n1, sign, n2);
  if (decimalQty > 0) {
    result = result.toFixed(decimalQty);
  }
  if (result == 'Infinity' || isNaN(result)) {
    result = 'Error';
  }
  return result;
}

function formatNumberString (nStr) {
  nStr = nStr.toString();
  let isNegative = nStr.startsWith('-');
  let integer = (isNegative) ? nStr.slice(1) : nStr;
  let decimal = '';
  let point = ''

  // Check for decimal point and split the string if found
  if (integer.includes('.')) {
    point = '.';
    decimal = integer.slice(integer.indexOf('.') + 1);
    integer = integer.slice(0, integer.indexOf('.'));
  }

  // Add ',' as thousands separator
  let integerArr = integer.split('').reverse();
  for (let i = 3; i < integerArr.length; i += 4) {
    integerArr.splice(i, 0, ',')
  }
  integer = integerArr.reverse().join('');

  // Add back '-' if is negative
  if (isNegative) integer = `-${integer}`;

  // Add the decimal part if it exists
  return `${integer}${point}${decimal}`;
}

function getDecimalQty(nStr) {
  let qty = 0;
  if (nStr != undefined && nStr.includes('.')) {
    qty = nStr.slice(nStr.indexOf('.') + 1).length;
  }
  return qty;
}

function deselectKeys() {
  keys.forEach(key => {
    key.classList.remove('selected');
  });
}

function selectKey(sign) {
  deselectKeys();
  keys.forEach(key => {
    if (key.textContent === sign) {
      key.classList.add('selected');
    }
  });
}

function clear(type) {
  switch (type) {
    case 'C': //Clear
      switch(state) {
        case 'new':
        case 'pre-sign':
          clear('AC');
          break;
        case 'post-sign':
          n2 = '0';
          selectKey(sign);
          state = 'sign';
          break;
      }
      clearKey.textContent = 'AC'
      break;
    case 'AC': //All Clear
      state = 'new';
      n1 = '0';
      sign = '';
      n2 = '0';
      result = '';
      hasDot = false;
      deselectKeys();
      break;
  }
  display.textContent = '0';
}

function hasDecimals(number) {
  return (+number % 1 != 0);
}

// const displayText = document.getElementById('display-text');
// const keys = document.querySelectorAll('button');
// const clearKey = document.getElementById('clear');

// let state; // 'pre-sign', 'sign' and 'post-sign'.
// let n1;
// let sign;
// let n2;
// let result;
// let hasDot;
// let calc = new Calculator();

// window.addEventListener('load', clear('AC'));

// keys.forEach(key => {
//   key.addEventListener('click', setCalculation);
// });

// function clear(type) {
//   switch (type) {
//     case 'C': //Clear
//       switch(state) {
//         case 'pre-sign':
//           n1 = '0';
//           break;
//         // What happens on 'sign' gets taken care of by the code before the breaks in this and the outer switch.
//         case 'sign': 
//           break;
//         case 'post-sign':
//           state = 'sign';
//           n2 = '0';
//           selectDeselectKeys(sign);
//           break;
//       }
//       clearKey.textContent = 'AC'
//       break;
//     case 'AC': //All Clear
//       state = 'pre-sign';
//       n1 = '0';
//       sign = '';
//       n2 = '0';
//       result = '';
//       hasDot = false;
//       selectDeselectKeys();
//       break;
//   }
//   displayText.textContent = '0';
// }

// function setCalculation(event) {
//   let key = event.target;
//   switch(key.classList[0]) {
//     case 'special-function':
//       switch(key.getAttribute('id')) {
//         case 'clear':
//           clear(key.textContent);
//           break;
//         case 'pos-neg':
          
//           break;
//         case 'percentage':
          
//           break;
//       }
//       break;
//     case 'number':
//       // The only keys that change AC -> C are the numbers
//       clearKey.textContent = 'C';

//       // The user can only add one dot per operand.
//       if (key.getAttribute('id') === 'dot') {
//         if (hasDot) {
//           break;
//         } 
//         hasDot = true;
//       }

//       if (state === 'pre-sign') {
//         if (n1 === '0' && hasDot === false) {
//           n1 = '';
//         }
//         n1 += key.textContent;
//         n2 = n1;
//         displayText.textContent = n1;
//       } else if (state === 'sign') {
//         state = 'post-sign';
//         selectDeselectKeys();

//         // Only true when dot is pressed after the sign
//         if (hasDot === true) {
//           n2 = `0${key.textContent}`;
//         } else {
//           n2 = key.textContent;
//         }
        
//         displayText.textContent = n2;
//       } else if (state === 'post-sign') {
//         n2 += key.textContent;
//         displayText.textContent = n2;
//       }
//       break;
//     case 'sign':
//       if ((state === 'pre-sign' || state === 'sign') && key.getAttribute('id') !== 'equal') {
//         state = 'sign';
//         selectDeselectKeys();
//         sign = key.textContent;
//         n2 = n1;
//         hasDot = false;
//         key.classList.add('selected');
//       } else if (state === 'post-sign' || key.getAttribute('id') === 'equal') {
//         state = 'pre-sign';
//         selectDeselectKeys();
//         result = calc.calculate(n1, sign, n2);
//         n1 = result;
//         if (key.getAttribute('id') != 'equal') {
//           key.classList.add('selected');
//         }
//         displayText.textContent = result;
//       }
//       break;
//   }
//   console.log(`Key = \'${key.textContent}\'`);
//   updateLog();
// }

// function selectDeselectKeys(sign) {
//   keys.forEach(key => {
//     if (sign === undefined) { // No param = Deselect all
//       if (key.classList.contains('selected')) {
//         key.classList.remove('selected');
//       }
//     } else { // Select key === sign
//       if (key.textContent === sign) {
//         key.classList.add('selected');
//       }
//     }
//   });
// }

// function updateLog() {
//   console.log(`state = \'${state}\'`);
//   console.log(`n1 = \'${n1}\'`);
//   console.log(`sign is \'${sign}\'`);
//   console.log(`n2 = \'${n2}\'`);
//   console.log(`result = \'${result}\'`);
//   console.log(`hasDot = ${hasDot}`);
//   console.log(`---------------`);
// }

// function Calculator() {
//   this.operations = {
//     '+': (n1, n2) => n1 + n2,
//     '-': (n1, n2) => n1 - n2,
//     'x': (n1, n2) => n1 * n2,
//     '÷': (n1, n2) => n1 / n2,
//     '%': (n1) => n1 / 100,
//     '+/-': (n1) => n1 * -1,
//   }
//   this.calculate = (n1, sign, n2) => {
//     let result = 0;
//     result = this.operations[sign](+n1, +n2)
//     return result;
//   }
// }
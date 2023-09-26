const displayText = document.getElementById('display-text');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    displayText.textContent = button.getAttribute('id');
  });
});
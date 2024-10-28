const checkboxes = document.querySelectorAll('.submit-disclaimer-input');
const submitButtons = document.querySelectorAll('.requires-disclaimer-input');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('click', function () {
    console.log('Clicked ', this.classList);
    setSubmitDiabledState(this.checked);
  });
});

function setSubmitDiabledState(state) {
  console.log('Set State To ', state);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = state;
  });
  submitButtons.forEach((btn) => {
    btn.disabled = !state;
  });
}
// check initial state of checkbox (sometimes is defaulst to checked if the user uses the browser back button)
setSubmitDiabledState(checkboxes[0].checked);

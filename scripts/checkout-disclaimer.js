const checkboxes = document.querySelectorAll('.submit-disclaimer-input');
const submitButtons = document.querySelectorAll('.requires-disclaimer-input');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('click', function () {
    setSubmitDiabledState(this.checked);
  });
});

function setSubmitDiabledState(state) {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = state;
  });
  submitButtons.forEach((btn) => {
    btn.disabled = !state;
  });
}
// check initial state of checkbox (sometimes is defaulst to checked if the user uses the browser back button)

setSubmitDiabledState(checkboxes[0].checked);

const modalLinks = document.querySelectorAll('.modal-link');

modalLinks.forEach((link) => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    window.open(
      href,
      'policyWindow',
      'location=no,width=600,height=600,scrollbars=yes,top=100,left=700,resizable = no'
    );
  });
});
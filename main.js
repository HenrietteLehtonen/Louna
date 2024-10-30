const logInB = document.querySelector("#log-in");
const modal = document.querySelector("dialog");
const burgerMenu = document.querySelector("#burger-menu");
const dummy = document.querySelector("#dummy");

logInB.addEventListener("click", () => {
  modal.showModal();

  modal.addEventListener("blur", (evt) => {
    // Close modal when out of focus
  });
});

burgerMenu.addEventListener("click", () => {
  //Expand nav from burger menu
  //Temporary
  dummy.classList.toggle("nav-expand");
  const navExpand = document.querySelector(".nav-expand");
});

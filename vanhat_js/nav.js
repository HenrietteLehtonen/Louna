const logInB = document.querySelector("#log-in");
const modal = document.querySelector("dialog");
const burgerMenu = document.querySelector("#burger-menu");
const burgerMenuContent = document.querySelector("#burger-menu-content");

// Modal display handling
logInB.addEventListener("click", () => {
  modal.showModal();
  modal.focus();
});

modal.addEventListener("focusout", (evt) => {
  // Close modal when out of focus
  if (!evt.relatedTarget?.closest(".menu-hold")) {
    modal.close();
  }
});

//Burgermenu display handling
burgerMenu.addEventListener("click", (event) => {
  //Expand nav from burger menu
  if (burgerMenuContent.style.display === "none") {
    burgerMenuContent.style.display = "flex";
    burgerMenuContent.focus();
  } else {
    burgerMenuContent.style.display = "none";
  }
});
burgerMenuContent.addEventListener("focusout", (evt) => {
  if (!evt.relatedTarget?.closest(".menu-hold")) {
    burgerMenuContent.style.display = "none";
  }
});

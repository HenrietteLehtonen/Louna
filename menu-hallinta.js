"use strict";

// NAPPI LISÄÄ ANNOS

const addAnnos = document.querySelector("#addBtn");
addAnnos.addEventListener("click", function () {
  console.log("Lisää annos nappia painettu");
  document.querySelector("#hidden").removeAttribute("id");
});

// POISTA KAIKKI ANNOKSET

const delAll = document.querySelector("#deleteAllBtn");
delAll.addEventListener("click", function () {
  console.log("Poista kaikki");
  lista.splice(0, lista.length);
  kohde.innerHTML = "";
  console.log(lista);
});

const lista = [
  {
    id: 1,
    annos: "Lihapullat ja muusi",
    allergeenit: ["V", "L", "G"],
    hinta: 5,
  },
  {
    id: 2,
    annos: "Lohisoppa",
    allergeenit: ["G", "M"],
    hinta: 3,
  },
];
console.log(lista);

const kohde = document.querySelector("#tbody-kohde");

// // TAULUKON LUONTI

const buildHTML = (menu) => {
  return `
        <tr id="tr-${menu.id}">
          <td>${menu.annos}</td>
          <td>${menu.allergeenit}</td>
          <td>${menu.hinta}</td>
          <td><button id="del-${menu.id}" class="del-btn">x</button></td>
        </tr>
  `;
};

// TIETYN ANNOKSEN POISTAMINEN

const deletebuttonlistener = (menu) => {
  const del = document.querySelector(`#del-${menu.id}`);
  del.addEventListener("click", function () {
    const annosIndex = lista.findIndex(function (deleteItem) {
      return deleteItem.id === menu.id;
    });
    lista.splice(annosIndex, 1);
    kohde.removeChild(document.querySelector(`#tr-${menu.id}`));
    console.log("Poistettu: ", +`${menu.id}`);
  });
};

// Jokaiselle annnokselle oma rivi
const teeRivi = () => {
  for (const menu of lista) {
    console.log(menu.id);
    console.log(menu.annos);

    let html = buildHTML(menu);
    kohde.insertAdjacentHTML("beforeend", html);

    deletebuttonlistener(menu);
  }
};

// ANNOKSEN LISÄÄMINEN
const save = document.querySelector("#save-btn");
save.addEventListener("click", function () {
  // Jos lista on tyhjä, aloita id 1, muuten jatka seuraavalla numerolla
  let id;
  if (lista.length > 0) {
    id = lista[lista.length - 1].id + 1;
  } else {
    id = 1;
  }

  // allergeeni taulukko
  const selectedAllergens = Array.from(
    document.querySelectorAll(".checkbox:checked")
  ).map((checkbox) => checkbox.id);

  let menu = {
    id: id,
    annos: document.querySelector("#annos").value,
    allergeenit: selectedAllergens,
    hinta: document.querySelector("#price").value,
  };

  let html = buildHTML(menu);
  kohde.insertAdjacentHTML("beforeend", html);

  lista.push(menu);
  console.log(menu.id);
  console.log(menu.annos);
  deletebuttonlistener(menu);

  // tyhjennetään formi

  document.querySelector("#annos").value = "";
  document.querySelector("#price").value = "";
  document
    .querySelectorAll(".checkbox")
    .forEach((checkbox) => (checkbox.checked = false));
});

// PERUUTA
const peruuta = document.querySelector("#peruuta");
peruuta.addEventListener("click", function () {
  console.log("Peruuta nappia painettu");
  document
    .querySelector(".container-ruokavalinta")
    .setAttribute("id", "hidden");

  // tyhjennetään formi

  document.querySelector("#annos").value = "";
  document.querySelector("#price").value = "";
  document
    .querySelectorAll(".checkbox")
    .forEach((checkbox) => (checkbox.checked = false));
});
teeRivi();

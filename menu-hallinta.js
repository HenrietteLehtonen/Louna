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
/*************************** */

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
/*************************** */

// JOKAISELLE ANNOKSELLE OMA RIVI
const teeRivi = () => {
  for (const menu of lista) {
    console.log(menu.id);
    console.log(menu.annos);

    let html = buildHTML(menu); // kutsutaan taulukon luontia
    kohde.insertAdjacentHTML("beforeend", html); // lisätään taulukko kohteeseen

    deletebuttonlistener(menu); // lisätään deletebutton listener riveille
  }
};
/*************************** */

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

  // allergeenit taulukoksi
  const selectedAllergens = Array.from(
    document.querySelectorAll(".checkbox:checked")
  ).map((checkbox) => checkbox.name);

  // muutetaan hinta numeroksi
  const hintaNumeroksi = Number(document.querySelector("#price").value);

  // alustetaan menu objektiksi
  let menu = {
    id: id,
    annos: document.querySelector("#annos").value,
    allergeenit: selectedAllergens,
    hinta: hintaNumeroksi,
  };

  // tsekataan onko valuet tyhjjiä annoksen lisäämisessä, jos on huomautetaan !
  if (menu.annos === "" || menu.hinta < 1) {
    alert("Täytä kentät");
  } else {
    let html = buildHTML(menu);
    kohde.insertAdjacentHTML("beforeend", html);

    lista.push(menu);
    console.log(menu.id);
    console.log(menu.annos);
    console.log(typeof menu.hinta);
    console.log(annos.value);
    console.log(Object.values(menu));
    deletebuttonlistener(menu);

    // tyhjennetään formi annoksen lisäämisen jälkeen
    // TYHJENNÄ FORM
    document.querySelector("#annos").value = "";
    document.querySelector("#price").value = "";
    document
      .querySelectorAll(".checkbox")
      .forEach((checkbox) => (checkbox.checked = false));
  }
});

// PERUUTA
const peruuta = document.querySelector("#peruuta");
peruuta.addEventListener("click", function () {
  console.log("Peruuta nappia painettu");
  document
    .querySelector(".container-ruokavalinta")
    .setAttribute("id", "hidden");
});
teeRivi();

/// Input Type Reset

/*

TILAUSTEN HALLINTA

*/

// TILAUS MOCKDATA

const tilaus = [
  {
    tilaus_id: 1,
    tilausnro: 852,
    tilattu_aika: 10,
    nouto_aika: 12,
    tilauksen_tila: "Odottaa noutoa",
  },
  {
    tilaus_id: 2,
    tilausnro: 548500,
    tilattu_aika: 11,
    nouto_aika: 12,
    tilauksen_tila: "Työn alla",
  },
];

// TAULUKKO

const buildTilaustaulukko = () => {};

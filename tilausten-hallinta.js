"use strict";

// TILAUSTEN HALLINTA

// TILAUS MOCKDATA

const tilaukset = [
  {
    tilaus_id: 1,
    tilausnro: 852,
    tilattu_aika: 10,
    nouto_aika: "11:30",
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

// KOHDE

const tilaustaulukko = document.querySelector("#tbody-kohde-tilaukset"); //
const etsiTilaus = document.querySelector("#etsi-tilaus-btn");

// FUNKTIOT

// TILAUKSIEN TAULUKOLLE RIVIT RAKENNUS

const buildTilaustaulukko = (tilaus) => {
  return `
    <tr id="tilaus-${tilaus.tilaus_id}">
      <td>${tilaus.tilausnro}</td>
      <td>${tilaus.tilattu_aika}</td>
      <td>${tilaus.tilauksen_tila}</td>
      <td>${tilaus.nouto_aika}</td>
      <td><button id="poista-${tilaus.tilaus_id}" class="del-btn">x</button></td>
    </tr>
    `;
};

// TILAUKSEN POISTAMISEN FUNKTIO
const poistaTilausFunktio = (tilaus) => {
  const poistaTilausBTN = document.querySelector(`#poista-${tilaus.tilaus_id}`);

  poistaTilausBTN.addEventListener("click", function () {
    console.log(`Poistetaan tilaus ${tilaus.tilaus_id}`);

    // etitään poistettavan tilauksen indeksi -> tilaus id
    const tilausIndex = tilaukset.findIndex(
      (item) => item.tilaus_id === tilaus.tilaus_id
    );

    // poista tilaus taulukosta
    tilaukset.splice(tilausIndex, 1);

    // poista rivi html taulukosta
    const rivi = document.querySelector(`#tilaus-${tilaus.tilaus_id}`);
    tilaustaulukko.removeChild(rivi);
  });
};

// LISÄTÄÄN OMAT RIVIT TILAUKSILLE

const teeRivitTilauksille = () => {
  // käydään tilaukset taulukko läpi
  for (const tilaus of tilaukset) {
    // lisätään joka riville oma tilaus
    let taulukkoHTML = buildTilaustaulukko(tilaus);
    tilaustaulukko.insertAdjacentHTML("beforeend", taulukkoHTML);
    // Lisätään riville tilauksen poisto
    poistaTilausFunktio(tilaus);
  }
};

// ETSI TILAUS BTN EVENT LISTENER
etsiTilaus.addEventListener("click", function () {
  console.log("Painnettu etsi tilaus btn");

  const kohde = document.querySelector("#p-kohde");

  // etsi input arvo
  const tilausnumero = document.querySelector("#etsi-tilaus").value;
  // katotaan täsmääkö arrayn tilaukseen
  // Etsi tilaus nro arraysta
  const tilaus = tilaukset.find((t) => t.tilausnro == tilausnumero); // vertaillaan tilausnroa syötettyyn nro
  // alertataan jos tilais nro ei täsmää
  if (!tilaus) {
    alert("Väärä tilausnro");
  }
  kohde.innerText = `Tilausnumero: ${tilausnumero} `;
});

// TILAUKSEN TILA
// PÄIVITYS
const update = document.querySelector("#update");
update.addEventListener("click", function () {
  console.log("päivitä nappia painettu");
  const tilauksenTila = document.querySelector("#tilauksen-tila");
  const tilauksenValue = tilauksenTila.value;
  console.log(tilauksenValue);
  //etsi tilauksen tila arraysta
  const päivitä = tilaukset.find(
    (tila) => tila.tilauksen_tila == tilauksenTila
  );

  // etsi mihin id = tilausnumeroon lisätään.
  // WIP
  // päivitetään uusi tila arrayhin
});

// AJO

teeRivitTilauksille();

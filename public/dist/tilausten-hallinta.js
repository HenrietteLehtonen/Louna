import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "./utils/variables.js";

// KOHTEET
const tilaustaulukko = document.querySelector("#tbody-kohde-tilaukset");
const etsiTilaus = document.querySelector("#etsi-tilaus-btn");
const kohde = document.querySelector("#tilausnumero-p-kohde");
// FUNKTIOT
// TILAUKSIEN TAULUKOLLE RIVIT RAKENNUS
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2xldmVsX2lkIjoxLCJpYXQiOjE3MzM2ODczNDIsImV4cCI6MTczMzc3Mzc0Mn0.8bYgnmTClI7Or2y4MwmuxjayzH6lYvVG2PENzU6VFrA";
// TILAUKSEN POISTAMISEN FUNKTIO
const poistaTilausFunktio = (tilaus) => {
  const poistaTilausBTN = document.querySelector(`#poista-${tilaus.tilaus_id}`);
  poistaTilausBTN.addEventListener("click", async () => {
    // BACK
    const options = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const result = await fetchData(
      apiUrl + `/menu/tilaus/${tilaus.tilaus_id}`,
      options
    );

    // poista rivi html taulukosta
    const rivi = document.querySelector(`#tilaus-${tilaus.tilaus_id}`);
    tilaustaulukko.removeChild(rivi);
  });
};

/**
 *  BACKEND YHTEYS
 *
 */
const haeData = async () => {
  try {
    // Haetaan data backendistä
    const tilaukset = await fetchData(apiUrl + `/menu/tilaus`);
    for (const tilaus of tilaukset) {
      let html = `
       <tr id="tilaus-${tilaus.tilaus_id}">
        <td>${tilaus.tilaus_id}</td>
        <td>${tilaus.nimet.map((nimi, index) => `${nimi} (${tilaus.määrä[index]})`).join(", ")}</td>
        <td>${new Date(tilaus.tilaus_aika).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
        <td id="tila-${tilaus.tilaus_id}" >${tilaus.tila}</td>
        <td id="nouto-${tilaus.tilaus_id}">${new Date(tilaus.nouto_aika).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
        
        <td><button id="poista-${tilaus.tilaus_id}" class="del-btn">x</button></td>
      </tr>
      `;
      tilaustaulukko.insertAdjacentHTML("beforeend", html);
      poistaTilausFunktio(tilaus);
    }
  } catch (e) {
    console.error("Tietojen hakeminen epäonnistui:", e);
  }
};
haeData();
/**
 *
 *  TILAUKSEN MUOKKAAMINEN
 *
 *
 *
 */
// ETSI TILAUS TILAUSNUMEROLLA & PÄIVITÄ TILAUS
const etsiTilausFunktio = async () => {
  const tilaukset = await fetchData(apiUrl + `/menu/tilaus`);
  if (!etsiTilaus) {
    console.error("Etsi tilaus btn ei löytynyt.");
    return;
  }
  etsiTilaus.addEventListener("click", function () {
    // etsi input arvo
    const tilausnumero = Number(document.querySelector("#etsi-tilaus").value);
    if (isNaN(tilausnumero)) {
      alert("Anna kelvollinen tilausnumero.");
      document.querySelector("#etsi-tilaus").value = "";
      return;
    }
    // katotaan täsmääkö arrayn tilausnumero inputarvoon
    // Etsi tilaus nro arraysta
    const tilaus = tilaukset.find((t) => t.tilaus_id === tilausnumero); // vertaillaan tilausnroa syötettyyn nro
    // alertataan jos tilais nro ei täsmää
    if (!tilaus) {
      alert("Tällä numerolla ei löytynyt tilausta");
      document.querySelector("#etsi-tilaus").value = "";
      return;
    }
    kohde.innerText = `Tilausnumero: ${tilausnumero} `;
    // PYSTYTÄÄN TEKEMÄÄN PÄIVITYS KUN TILAUS NRO LÖYDETTY!
    const päivitäTilausBTN = document.querySelector("#update");
    if (!päivitäTilausBTN) {
      console.error("Päivitä nappia ei löytynyt");
      return;
    }
    /// PÄIVITÄ TILAUS
    päivitäTilausBTN.addEventListener(
      "click",
      async () => {
        try {
          let data = {
            tila: document.querySelector("#tilauksen-tila").value,
            noutoaika: document.querySelector("#nouto-aika").value,
          };
          const options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          const result = await fetchData(
            apiUrl + `/menu/tilaus/${tilaus.tilaus_id}`,
            options
          );
        } catch (error) {
          console.error("Tilausta ei onnistuttu päivittämään", error);
        }
        //---------- tilauksen tila
        const päivitettyTila = document.querySelector("#tilauksen-tila").value;
        if (päivitettyTila !== "") {
          // päivitetään tilauksen tila taulukkoon
          tilaus.tila = päivitettyTila;
          // päivitetään tilauksen tila html
          const päivitettäväTilaTD = document.querySelector(
            `#tila-${tilaus.tilaus_id}`
          );
          //
          päivitettäväTilaTD.innerText = päivitettyTila;
        }
        //---------- noutoaika
        const päivitettyNoutoaika = document.querySelector("#nouto-aika").value;
        // jos noutoaika ei oo tyhjä
        if (päivitettyNoutoaika !== "") {
          // päivitetään taulukkoon
          tilaus.nouto_aika = päivitettyNoutoaika;
          // päivitetään html
          const päivitettäväAika = document.querySelector(
            `#nouto-${tilaus.tilaus_id}`
          );
          päivitettäväAika.innerText = päivitettyNoutoaika;
        }
        document.querySelector("#etsi-tilaus").value = "";
        kohde.innerText = "Tilausnumero:";
        document.querySelector("#tilauksen-tila").value = "";
        document.querySelector("#nouto-aika").value = "";
      },
      { once: true }
    );
  });
};
// PERUUTA TILAUKSEN MUOKKAAMINEN
const peruutaBTN = document.querySelector("#peruuta-btn");
peruutaBTN.addEventListener("click", function () {
  // tyhjennetään inputit kun peruutetaan
  document.querySelector("#etsi-tilaus").value = "";
  kohde.innerText = "Tilausnumero:";
  document.querySelector("#tilauksen-tila").value = "";
  document.querySelector("#nouto-aika").value = "";
});
// teeRivitTilauksille();
etsiTilausFunktio();

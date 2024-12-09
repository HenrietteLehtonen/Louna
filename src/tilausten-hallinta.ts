import { Tilaukset } from "./types/menu";
import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "../utils/variables.js";
import { clearScreenDown } from "readline";

// TILAUS MOCKDATA

// const tilaukset: Tilaukset[] = [
//   {
//     tilaus_id: 1,
//     tilausnro: 852,
//     tilattu_aika: 10,
//     nouto_aika: "11:30",
//     tilauksen_tila: "Odottaa noutoa",
//   },
//   {
//     tilaus_id: 2,
//     tilausnro: 548500,
//     tilattu_aika: 11,
//     nouto_aika: "12",
//     tilauksen_tila: "Työn alla",
//   },
// ];

// const tilaukset: Tilaukset[] = [
//   {
//     tilaus_id: 1,
//     tila: "Työn alla",
//     tilaus_aika: "10:30",
//     nouto_aika: "11",
//     nimet: ["Karjalanpaisti", "Kanttarellikeitto"],
//     määrä: [1, 2],
//   },
//   {
//     tilaus_id: 2,
//     tila: "Odottaa noutoa",
//     tilaus_aika: "10",
//     nouto_aika: "11:30",
//     nimet: ["Lohikeitto", "Margerita-pizza"],
//     määrä: [2, 5],
//   },
// ];

// KOHTEET

const tilaustaulukko = document.querySelector(
  "#tbody-kohde-tilaukset"
) as HTMLElement;
const etsiTilaus = document.querySelector(
  "#etsi-tilaus-btn"
) as HTMLButtonElement;
const kohde = document.querySelector("#tilausnumero-p-kohde") as HTMLElement;

// FUNKTIOT

// TILAUKSIEN TAULUKOLLE RIVIT RAKENNUS

// const buildTilaustaulukko = (tilaus: Tilaukset) => {
//   return `
//       <tr id="tilaus-${tilaus.tilaus_id}">
//         <td>${tilaus.tilaus_id}</td>
//         <td>${tilaus.nimet.map((nimi, index) => `${nimi} (${tilaus.määrä[index]})`).join(", ")}</td>
//         <td>${tilaus.tilaus_aika}</td>
//         <td id="tila-${tilaus.tilaus_id}" >${tilaus.tila}</td>
//         <td id="nouto-${tilaus.tilaus_id}">${tilaus.nouto_aika}</td>

//         <td><button id="poista-${tilaus.tilaus_id}" class="del-btn">x</button></td>
//       </tr>
//       `;
// };
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2xldmVsX2lkIjoxLCJpYXQiOjE3MzM2ODczNDIsImV4cCI6MTczMzc3Mzc0Mn0.8bYgnmTClI7Or2y4MwmuxjayzH6lYvVG2PENzU6VFrA";

// TILAUKSEN POISTAMISEN FUNKTIO
const poistaTilausFunktio = (tilaus: Tilaukset) => {
  const poistaTilausBTN = document.querySelector(
    `#poista-${tilaus.tilaus_id}`
  ) as HTMLButtonElement;

  poistaTilausBTN.addEventListener("click", async () => {
    console.log(`Poistetaan tilaus ${tilaus.tilaus_id}`);
    // BACK
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const result = await fetchData<Tilaukset>(
      apiUrl + `/menu/tilaus/${tilaus.tilaus_id}`,
      options
    );
    console.log(result);

    // etitään poistettavan tilauksen indeksi -> tilaus id
    // const tilausIndex = tilaukset.findIndex(
    //   (item) => item.tilaus_id === tilaus.tilaus_id
    // );

    // // poista tilaus taulukosta
    // tilaukset.splice(tilausIndex, 1);

    // poista rivi html taulukosta
    const rivi = document.querySelector(
      `#tilaus-${tilaus.tilaus_id}`
    ) as HTMLElement;
    tilaustaulukko.removeChild(rivi);
  });
};

// LISÄTÄÄN TILAUKSET HTML TAULUKKOON / RIVI

// const teeRivitTilauksille = () => {
//   // käydään tilaukset taulukko läpi
//   for (const tilaus of tilaukset) {
//     // lisätään joka riville oma tilaus
//     let taulukkoHTML = buildTilaustaulukko(tilaus);
//     tilaustaulukko.insertAdjacentHTML("beforeend", taulukkoHTML);
//     // omat_tilaukset.insertAdjacentHTML("beforeend", taulukkoHTML);
//     // Lisätään riville tilauksen poisto
//     poistaTilausFunktio(tilaus);
//   }
// };

/**
 *  BACKEND YHTEYS
 *
 */

const haeData = async () => {
  try {
    // Haetaan data backendistä
    const tilaukset = await fetchData<Tilaukset[]>(apiUrl + `/menu/tilaus`);
    console.log(tilaukset);

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
  const tilaukset = await fetchData<Tilaukset[]>(apiUrl + `/menu/tilaus`);

  if (!etsiTilaus) {
    console.error("Etsi tilaus btn ei löytynyt.");
    return;
  }
  etsiTilaus.addEventListener("click", function () {
    console.log("Painnettu etsi tilaus btn");

    // etsi input arvo
    const tilausnumero = Number(
      (document.querySelector("#etsi-tilaus") as HTMLInputElement).value
    );
    if (isNaN(tilausnumero)) {
      alert("Anna kelvollinen tilausnumero.");
      (document.querySelector("#etsi-tilaus") as HTMLInputElement).value = "";
      return;
    }
    console.log("Tilausnumero: " + tilausnumero);

    // katotaan täsmääkö arrayn tilausnumero inputarvoon
    // Etsi tilaus nro arraysta
    const tilaus = tilaukset.find((t) => t.tilaus_id === tilausnumero); // vertaillaan tilausnroa syötettyyn nro
    // alertataan jos tilais nro ei täsmää

    if (!tilaus) {
      alert("Tällä numerolla ei löytynyt tilausta");
      (document.querySelector("#etsi-tilaus") as HTMLInputElement).value = "";
      return;
    }
    kohde.innerText = `Tilausnumero: ${tilausnumero} `;

    // PYSTYTÄÄN TEKEMÄÄN PÄIVITYS KUN TILAUS NRO LÖYDETTY!
    const päivitäTilausBTN = document.querySelector(
      "#update"
    ) as HTMLButtonElement;
    if (!päivitäTilausBTN) {
      console.log("Päivitä nappia ei löytynyt");
      return;
    }

    /// PÄIVITÄ TILAUS
    päivitäTilausBTN.addEventListener("click", async () => {
      console.log("päivitä nappia painettu");
      try {
        console.log("Päivitetään tilaustieoja...");

        let data = {
          tila: (document.querySelector("#tilauksen-tila") as HTMLInputElement)
            .value,
          noutoaika: (document.querySelector("#nouto-aika") as HTMLInputElement)
            .value,
        };
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
        console.log(options);
        const result = await fetchData<Tilaukset>(
          apiUrl + `/menu/tilaus/${tilaus.tilaus_id}`,
          options
        );
        console.log(data);
        console.log(result);
      } catch (error) {
        console.error("Tilausta ei onnistuttu päivittämään", error);
      }

      //---------- tilauksen tila
      // haetaan tilauksen tila selectionin value
      // const päivitettyTila = (
      //   document.querySelector("#tilauksen-tila") as HTMLInputElement
      // ).value;

      // if (päivitettyTila !== "") {
      //   // päivitetään tilauksen tila taulukkoon
      //   tilaus.tila = päivitettyTila;

      //   // päivitetään tilauksen tila html
      //   const päivitettäväTilaTD = document.querySelector(
      //     `#tila-${tilaus.tilaus_id}`
      //   ) as HTMLElement;
      //   //

      //   päivitettäväTilaTD.innerText = päivitettyTila;

      //   console.log(`Tilauksen uusi tila: ${päivitettyTila}`);
      //   console.log(tilaus);
      // }
      // //---------- noutoaika
      // const päivitettyNoutoaika = (
      //   document.querySelector("#nouto-aika") as HTMLInputElement
      // ).value;
      // // jos noutoaika ei oo tyhjä
      // if (päivitettyNoutoaika !== "") {
      //   // päivitetään taulukkoon
      //   tilaus.nouto_aika = päivitettyNoutoaika;
      //   // päivitetään html
      //   const päivitettäväAika = document.querySelector(
      //     `#nouto-${tilaus.tilaus_id}`
      //   ) as HTMLElement;

      //   päivitettäväAika.innerText = päivitettyNoutoaika;
      //   console.log(`Tilauksen uusi noutoaika: ${päivitettyNoutoaika}`);
      // }

      (document.querySelector("#etsi-tilaus") as HTMLInputElement).value = "";
      kohde.innerText = "Tilausnumero:";
      (document.querySelector("#tilauksen-tila") as HTMLInputElement).value =
        "";
      (document.querySelector("#nouto-aika") as HTMLInputElement).value = "";
      console.log(tilaus);
      console.log(`Päivitetty tilausta ${tilausnumero}`);
    });
  });
};

// PERUUTA TILAUKSEN MUOKKAAMINEN

const peruutaBTN = document.querySelector("#peruuta-btn") as HTMLButtonElement;

peruutaBTN.addEventListener("click", function () {
  console.log("Tilauksen päivittämisen peruutus-nappia painettu");

  // tyhjennetään inputit kun peruutetaan
  (document.querySelector("#etsi-tilaus") as HTMLInputElement).value = "";
  kohde.innerText = "Tilausnumero:";
  (document.querySelector("#tilauksen-tila") as HTMLInputElement).value = "";
  (document.querySelector("#nouto-aika") as HTMLInputElement).value = "";
});

// teeRivitTilauksille();
etsiTilausFunktio();

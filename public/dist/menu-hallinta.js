import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "./utils/variables.js";

const viikonpäivät = [
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
];
const kohde = document.querySelector("#tbody-kohde");
//
/***************************
 *
 * ANNOKSEN LISÄÄMINEN JA POISTAMINEN
 *
 **********************************/
// Aavaa annoksen lisäys laatikko
const addAnnos = document.querySelector("#addBtn");
if (!addAnnos) {
  console.error("Lisää annos nappia ei löytynyt!");
}
addAnnos.addEventListener("click", function () {
  document.querySelector("#hidden").removeAttribute("id");
});
// Poista kaikki annokset
const delAll = document.querySelector("#deleteAllBtn");
if (!delAll) {
  console.error("Poista kaikkia nappia ei löytynyt!");
}
delAll.addEventListener("click", async () => {
  try {
    const options = {
      method: "DELETE",
      // headers: {
      //   Authorization: "Bearer " + token,
      // },
    };
    // yhteys backendiin
    const result = await fetchData(apiUrl + `/menu`, options);
    // poistetaan kaikki annosrivit taulukosta
    const annosRivit = document.querySelectorAll("tr.annos-rivi");
    annosRivit.forEach((rivi) => rivi.remove());
  } catch (error) {
    console.error("Annoksia ei pystytä poistamaan");
  }
});
const token = localStorage.getItem("token");
// Poista yksittäinen annos
const deletebuttonlistener = (menu) => {
  const del = document.querySelector(`#del-${menu.annos_id}`);
  if (!del) {
    console.error("Poista napia ei löytynyt!");
  }
  del.addEventListener("click", async () => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // yhteys backendiin
      const result = await fetchData(
        apiUrl + `/menu/${menu.annos_id}`,
        options
      );
      // poista taulukosta
      kohde.removeChild(document.querySelector(`#tr-${menu.annos_id}`));
    } catch (error) {
      console.error("Ei onnistuttu poistamaan.");
    }
  });
};
// Lisää annos
const save = document.querySelector("#save-btn");
if (!save) {
  console.error("Lisää nappia ei löydetty!");
}
/**
 *
 *  LISÄÄ ANNOS BACKEND
 *
 */
save.addEventListener("click", async () => {
  try {
    // haetaan input kentät
    let data = {
      day_name: document.querySelector("#päivä-valitsin").value,
      nimi: document.querySelector("#annos").value,
      allerg_id: document.querySelector(".checkbox:checked").value,
      hinta: document.querySelector("#price").value,
    };
    // muutetaan options, koska ei käyteta GET
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const result = await fetchData(apiUrl + "/menu", options);
    /// LISÄTÄÄN HTML
    const uusiAnnosHTML = luoAnnosRivi(data.day_name, {
      annos_id: result.annos_id,
      nimi: data.nimi,
      allergeenit: document.querySelector(".checkbox:checked").name,
      hinta: data.hinta,
    });
    const päiväRiv = document.querySelector(
      `.päivä-rivi[data-päivä="${data.day_name}"]`
    );
    if (päiväRiv) {
      päiväRiv.insertAdjacentHTML("afterend", uusiAnnosHTML);
    }
    // formin tyhjennys
    document.querySelector("#päivä-valitsin").value = "";
    document.querySelector("#annos").value = "";
    document.querySelector(".checkbox:checked").value = "";
    document.querySelector("#price").value = "";
    // piilotetaan annoksen lisäämisen jälkeen
    const add = document.querySelector(".container-ruokavalinta");
    add.setAttribute("id", "hidden");
  } catch (error) {
    console.error("Ei onnistuttu lisäämään annosta");
  }
});
// Peruuta
const peruuta = document.querySelector("#peruuta");
if (!peruuta) {
  console.error("Peruuta nappia ei löytynyt!");
}
peruuta.addEventListener("click", function () {
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
/***************************
 *
 * VIIKONPÄIVIEN LUONTII TAULUKKOA VARTEN
 *
 **********************************/
const teeViikonpäivät = () => {
  for (const päivä of viikonpäivät) {
    const päiväRivi = document.createElement("tr");
    päiväRivi.classList.add("päivä-rivi");
    päiväRivi.setAttribute("data-päivä", päivä);
    päiväRivi.innerHTML = `
        <td colspan="1">${päivä}</td>
      `;
    kohde.appendChild(päiväRivi);
  }
};
teeViikonpäivät();
/***************************
 *
 * TAULUKONLUONTI
 *
 ***************************/

const luoAnnosRivi = (päivä, annos) => {
  return `
    <tr id="tr-${annos.annos_id}" class="annos-rivi" data-päivä="${päivä}">
      <td></td>
      <td>${annos.nimi}</td>
      <td>${annos.allergeenit}</td>
      <td>${annos.hinta / 100}</td>
      <td><button id="del-${annos.annos_id}" class="del-btn">x</button></td>
    </tr>
  `;
};
const haeData = async () => {
  try {
    const ruokalista = await fetchData(apiUrl + `/menu`);
    for (const päivä of ruokalista) {
      const päivänAnnokset = päivä.annokset;
      päivänAnnokset.forEach((annos) => {
        // jokaiselle annokselle oma rivi
        const html = luoAnnosRivi(päivä.day, annos);
        // lisää rivin oikean päivän kohdalle
        const päiväRiv = document.querySelector(
          `.päivä-rivi[data-päivä="${päivä.day}"]`
        );
        if (päiväRiv) {
          päiväRiv.insertAdjacentHTML("afterend", html);
        }
        deletebuttonlistener(annos);
      });
    }
  } catch (error) {
    console.error("Ei löydy:", error);
  }
};
haeData();

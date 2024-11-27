import { Menu } from "./types/menu";

// Mock data
const lista: Menu[] = [
  {
    day: "Maanantai",
    id: 1,
    annos: "Lihapullat ja muusi",
    allergeenit: ["V", "L", "G"],
    hinta: 5,
  },
  {
    day: "Maanantai",
    id: 2,
    annos: "Lohisoppa",
    allergeenit: ["G", "M"],
    hinta: 3,
  },
  {
    day: "Tiistai",
    id: 3,
    annos: "Fish & Chips",
    allergeenit: ["VL", "M", "SO"],
    hinta: 3,
  },
];

const viikonpäivät: string[] = [
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
];

const kohde = document.querySelector("#tbody-kohde") as HTMLElement;

/***************************
 *
 * ANNOKSEN LISÄÄMINEN JA POISTAMINEN
 *
 **********************************/

// Aavaa annoksen lisäys laatikko
const addAnnos = document.querySelector("#addBtn") as HTMLButtonElement;
if (!addAnnos) {
  console.log("Lisää annos nappia ei löytynyt!");
}
addAnnos.addEventListener("click", function () {
  console.log("Lisää annos nappia painettu");
  document.querySelector("#hidden")!.removeAttribute("id");
});

// Poista kaikki annokset
const delAll = document.querySelector("#deleteAllBtn") as HTMLButtonElement;
if (!delAll) {
  console.log("Poista kaikkia nappia ei löytynyt!");
}
delAll.addEventListener("click", function () {
  console.log("Poista kaikki");
  lista.splice(0, lista.length);
  // Poista kaikki annosrivit
  const annosRivit = document.querySelectorAll("tr.annos-rivi");
  annosRivit.forEach((rivi) => rivi.remove());
  console.log("Kaikki annoksett poistettu");
});

// Poista yksittäinen annos
const deletebuttonlistener = (menu: Menu) => {
  const del = document.querySelector(`#del-${menu.id}`) as HTMLButtonElement;
  if (!del) {
    console.log("Poista napia ei löytynyt!");
  }
  del.addEventListener("click", function () {
    const annosIndex = lista.findIndex(function (deleteItem) {
      return deleteItem.id === menu.id;
    });
    lista.splice(annosIndex, 1);
    kohde.removeChild(document.querySelector(`#tr-${menu.id}`) as HTMLElement);
    console.log(`Poistettu: ${menu.id}`);
  });
};

// Lisää annos
const save = document.querySelector("#save-btn") as HTMLButtonElement;
if (!save) {
  console.log("Lisää nappia ei löydetty!");
}
save.addEventListener("click", function () {
  // Jos lista on tyhjä, aloita id 1, muuten jatka seuraavalla numerolla
  let id: number;
  if (lista.length > 0) {
    id = lista[lista.length - 1].id + 1;
  } else {
    id = 1;
  }

  // allergeenit taulukoksi
  const selectedAllergens: string[] = Array.from(
    document.querySelectorAll<HTMLInputElement>(".checkbox:checked")
  ).map((checkbox: HTMLInputElement) => checkbox.name);

  // muutetaan hinta numeroksi
  const hintaNumeroksi = Number(
    (document.querySelector("#price") as HTMLInputElement).value
  );

  // alustetaan menu objektiksi
  let menu = {
    day: (document.querySelector("#päivä-valitsin") as HTMLSelectElement).value,
    id: id,
    annos: (document.querySelector("#annos") as HTMLInputElement).value,
    allergeenit: selectedAllergens,
    hinta: hintaNumeroksi,
  };

  // tsekataan onko valuet tyhjjiä annoksen lisäämisessä, jos on huomautetaan !
  if (menu.annos === "" || menu.hinta < 1) {
    alert("Täytä kentät");
  } else {
    let html = buildHTML(menu);
    const päiväRivi = document.querySelector(
      `.päivä-rivi[data-päivä="${menu.day}"]`
    ) as HTMLElement;
    päiväRivi.insertAdjacentHTML("afterend", html); // Lisää annos oikean päivän alle

    lista.push(menu);
    // console.log(menu.day);
    // console.log(menu.annos);
    // console.log(typeof menu.hinta);
    // console.log(annos.value);
    // console.log(Object.values(menu));
    deletebuttonlistener(menu);

    // tyhjennetään formi annoksen lisäämisen jälkeen

    (document.querySelector("#annos") as HTMLInputElement).value = "";
    (document.querySelector("#price") as HTMLInputElement).value = "";
    document
      .querySelectorAll<HTMLInputElement>(".checkbox")
      .forEach((checkbox) => (checkbox.checked = false));
  }
});

// Peruuta

const peruuta = document.querySelector("#peruuta") as HTMLButtonElement;
if (!peruuta) {
  console.log("Peruuta nappia ei löytynyt!");
}
peruuta.addEventListener("click", function () {
  console.log("Peruuta nappia painettu");
  (
    document.querySelector(".container-ruokavalinta") as HTMLElement
  ).setAttribute("id", "hidden");

  // tyhjennetään formi
  (document.querySelector("#annos") as HTMLInputElement).value = "";
  (document.querySelector("#price") as HTMLInputElement).value = "";
  document
    .querySelectorAll<HTMLInputElement>(".checkbox")
    .forEach((checkbox) => (checkbox.checked = false));
});

/***************************
 *
 * VIIKONPÄIVIEN LUOTNI TAULUKKOA VARTEN
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

/***************************
 *
 * TAULUKONLUONTI
 *
 ***************************/

// Taulukon alustus
const buildHTML = (menu: Menu) => {
  return `
          <tr id="tr-${menu.id}" class="annos-rivi" data-päivä="${menu.day}">
          <td></td>
            <td>${menu.annos}</td>
            <td>${menu.allergeenit.join(", ")}</td>
            <td>${menu.hinta}</td>
            <td><button id="del-${menu.id}" class="del-btn">x</button></td>
          </tr>
    `;
};

// Annosrivit taulukolle
const teeRivi = (): void => {
  for (const menu of lista) {
    console.log(menu.id);
    console.log(menu.annos);

    let html = buildHTML(menu); // kutsutaan taulukon luontia

    // haetaan oikea päivä rivi mihin lisätään
    const päiväRivi = document.querySelector(
      `.päivä-rivi[data-päivä="${menu.day}"]`
    ) as HTMLElement;
    päiväRivi.insertAdjacentHTML("afterend", html); // Lisää annos oikean päivän alle

    deletebuttonlistener(menu); // lisätään deletebutton listener riveille
  }
};

teeViikonpäivät();
teeRivi();

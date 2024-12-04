// Mock data
const lista = [
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
const viikonpäivät = [
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
];
const kohde = document.querySelector("#tbody-kohde");
/***************************
 *
 * ANNOKSEN LISÄÄMINEN JA POISTAMINEN
 *
 **********************************/
// Aavaa annoksen lisäys laatikko
const addAnnos = document.querySelector("#addBtn");
if (!addAnnos) {
    console.log("Lisää annos nappia ei löytynyt!");
}
addAnnos.addEventListener("click", function () {
    console.log("Lisää annos nappia painettu");
    document.querySelector("#hidden").removeAttribute("id");
});
// Poista kaikki annokset
const delAll = document.querySelector("#deleteAllBtn");
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
const deletebuttonlistener = (menu) => {
    const del = document.querySelector(`#del-${menu.id}`);
    if (!del) {
        console.log("Poisa napia ei löytynyt!");
    }
    del.addEventListener("click", function () {
        const annosIndex = lista.findIndex(function (deleteItem) {
            return deleteItem.id === menu.id;
        });
        lista.splice(annosIndex, 1);
        kohde.removeChild(document.querySelector(`#tr-${menu.id}`));
        console.log(`Poistettu: ${menu.id}`);
    });
};
// Lisää annos
const save = document.querySelector("#save-btn");
if (!save) {
    console.log("Lisää nappia ei löydetty!");
}
save.addEventListener("click", function () {
    // Jos lista on tyhjä, aloita id 1, muuten jatka seuraavalla numerolla
    let id;
    if (lista.length > 0) {
        id = lista[lista.length - 1].id + 1;
    }
    else {
        id = 1;
    }
    // allergeenit taulukoksi
    const selectedAllergens = Array.from(document.querySelectorAll(".checkbox:checked")).map((checkbox) => checkbox.name);
    // muutetaan hinta numeroksi
    const hintaNumeroksi = Number(document.querySelector("#price").value);
    // alustetaan menu objektiksi
    let menu = {
        day: document.querySelector("#päivä-valitsin").value,
        id: id,
        annos: document.querySelector("#annos").value,
        allergeenit: selectedAllergens,
        hinta: hintaNumeroksi,
    };
    // tsekataan onko valuet tyhjjiä annoksen lisäämisessä, jos on huomautetaan !
    if (menu.annos === "" || menu.hinta < 1) {
        alert("Täytä kentät");
    }
    else {
        let html = buildHTML(menu);
        const päiväRivi = document.querySelector(`.päivä-rivi[data-päivä="${menu.day}"]`);
        päiväRivi.insertAdjacentHTML("afterend", html); // Lisää annos oikean päivän alle
        lista.push(menu);
        // console.log(menu.day);
        // console.log(menu.annos);
        // console.log(typeof menu.hinta);
        // console.log(annos.value);
        // console.log(Object.values(menu));
        deletebuttonlistener(menu);
        // tyhjennetään formi annoksen lisäämisen jälkeen
        document.querySelector("#annos").value = "";
        document.querySelector("#price").value = "";
        document
            .querySelectorAll(".checkbox")
            .forEach((checkbox) => (checkbox.checked = false));
    }
});
// Peruuta
const peruuta = document.querySelector("#peruuta");
if (!peruuta) {
    console.log("Peruuta nappia ei löytynyt!");
}
peruuta.addEventListener("click", function () {
    console.log("Peruuta nappia painettu");
    document.querySelector(".container-ruokavalinta").setAttribute("id", "hidden");
    // tyhjennetään formi
    document.querySelector("#annos").value = "";
    document.querySelector("#price").value = "";
    document
        .querySelectorAll(".checkbox")
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
const buildHTML = (menu) => {
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
const teeRivi = () => {
    for (const menu of lista) {
        console.log(menu.id);
        console.log(menu.annos);
        let html = buildHTML(menu); // kutsutaan taulukon luontia
        // haetaan oikea päivä rivi mihin lisätään
        const päiväRivi = document.querySelector(`.päivä-rivi[data-päivä="${menu.day}"]`);
        päiväRivi.insertAdjacentHTML("afterend", html); // Lisää annos oikean päivän alle
        deletebuttonlistener(menu); // lisätään deletebutton listener riveille
    }
};
teeViikonpäivät();
teeRivi();
console.log(":)");
export {};
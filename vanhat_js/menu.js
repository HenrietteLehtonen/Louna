const ruokaLista = [
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
  {
    day: "Tiistai",
    id: 4,
    annos: "Kasvislasagne",
    allergeenit: ["VL"],
    hinta: 4,
  },
  {
    day: "Keskiviikko",
    id: 5,
    annos: "Kalakeitto",
    allergeenit: ["M", "K"],
    hinta: 5,
  },
  {
    day: "Keskiviikko",
    id: 6,
    annos: "Pinaattiletut ja puolukkahillo",
    allergeenit: ["V", "L"],
    hinta: 4,
  },
  {
    day: "Torstai",
    id: 7,
    annos: "Hernekeitto ja pannukakku",
    allergeenit: ["V", "G"],
    hinta: 3,
  },
  {
    day: "Torstai",
    id: 8,
    annos: "Jauhelihapihvi ja perunat",
    allergeenit: ["G", "M"],
    hinta: 5,
  },
  {
    day: "Perjantai",
    id: 9,
    annos: "Pizza",
    allergeenit: ["VL", "G"],
    hinta: 6,
  },
  {
    day: "Perjantai",
    id: 10,
    annos: "Tacos",
    allergeenit: ["M", "S"],
    hinta: 5,
  },
  {
    day: "Lauantai",
    id: 11,
    annos: "Nakkikastike ja perunamuusi",
    allergeenit: ["G", "M"],
    hinta: 4,
  },
  {
    day: "Lauantai",
    id: 12,
    annos: "Kasviscurry",
    allergeenit: ["V", "G"],
    hinta: 3.5,
  },
  {
    day: "Sunnuntai",
    id: 13,
    annos: "Paistettu lohi ja riisi",
    allergeenit: ["G", "M"],
    hinta: 6.5,
  },
  {
    day: "Sunnuntai",
    id: 14,
    annos: "Makaronilaatikko",
    allergeenit: ["M"],
    hinta: 4.5,
  },
];

// DATE OBJEKTI

const today = new Date().getDay();
console.log(today);

const viikonpäivät = [
  "Sunnuntai", // getDay() = 0
  "Maanantai", // getDay() = 1
  "Tiistai", // getDay() = 2 ...
  "Keskiviikko",
  "Torstai",
  "Perjantai",
  "Lauantai",
];

/// NÄYTÄ PÄIVÄKOHTAINEN RUOKALISTA FUNKTIO

const showMenu = () => {
  const dayButtons = document.querySelectorAll(".day-btn");
  const kohde = document.querySelector("#kohde");

  const tämäpäivä = viikonpäivät[today];

  // Näytetään tämän päivän menu funktio, parametrina päivä
  const näytäPäivänMenu = (day) => {
    const päivänRuoka = ruokaLista.filter((ruoka) => ruoka.day === day);
    kohde.innerHTML = "";

    // Lisää päivän otsikko
    const päiväOtsikko = `
      <tr>
        <th colspan=3>${day}</th>
      </tr>
    `;
    kohde.insertAdjacentHTML("beforeend", päiväOtsikko);

    // Lisää ruokalistan annokset per päivä
    päivänRuoka.forEach((ruoka) => {
      const annoksetTaulukko = `
        <tr>
          <td class="annos-td">
            ${ruoka.annos}<br>
            ${ruoka.allergeenit.join(", ")}
          </td>
          <td>${ruoka.hinta}€ </td>
          <td><button class="add-btn">+</button></td>
        </tr>
      `;
      kohde.insertAdjacentHTML("beforeend", annoksetTaulukko);
    });
  };

  // Näytetään tämän päivän menu automaattisesti
  näytäPäivänMenu(tämäpäivä);

  // Napeista näyttämään muut päivät
  dayButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const day = this.getAttribute("data-day");
      näytäPäivänMenu(day);
    });
  });
};

showMenu();

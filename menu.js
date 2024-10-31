// MOCK DATA

const ruokaLista = [
  {
    day: "Maanantai",
    annokset: {
      annos1: {
        nimi: "peruna",
        hinta: { opiskelija: 2.5, muu: 3.0 },
        allergeenit: ["ei allergeenejä"],
      },
      annos2: {
        nimi: "makkara",
        hinta: { opiskelija: 3.0, muu: 4.0 },
        allergeenit: ["G", "S"], // Gluteeni, Soija
      },
    },
  },
  {
    day: "Tiistai",
    annokset: {
      annos1: {
        nimi: "pasta",
        hinta: { opiskelija: 4.0, muu: 5.0 },
        allergeenit: ["G", "E"], // Gluteeni, Kanamuna
      },
      annos2: {
        nimi: "kana",
        hinta: { opiskelija: 5.0, muu: 6.0 },
        allergeenit: ["ei allergeenejä"],
      },
    },
  },
  {
    day: "Keskiviikko",
    annokset: {
      annos1: {
        nimi: "kalakeitto",
        hinta: { opiskelija: 6.5, muu: 7.5 },
        allergeenit: ["K", "M"], // Kalat, Maido
      },
      annos2: {
        nimi: "leipä",
        hinta: { opiskelija: 1.5, muu: 2.0 },
        allergeenit: ["G", "M"], // Gluteeni, Maido
      },
    },
  },
  {
    day: "Torstai",
    annokset: {
      annos1: {
        nimi: "lasagne",
        hinta: { opiskelija: 7.0, muu: 8.0 },
        allergeenit: ["G", "M", "S"], // Gluteeni, Maido, Soija
      },
      annos2: {
        nimi: "salaatti",
        hinta: { opiskelija: 3.5, muu: 4.0 },
        allergeenit: ["ei allergeenejä"],
      },
    },
  },
  {
    day: "Perjantai",
    annokset: {
      annos1: {
        nimi: "pizza",
        hinta: { opiskelija: 2.0, muu: 8.0 },
        allergeenit: ["G", "M"], // Gluteeni, Maido
      },
      annos2: {
        nimi: "tacos",
        hinta: { opiskelija: 5.5, muu: 6.0 },
        allergeenit: ["M", "S"], // Maido, Soija
      },
    },
  },
];

/// NÄYTÄ PÄIVÄKOHTAINEN RUOKALISTA

// 1.haetaan kaikki napit

const buttons = document.querySelectorAll(".day-btn");

// 2. napeille event listener
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    // tyhjennetään taulukko
    kohde.innerHTML = "";

    // haetaan ruokalistat
    const day = this.getAttribute("data-day"); // this -> napin attribuutti
    const lista = ruokaLista.find((lista) => lista.day === day); // etitään ruokalistan päivä

    if (lista) {
      const html = `
          <tr>
            <th colspan=3>${lista.day}</th>
          </tr>
          <tr>
            <td>
              <p>${lista.annokset.annos1.nimi}<br>
              ${lista.annokset.annos1.allergeenit}</p>
            </td>
            <td>${lista.annokset.annos1.hinta.opiskelija}€ / ${lista.annokset.annos1.hinta.muu} €</td>
            <td><button>+</button></td>
          </tr>
          <tr>
            <td>
              ${lista.annokset.annos2.nimi}<br>
              ${lista.annokset.annos2.allergeenit}</td>
              <td>${lista.annokset.annos2.hinta.opiskelija}€ / ${lista.annokset.annos2.hinta.muu} €</td>
              <td><button>+</button></td>
          </tr>
        `;
      kohde.insertAdjacentHTML("beforeend", html);
    }
  });
});

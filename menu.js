// MOCK DATA

const ruokaLista = [
  {
    day: "Maanantai",
    annokset: {
      annos1: {
        nimi: "peruna",
        hinta: { opiskelija: 2.5, muu: 3.0 },
        allergeenit: [""],
        id: 1,
      },
      annos2: {
        nimi: "makkara",
        hinta: { opiskelija: 3.0, muu: 4.0 },
        allergeenit: ["G", "S"],
        id: 2,
      },
    },
  },
  {
    day: "Tiistai",
    annokset: {
      annos1: {
        nimi: "pasta",
        hinta: { opiskelija: 4.0, muu: 5.0 },
        allergeenit: ["G", "E"],
        id: 3,
      },
      annos2: {
        nimi: "kana",
        hinta: { opiskelija: 5.0, muu: 6.0 },
        allergeenit: [""],
        id: 4,
      },
    },
  },
  {
    day: "Keskiviikko",
    annokset: {
      annos1: {
        nimi: "kalakeitto",
        hinta: { opiskelija: 6.5, muu: 7.5 },
        allergeenit: ["K", "M"],
        id: 5,
      },
      annos2: {
        nimi: "leipä",
        hinta: { opiskelija: 1.5, muu: 2.0 },
        allergeenit: ["G", "M"],
        id: 6,
      },
    },
  },
  {
    day: "Torstai",
    annokset: {
      annos1: {
        nimi: "lasagne",
        hinta: { opiskelija: 7.0, muu: 8.0 },
        allergeenit: ["G", "M", "S"],
        id: 7,
      },
      annos2: {
        nimi: "salaatti",
        hinta: { opiskelija: 3.5, muu: 4.0 },
        allergeenit: [""],
        id: 8,
      },
    },
  },
  {
    day: "Perjantai",
    annokset: {
      annos1: {
        nimi: "pizza",
        hinta: { opiskelija: 2.0, muu: 8.0 },
        allergeenit: ["G", "M"],
        id: 9,
      },
      annos2: {
        nimi: "tacos",
        hinta: { opiskelija: 5.5, muu: 6.0 },
        allergeenit: ["M", "S"],
        id: 10,
      },
    },
  },
];

/// NÄYTÄ PÄIVÄKOHTAINEN RUOKALISTA FUNKTIO

const showMenu = () => {
  // haetaan napit

  const dayButtons = document.querySelectorAll(".day-btn");

  // napeille event listener

  dayButtons.forEach((button) => {
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
              ${lista.annokset.annos1.nimi}<br>
              ${lista.annokset.annos1.allergeenit}
            </td>
            <td>${lista.annokset.annos1.hinta.opiskelija}€ / ${lista.annokset.annos1.hinta.muu} €</td>
            <td><button class="add-btn">+</button></td>
          </tr>
          <tr>
            <td>
              ${lista.annokset.annos2.nimi}<br>
              ${lista.annokset.annos2.allergeenit}</td>
              <td>${lista.annokset.annos2.hinta.opiskelija}€ / ${lista.annokset.annos2.hinta.muu} €</td>
              <td><button class="add-btn">+</button></td>
          </tr>
        `;
        kohde.insertAdjacentHTML("beforeend", html);

        // ruokalistan napeille alert
        const addToCartButton = document.querySelectorAll(".add-btn");

        addToCartButton.forEach((button) => {
          button.addEventListener("click", function () {
            alert("Tuote lisätty ostoskoriin.");
          });
        });
      }
    });
  });
};

showMenu();

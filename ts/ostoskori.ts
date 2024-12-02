// Rajapinta ostoskorin tuotteelle
interface OstoskoriItem {
  nimi: string;
  hinta: {
    muu: number; //
  };
  maara: number;
}

// Alustus ja datan haku
let ostoskori: OstoskoriItem[] = JSON.parse(
  localStorage.getItem("ostoskori") || "[]"
);

// Tuotteen lisääminen ostoskoriin
function lisaaOstoskoriin(ruoka: OstoskoriItem): void {
  const existingProduct = ostoskori.find((item) => item.nimi === ruoka.nimi);

  if (existingProduct) {
    existingProduct.maara += 1;
  } else {
    ostoskori.push({ ...ruoka, maara: 1 });
  }
  paivitaOstoskori();
}

// Funktiot tuotteen määrän muuttamiseen
const inc = (index: number): void => {
  ostoskori[index].maara += 1;
};

const dec = (index: number): void => {
  if (ostoskori[index].maara > 1) {
    ostoskori[index].maara -= 1;
  } else {
    ostoskori.splice(index, 1);
  }
};

const rem = (index: number): void => {
  ostoskori.splice(index, 1);
};

// Ostoskorin päivitys ja tallennus
function paivitaOstoskori(): void {
  const cartItems = document.getElementById("cart-items") as HTMLElement | null;
  const cartTotal = document.getElementById("cart-total") as HTMLElement | null;

  if (!cartItems || !cartTotal) {
    console.error("Ostoskorielementtejä ei löytynyt!");
    return;
  }

  cartItems.innerHTML = "";
  let total = 0;

  ostoskori.forEach((item, index) => {
    const hinta = item.hinta.muu;

    if (isNaN(hinta)) {
      console.error(`Virheellinen hinta tuotteelle: ${item.nimi}`);
      return;
    }

    const tuotteenKokonaishinta = hinta * item.maara;

    const itemElement = document.createElement("li");
    itemElement.innerHTML = `
      ${item.nimi} - ${hinta.toFixed(2)} € x ${item.maara} = ${tuotteenKokonaishinta.toFixed(2)} €
      <button class="increase-btn" data-index="${index}">+</button>
      <button class="decrease-btn" data-index="${index}">-</button>
      <button class="remove-btn" data-index="${index}">Poista</button>
    `;
    cartItems.appendChild(itemElement);

    total += tuotteenKokonaishinta;
  });

  cartTotal.textContent = `Kokonaishinta: ${total.toFixed(2)} €`;
  localStorage.setItem("ostoskori", JSON.stringify(ostoskori));

  napienToiminnallisuus(".increase-btn", inc);
  napienToiminnallisuus(".decrease-btn", dec);
  napienToiminnallisuus(".remove-btn", rem);

  if (ostoskori.length > 0 && !document.querySelector(".confirm-btn")) {
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Vahvista ostos";
    confirmButton.classList.add("confirm-btn");

    confirmButton.addEventListener("click", () => {
      localStorage.setItem("vahvistetutTilaukset", JSON.stringify(ostoskori));
      window.location.href = "tilaustiedot.html";
    });

    cartItems.parentElement?.appendChild(confirmButton);
  }
}

// Uusi Funktio nappien toiminnalle
function napienToiminnallisuus(
  query: string,
  keskiFunktio: (index: number) => void
): void {
  document.querySelectorAll(query).forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = parseInt(
        (event.target as HTMLButtonElement).getAttribute("data-index") || "0",
        10
      );
      keskiFunktio(index);
      paivitaOstoskori();
    });
  });
}

// Dokumentin latautuessa
document.addEventListener("DOMContentLoaded", () => {
  paivitaOstoskori();

  const customModal = document.getElementById(
    "custom-modal"
  ) as HTMLElement | null;
  if (customModal) {
    const closeCartButton = document.getElementById(
      "close-cart"
    ) as HTMLElement | null;
    if (closeCartButton) {
      closeCartButton.addEventListener("click", () => {
        customModal.classList.add("hidden");
      });
    } else {
      console.error("Sulje-nappia ei löytynyt!");
    }
  } else {
    console.error("Ostoskorin modaalia ei löytynyt!");
  }
});

// Ostoskorin avaaminen
document.addEventListener("DOMContentLoaded", () => {
  const customModal = document.getElementById(
    "custom-modal"
  ) as HTMLElement | null;
  const openCartButton = document.getElementById(
    "open-modal-btn"
  ) as HTMLElement | null;

  if (openCartButton) {
    openCartButton.addEventListener("click", () => {
      customModal?.classList.remove("hidden");
    });
  } else {
    console.error("Avauspainiketta ei löytynyt!");
  }
});

// Tuotteen lisääminen ostoskoriin
document.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).classList.contains("add-btn")) {
    const row = (event.target as HTMLElement).closest(
      "tr"
    ) as HTMLTableRowElement;

    const ruokaNimi =
      row.querySelector("td")?.childNodes[0].textContent?.trim() || "";

    const hintaText = row.querySelectorAll("td")[1]?.textContent || "";

    const parsedHintaText = hintaText.split("/")[0].trim();
    const hinta = parseFloat(
      parsedHintaText.replace(/[^0-9,.]/g, "").replace(",", ".")
    );

    if (isNaN(hinta)) {
      console.error("Virheellinen hinta-arvo:", parsedHintaText);
      return;
    }

    const ruoka: OstoskoriItem = {
      nimi: ruokaNimi,
      hinta: { muu: hinta },
      maara: 0,
    };

    lisaaOstoskoriin(ruoka);
  }
});

import {
  Annokset,
  OstoskoriItem,
  Ruokalista,
  TilausPacket,
} from "./types/menu";
import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "./utils/variables.js";

// Rajapinta ostoskorin tuotteelle

//** TOASTER*/

function naytaToaster(viesti: string): void {
  const toasterContainer = document.getElementById("toaster-container");
  if (!toasterContainer) {
    console.error("Toaster-kontaineria ei löytynyt!");
    return;
  }
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = viesti;
  toasterContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
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
    naytaToaster(`Tuote lisätty ostoskoriin: ${ruoka.nimi}`);
  } else {
    ostoskori.push({ ...ruoka, maara: 1 });
    naytaToaster(`Tuote lisätty ostoskoriin: ${ruoka.nimi}`);
  }

  paivitaOstoskori();
}

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
  console.log(ostoskori);
  napienToiminnallisuus(".increase-btn", inc);
  napienToiminnallisuus(".decrease-btn", dec);
  napienToiminnallisuus(".remove-btn", rem);

  if (ostoskori.length > 0 && !document.querySelector(".confirm-btn")) {
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Vahvista ostos";
    confirmButton.classList.add("confirm-btn");
    confirmButton.addEventListener("click", async () => {
      localStorage.setItem("vahvistetutTilaukset", JSON.stringify(ostoskori));
      let packet: TilausPacket[] = [];
      ostoskori.forEach((i) => {
        const s = {
          annos_id: i.annos_id,
          määrä: i.maara,
        };
        packet.push(s);
      });
      const data = {
        user_id: 2,
        tilaukset: packet,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      await fetchData<Annokset>(apiUrl + "/menu/tilaus", options);
      window.location.href = "tilaustiedot.html";
    });
    cartItems.parentElement?.appendChild(confirmButton);
  } else if (ostoskori.length === 0) {
    const confirmButton = document.querySelector(
      ".confirm-btn"
    ) as HTMLButtonElement;
    console.log(confirmButton);
    confirmButton?.remove();
  }
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
document.addEventListener(
  "DOMContentLoaded",
  () => {
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
  },
  { once: true }
);

// Ostoskorin avaaminen

export { lisaaOstoskoriin };

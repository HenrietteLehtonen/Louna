"use strict";
// Alustus ja datan haku
let ostoskori = JSON.parse(localStorage.getItem("ostoskori") || "[]");
// Tuotteen lisääminen ostoskoriin
function lisaaOstoskoriin(ruoka) {
    const existingProduct = ostoskori.find((item) => item.nimi === ruoka.nimi);
    if (existingProduct) {
        existingProduct.maara += 1;
    }
    else {
        ostoskori.push(Object.assign(Object.assign({}, ruoka), { maara: 1 }));
    }
    paivitaOstoskori();
}
// Funktiot tuotteen määrän muuttamiseen
const inc = (index) => {
    ostoskori[index].maara += 1;
};
const dec = (index) => {
    if (ostoskori[index].maara > 1) {
        ostoskori[index].maara -= 1;
    }
    else {
        ostoskori.splice(index, 1);
    }
};
const rem = (index) => {
    ostoskori.splice(index, 1);
};
// Ostoskorin päivitys ja tallennus
function paivitaOstoskori() {
    var _a;
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
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
        (_a = cartItems.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(confirmButton);
    }
}
// Uusi Funktio nappien toiminnalle
function napienToiminnallisuus(query, keskiFunktio) {
    document.querySelectorAll(query).forEach((button) => {
        button.addEventListener("click", (event) => {
            const index = parseInt(event.target.getAttribute("data-index") || "0", 10);
            keskiFunktio(index);
            paivitaOstoskori();
        });
    });
}
// Dokumentin latautuessa
document.addEventListener("DOMContentLoaded", () => {
    paivitaOstoskori();
    const customModal = document.getElementById("custom-modal");
    if (customModal) {
        const closeCartButton = document.getElementById("close-cart");
        if (closeCartButton) {
            closeCartButton.addEventListener("click", () => {
                customModal.classList.add("hidden");
            });
        }
        else {
            console.error("Sulje-nappia ei löytynyt!");
        }
    }
    else {
        console.error("Ostoskorin modaalia ei löytynyt!");
    }
});
// Ostoskorin avaaminen
document.addEventListener("DOMContentLoaded", () => {
    const customModal = document.getElementById("custom-modal");
    const openCartButton = document.getElementById("open-modal-btn");
    if (openCartButton) {
        openCartButton.addEventListener("click", () => {
            customModal === null || customModal === void 0 ? void 0 : customModal.classList.remove("hidden");
        });
    }
    else {
        console.error("Avauspainiketta ei löytynyt!");
    }
});
// Tuotteen lisääminen ostoskoriin
document.addEventListener("click", (event) => {
    var _a, _b, _c;
    if (event.target.classList.contains("add-btn")) {
        const row = event.target.closest("tr");
        const ruokaNimi = ((_b = (_a = row.querySelector("td")) === null || _a === void 0 ? void 0 : _a.childNodes[0].textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
        const hintaText = ((_c = row.querySelectorAll("td")[1]) === null || _c === void 0 ? void 0 : _c.textContent) || "";
        const parsedHintaText = hintaText.split("/")[0].trim();
        const hinta = parseFloat(parsedHintaText.replace(/[^0-9,.]/g, "").replace(",", "."));
        if (isNaN(hinta)) {
            console.error("Virheellinen hinta-arvo:", parsedHintaText);
            return;
        }
        const ruoka = {
            nimi: ruokaNimi,
            hinta: { muu: hinta },
            maara: 0,
        };
        lisaaOstoskoriin(ruoka);
    }
});

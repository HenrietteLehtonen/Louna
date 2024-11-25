// Alustus ja datan haku
let ostoskori = JSON.parse(localStorage.getItem("ostoskori")) || [];

// Tuotteen lisääminen ostoskoriin
function lisaaOstoskoriin(ruoka) {
  const existingProduct = ostoskori.find((item) => item.nimi === ruoka.nimi);

  if (existingProduct) {
    existingProduct.maara += 1;
  } else {
    ostoskori.push({ ...ruoka, maara: 1 });
  }
  paivitaOstoskori();
}

const inc = (index) => {
  ostoskori[index].maara += 1;
};
const dec = (index) => {
  if (ostoskori[index].maara > 1) {
    ostoskori[index].maara -= 1;
  } else {
    ostoskori.splice(index, 1);
  }
};
const rem = (index) => {
  ostoskori.splice(index, 1);
};

// Ostoskorin päivitys ja tallennus
function paivitaOstoskori() {
  /* voi siirtäää funktion ulkopuolelle */
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  /* voi siirtäää funktion ulkopuolelle */

  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;

  ostoskori.forEach((item, index) => {
    const hinta = parseFloat(item.hinta.muu);
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

  // poista myöhemmin
  /*   document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      ostoskori[index].maara += 1;
      paivitaOstoskori();
    });
  });

  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      if (ostoskori[index].maara > 1) {
        ostoskori[index].maara -= 1;
      } else {
        ostoskori.splice(index, 1);
      }
      paivitaOstoskori();
    });
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      ostoskori.splice(index, 1);
      paivitaOstoskori();
    });
  }); */

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
  
    cartItems.parentElement.appendChild(confirmButton)
  }
}
// uusi Functio nappien toiminnalle
function napienToiminnallisuus(query, keskiFunktio) {
  document.querySelectorAll(query).forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      keskiFunktio(index);
      paivitaOstoskori();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  paivitaOstoskori();

  const customModal = document.getElementById("custom-modal");
  if (customModal) {
    const closeCartButton = document.getElementById("close-cart");
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
  const customModal = document.getElementById("custom-modal");
  const openCartButton = document.getElementById("open-modal-btn"); 


  // Ostoskorin avaaminen
  if (openCartButton) {
    openCartButton.addEventListener("click", () => {
      customModal.classList.remove("hidden");
    });
  } else {
    console.error("Avauspainiketta ei löytynyt!");
  }
});


document.addEventListener("click", (event) => {
  console.log(event.target.parentElement.parentElement);

  if (event.target.classList.contains("add-btn")) {
  
    const row = event.target.closest("tr");

    
    const ruokaNimi = row.querySelector("td").childNodes[0].textContent.trim(); 

 
    const hintaText = row.querySelectorAll("td")[1].textContent;

    console.log("Ruoka Nimi: ", ruokaNimi); 
    console.log("Hinta: ", hintaText); 


    const parsedHintaText = hintaText.split("/")[0].trim();
    const hinta = parseFloat(
      parsedHintaText.replace(/[^0-9,.]/g, "").replace(",", ".")
    );

    if (isNaN(hinta)) {
      console.error("Virheellinen hinta-arvo:", parsedHintaText);
      return;
    }

    const ruoka = {
      nimi: ruokaNimi.trim(),
      hinta: { muu: hinta },
    };

    lisaaOstoskoriin(ruoka);
  }
});
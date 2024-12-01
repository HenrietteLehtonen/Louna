document.addEventListener("DOMContentLoaded", function() {
  // Haetaan ostoskorin tiedot localStoragesta
  const ostoskori = JSON.parse(localStorage.getItem("ostoskori")) || [];
  const orderItemsList = document.getElementById('order-items'); // Kohdistetaan tilauksen lista

  // Tarkistetaan, onko ostoskoriin tuotteita
  if (ostoskori.length > 0) {
    ostoskori.forEach(item => {
      const listItem = document.createElement('li');
      const itemPrice = parseFloat(item.hinta.muu).toFixed(2); // Lasketaan tuotteen hinta
      listItem.textContent = `${item.nimi} - ${item.maara} x ${itemPrice} €`;
      orderItemsList.appendChild(listItem);
    });

    // Lasketaan kokonaishinta
    const totalPrice = ostoskori.reduce((total, item) => total + (parseFloat(item.hinta.muu) * item.maara), 0);
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.innerHTML = `<p>Kokonaishinta: ${totalPrice.toFixed(2)} €</p>`;
  } else {
    // Jos ostoskori on tyhjä, näytetään ilmoitus
    orderItemsList.innerHTML = '<p>Ostoskorisi on tyhjä.</p>';
  }

  // Takaisin Etusivulle -painikkeen toiminto
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', function() {
      // Siirtyy etusivulle (index.html)
      window.location.href = "index.html"; // Muokkaa linkki oikeaksi etusivuksesi
    });
  }
});

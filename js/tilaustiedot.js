document.addEventListener("DOMContentLoaded", function () {
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
    backButton.addEventListener('click', function () {
      // Siirtyy etusivulle (index.html)
      window.location.href = "index.html"; // Muokkaa linkki oikeaksi etusivuksesi
    });
  }

  // Tallennuspainikkeen toiminto
  const saveButton = document.getElementById("save-button");
  if (saveButton) {
    saveButton.addEventListener("click", function () {
      const fullName = document.getElementById("full-name").value;
      const address = document.getElementById("address").value;
      const region = document.getElementById("region").value;
      const city = document.getElementById("city").value;
      const zipCode = document.getElementById("zip-code").value;

      // Tarkista, että kaikki kentät on täytetty
      if (!fullName || !address || !city || !zipCode) {
        alert("Täytä kaikki kentät ennen tallentamista!");
        return;
      }

      // Tallennetaan tiedot localStorageen
      const addressData = {
        fullName,
        address,
        region,
        city,
        zipCode,
      };

      localStorage.setItem("userAddress", JSON.stringify(addressData));

      // Vahvistusviesti
      alert("Osoitetiedot tallennettu!");
    });
  }

  // Näytä tallennetut osoitetiedot sivun latautuessa
  const savedAddress = localStorage.getItem("userAddress");
  if (savedAddress) {
    const addressData = JSON.parse(savedAddress);
    document.getElementById("full-name").value = addressData.fullName;
    document.getElementById("address").value = addressData.address;
    document.getElementById("region").value = addressData.region;
    document.getElementById("city").value = addressData.city;
    document.getElementById("zip-code").value = addressData.zipCode;
  }
});

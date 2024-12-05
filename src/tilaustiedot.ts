document.addEventListener("DOMContentLoaded", function () {
  // Rajapinta ostoskorin tuotteelle
  interface OstoskoriItem {
    nimi: string;
    hinta: {
      muu: string; // Hinta merkkijonona
    };
    maara: number; // Tuotteen määrä
  }

  // Rajapinta osoitetietoja varten
  interface AddressData {
    fullName: string;
    address: string;
    region: string;
    city: string;
    zipCode: string;
  }

  // Haetaan ostoskorin tiedot localStoragesta
  const ostoskori: OstoskoriItem[] = JSON.parse(
    localStorage.getItem("ostoskori") || "[]"
  );

  const orderItemsList = document.getElementById(
    "order-items"
  ) as HTMLUListElement; // Kohdistetaan tilauksen lista

  // Tarkistetaan, onko ostoskoriin tuotteita
  if (ostoskori.length > 0) {
    ostoskori.forEach((item: OstoskoriItem) => {
      const listItem = document.createElement("li");
      const itemPrice = parseFloat(item.hinta.muu).toFixed(2); // Lasketaan tuotteen hinta
      listItem.textContent = `${item.nimi} - ${item.maara} x ${itemPrice} €`;
      orderItemsList.appendChild(listItem);
    });

    // Lasketaan kokonaishinta
    const totalPrice = ostoskori.reduce(
      (total: number, item: OstoskoriItem) =>
        total + parseFloat(item.hinta.muu) * item.maara,
      0
    );

    const totalPriceElement = document.getElementById(
      "total-price"
    ) as HTMLElement;
    totalPriceElement.innerHTML = `<p>Kokonaishinta: ${totalPrice.toFixed(2)} €</p>`;
  } else {
    // Jos ostoskori on tyhjä, näytetään ilmoitus
    if (orderItemsList) {
      orderItemsList.innerHTML = "<p>Ostoskorisi on tyhjä.</p>";
    }
  }

  // Takaisin Etusivulle -painikkeen toiminto
  const backButton = document.getElementById(
    "back-button"
  ) as HTMLButtonElement;
  if (backButton) {
    backButton.addEventListener("click", function (): void {
      // Siirtyy etusivulle (index.html)
      window.location.href = "index.html"; // Muokkaa linkki oikeaksi etusivuksesi
    });
  }

  // Tallennuspainikkeen toiminto
  const saveButton = document.getElementById(
    "save-button"
  ) as HTMLButtonElement;
  if (saveButton) {
    saveButton.addEventListener("click", function (): void {
      // Syöttökenttien arvot
      const fullName = (
        document.getElementById("full-name") as HTMLInputElement
      ).value;
      const address = (document.getElementById("address") as HTMLInputElement)
        .value;
      const region = (document.getElementById("region") as HTMLInputElement)
        .value;
      const city = (document.getElementById("city") as HTMLInputElement).value;
      const zipCode = (document.getElementById("zip-code") as HTMLInputElement)
        .value;

      // Tarkista, että kaikki kentät on täytetty
      if (!fullName || !address || !city || !zipCode) {
        alert("Täytä kaikki kentät ennen tallentamista!");
        return;
      }

      // Tallennetaan tiedot localStorageen
      const addressData: AddressData = {
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
    const addressData = JSON.parse(savedAddress) as AddressData;

    (document.getElementById("full-name") as HTMLInputElement).value =
      addressData.fullName;
    (document.getElementById("address") as HTMLInputElement).value =
      addressData.address;
    (document.getElementById("region") as HTMLInputElement).value =
      addressData.region;
    (document.getElementById("city") as HTMLInputElement).value =
      addressData.city;
    (document.getElementById("zip-code") as HTMLInputElement).value =
      addressData.zipCode;
  }
});

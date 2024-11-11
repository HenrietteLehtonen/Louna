// Sivun alustus ja elementtien haku
document.addEventListener("DOMContentLoaded", () => {
  const orderItemsElement = document.getElementById("order-items");
  const totalPriceElement = document.getElementById("total-price");
  const backButton = document.getElementById("back-button");
  
  // Vahvistettujen tilausten käsittely
  const vahvistetutTilaukset = JSON.parse(localStorage.getItem("vahvistetutTilaukset"));

  if (vahvistetutTilaukset && vahvistetutTilaukset.length > 0) {
    let totalPrice = 0;

    vahvistetutTilaukset.forEach(item => {
      const itemElement = document.createElement("li");
      itemElement.textContent = `${item.nimi} - ${item.hinta.muu.toFixed(2)} € x ${item.maara} = ${(item.hinta.muu * item.maara).toFixed(2)} €`;
      orderItemsElement.appendChild(itemElement);
      totalPrice += item.hinta.muu * item.maara;
    });

    totalPriceElement.textContent = `KOKONAISHINTA: ${totalPrice.toFixed(2)} €`;
  } else {
    orderItemsElement.innerHTML = "<p>Ei vahvistettuja tilauksia.</p>";
  }

  // Takaisin-painikkeen toiminnallisuus
  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

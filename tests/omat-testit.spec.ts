import { test, expect } from "@playwright/test";

// TESTI - onko HTML <title> Ravintola Louna
test("test", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/");

  await expect(page).toHaveTitle(/Ravintola Louna/);
});

// Kokeile toimiiko MA,TI,KE.. napit
test("Viikonpäivä napit", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/");
  await page.getByRole("button", { name: "KE" }).click();
  await page.getByRole("button", { name: "TI" }).click();
  await page.getByRole("button", { name: "MA" }).click();
  await page.getByRole("button", { name: "PE" }).click();
  await page.getByRole("button", { name: "TO" }).click();
});

// Lisää Keskiviikolta kalakeitto ostoskoriin ja avaa ostoskori
test("Ostoskoriin", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/");
  await page.getByRole("button", { name: "KE" }).click();
  await page
    .getByRole("row", { name: "Kalakeitto M, K 5€ +" })
    .getByRole("button")
    .click();
  await page.locator("#open-modal-btn").click();
  await expect(page.getByText("Sulje Ostoskori Kalakeitto -")).toHaveCount(1);
});

// Tarkista että ostoskorissa on 2 tuotetta, niiden lisäämisen jälkeen
test("2 tuotetta", async ({ page }) => {
  await page.goto("http://localhost:5500/");
  await page.getByRole("button", { name: "TI" }).click();
  await page
    .getByRole("row", { name: "Kasvislasagne VL 4€ +" })
    .getByRole("button")
    .click();
  await page
    .getByRole("row", { name: "Fish & Chips VL, M, SO 3€ +" })
    .getByRole("button")
    .click();
  await page.locator("#open-modal-btn").click();
  const ostoskori_lista = page.locator(".modal-content ul li");
  await expect(ostoskori_lista).toHaveCount(2);
});

// Sivuston navigaatio olemassa ja linkit toimii
test("nav", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/");

  // löytyykö nav
  const nav = page.locator("nav");
  await expect(nav).toBeVisible();

  // löytyykö ostoskorin nappi ja aukeaako klikatessa
  const ostoskoriBtn = page.locator("#open-modal-btn");
  await expect(ostoskoriBtn).toBeVisible();
  // ostoskorin sisältö näkyvillä
  await ostoskoriBtn.click();
  const ostoskorinSisältö = page.locator(".modal-content");
  await expect(ostoskorinSisältö).toBeVisible();
  await page.getByRole("button", { name: "Sulje" }).click();

  //löytyykö kirjautuminen ja aukeaako klikatessa
  const logInBtn = page.locator("#log-in");
  await expect(logInBtn).toBeVisible();
  await logInBtn.click();
  const kirjauduDialog = page.locator(".kirjaudu");
  await expect(kirjauduDialog).toBeVisible();
  await page.locator("#register").click();
});

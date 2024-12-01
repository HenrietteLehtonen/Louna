import { test, expect } from "@playwright/test";

// TESTI - onko HTML <title> Ravintola Louna
// test("test", async ({ page }) => {
//   await page.goto("http://127.0.0.1:5500/");

//   await expect(page).toHaveTitle(/Ravintola Louna/);
// });

// Kokeile toimiiko MA,TI,KE.. napit ja näyttääkö sen päivän menun
test("Viikonpäivä nappien testaus - näyttääkö päiväkohtausen menun", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5500/");
  await page.getByRole("button", { name: "KE" }).click();
  await expect(
    page
      .locator(".menu-container")
      .filter({ hasText: "Keskiviikko Kalakeitto M, K 5" })
  ).toBeVisible();
  await page.getByRole("button", { name: "TI" }).click();
  await expect(
    page
      .locator(".menu-container")
      .filter({ hasText: "Tiistai Fish & Chips VL, M," })
  ).toBeVisible();
  await page.getByRole("button", { name: "MA" }).click();
  await expect(
    page
      .locator(".menu-container")
      .filter({ hasText: "Maanantai Lihapullat ja muusi" })
  ).toBeVisible();
  await page.getByRole("button", { name: "PE" }).click();
  await expect(
    page
      .locator(".menu-container")
      .filter({ hasText: "Perjantai Pizza VL, G 6€" })
  ).toBeVisible();
  await page.getByRole("button", { name: "TO" }).click();
  await expect(
    page
      .locator(".menu-container")
      .filter({ hasText: "Torstai Hernekeitto ja pannukakku" })
  ).toBeVisible();
});

// Lisää Keskiviikolta kalakeitto ostoskoriin ja avaa ostoskori
test("Ostoskoriin lisäys", async ({ page }) => {
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
test("Ostoskorin sisältö = 2 tuotetta", async ({ page }) => {
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
test("Nav läpikäynti", async ({ page }) => {
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
  await expect(ostoskorinSisältö).not.toBeVisible();

  //löytyykö kirjautuminen ja aukeaako klikatessa
  const logInBtn = page.locator("#log-in");
  await expect(logInBtn).toBeVisible();
  await logInBtn.click();
  const kirjauduDialog = page.locator(".kirjaudu");
  await expect(kirjauduDialog).toBeVisible();
  await page.locator("#register").click();
  await page.locator("#go-back-to-login").click();
  await page
    .locator("div")
    .filter({ hasText: "KIRJAUDU Unohtuiko salasana?" })
    .getByRole("button")
    .first()
    .click();
  await expect(kirjauduDialog).not.toBeVisible();

  // burgermenu
  const burgermenu = page.locator("#burger-menu");
  const burgermenuContent = page.locator("#burger-menu-content");
  await expect(burgermenu).toBeVisible();
  await burgermenu.click();
  await expect(burgermenuContent).toBeVisible();
  await burgermenu.click();
});

// Visual comparison
test("Visual comparison", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/");

  await expect(page).toHaveScreenshot("etusivu-fp.png", { fullPage: true });
});

// Fullpage with mask
test("Visual comparison - fp masking", async ({ page }) => {
  await page.goto("http://127.0.0.1:5500/");

  await expect(page).toHaveScreenshot("etusivu-fp-mask.png", {
    fullPage: true,
    mask: [page.locator(".menu-container")],
  });
});

// Tarkista löytyykö kaikki inputit kirjautumis / rekisteröitymis formista
test("Etsi input elementit kirjaudu", async ({ page }) => {
  // Lataa sivu, jossa dialog on
  await page.goto("http://localhost:5500");
  const logInBtn = page.locator("#log-in");
  await expect(logInBtn).toBeVisible();
  await logInBtn.click();

  const dialog = page.locator(".dialog.kirjaudu");
  await expect(dialog).toBeVisible();

  const form = dialog.locator("form#loginForm");
  await expect(form).toBeVisible();

  const usernameInput = form.locator("input#username");
  await expect(usernameInput).toBeVisible();
  await expect(usernameInput).toHaveAttribute("type", "text");
  await expect(usernameInput).toHaveAttribute("required", "");

  const passwordInput = form.locator("input#salasana");
  await expect(passwordInput).toBeVisible();
  await expect(passwordInput).toHaveAttribute("type", "password");
  await expect(passwordInput).toHaveAttribute("required", "");

  const submitButton = form.locator("input#kirjaudu-btn");
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toHaveAttribute("type", "submit");
  await expect(submitButton).toHaveValue("Kirjaudu sisään");
});

// KIRJAUTUMINEN

test("Kirjaudu formista sisään", async ({ page }) => {
  // Mene testattavalle sivulle
  await page.goto("http://localhost:5500");
  const logInBtn = page.locator("#log-in");
  await expect(logInBtn).toBeVisible();
  await logInBtn.click();

  const dialog = page.locator(".dialog.kirjaudu");
  await expect(dialog).toBeVisible();

  const form = dialog.locator("form#loginForm");
  await expect(form).toBeVisible();

  // Täytä lomake
  await page.fill("input#username", "test_user");
  await page.fill("input#salasana", "testpassword");

  // Ota API-pyynnöt kiinni
  const [response] = await Promise.all([
    page.waitForResponse("http://localhost:3000/api/auth/login"),
    page.click("input#kirjaudu-btn"),
  ]);
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log(responseBody);
  expect(responseBody).toHaveProperty("username", "test_user");
  expect(responseBody).toHaveProperty("token");
  expect(responseBody).toHaveProperty("user_id");
});

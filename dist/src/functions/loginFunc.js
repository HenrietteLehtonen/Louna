import { fetchData } from "../utils/haeData.js";
import { apiUrl } from "../utils/variables.js";
const dialogOma = document.querySelector(".dialog-oma");
const login = async (passwordInput, usernameInput) => {
  if (!passwordInput || !usernameInput) {
    throw new Error("elementti ei saatavilla");
  }
  const username = passwordInput.value;
  const password = usernameInput.value;
  console.log(password, username);
  const data = {
    username,
    password,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const result = await fetchData(apiUrl + "/auth/login", options);
  //väliaikainen ratkaisu
  if (result.user_level_id == 1) {
    window.location.href = "http://127.0.0.1:5500//hallinta.html";
  }
  //asiakassivun avaaminen
  if (result.user_level_id == 2) {
    dialogOma.showModal();
    let nimi = document.querySelector(".nimi");
    nimi.innerText = username;
  }
  return result;
};
export { login };

console.log("Hello menu-hallinta.js");

// TESTAUSTA

let jsonData = [
  {
    name: "Saurabh",
    age: "20",
    city: "Prayagraj",
  },
  {
    name: "Vipin",
    age: 23,
    city: "Lucknow",
  },
  {
    name: "Saksham",
    age: 21,
    city: "Noida",
  },
];

// FUNKTIO JOLLA TEHDÄÄN TAULUKKO

const muutaTaulukoksi = () => {
  // haetaan kohde mihin taulukko halutaan:
  const kohde = document.querySelector("#kohde");

  // tehdään taulukko mihin data listään
  const table = document.createElement("table");

  // haetaan taulukon otsikolle keyt datasta
  const otsikot = Object.keys(jsonData[0]);

  // tehään theade otsikko rivi
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  // 1. OTSIKKO RIVI
  // haetaan otsikot ja lisätään niihin nimet
  otsikot.forEach((item) => {
    const th = document.createElement("th");
    th.innerText = item; // lisätään taulukon key th elementtiin
    tr.appendChild(th); // lisätään th elementti tr

    /*
  <table>
    <thead>
    <tr>
        <th>   
    </tr>
    </thead>
  <table>
    */
  });
  thead.appendChild(tr);
  /*
    <thead>
        <tr>
            <th></th>
        </tr>
    </thead>
*/
  table.appendChild(thead);
  /*
    <table>
        <thead>
            <tr>
                <th></th>
            </tr>
        </thead>
    </table>    */

  // 2. SISÄLTÖ RIVIT
  jsonData.forEach((item) => {
    // jokaiselle valuelle oma rivi
    const tr = document.createElement("tr");

    // haetaan valuet
    const vals = Object.values(item);

    // 3. luodaan data tr sisään
    vals.forEach((data) => {
      const td = document.createElement("td");
      td.innerText = data;
      tr.appendChild(td); // data tr sisään
    });
    table.appendChild(tr);
  });
  kohde.appendChild(table);
};

muutaTaulukoksi();

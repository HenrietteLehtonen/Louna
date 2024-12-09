type Annokset = {
  nimi: string;
  allergeenit: string;
  hinta: number;
  annos_id: number;
};

type Ruokalista = {
  day: string;
  annokset: Annokset[];
};

/// MOCDATA

type Menu = {
  day: string;
  id: number;
  annos: string;
  allergeenit: string[];
  hinta: number;
};

type Tilaukset = {
  tilaus_id: number;
  tila: string;
  // tilausnro: number;
  tilaus_aika: string;
  nouto_aika: string;
  nimet: string[];
  määrä: number[];
};

export type { Menu, Tilaukset, Ruokalista, Annokset };

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
  tilausnro: number;
  tilattu_aika: number;
  nouto_aika: string;
  tilauksen_tila: string;
};

export type { Menu, Tilaukset, Ruokalista, Annokset };

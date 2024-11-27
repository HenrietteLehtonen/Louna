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

export type { Menu, Tilaukset };

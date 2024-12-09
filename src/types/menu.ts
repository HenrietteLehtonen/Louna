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

type TilausPacket = {
  annos_id: number;
  määrä: number;
};

type OstoskoriItem = {
  nimi: string;
  hinta: {
    muu: number;
  };
  maara: number;
  annos_id: number;
};

export type {
  Menu,
  Tilaukset,
  Ruokalista,
  Annokset,
  OstoskoriItem,
  TilausPacket,
};

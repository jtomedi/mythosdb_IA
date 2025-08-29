export enum Era {
  Predinastico = "Periodo Predinástico",
  ReinoAntiguo = "Reino Antiguo",
  ReinoMedio = "Reino Medio",
  ReinoNuevo = "Reino Nuevo",
  PeriodoTardio = "Periodo Tardío",
  PeriodoPtolemaico = "Periodo Ptolemaico",
  MitologiaGeneral = "Mitología General"
}

export enum CharacterType {
  Dios = "Dios",
  Faraon = "Faraón",
  Primordial = "Primordial",
  Mortal = "Mortal",
  DeidadMenor = "Deidad Menor",
  Reina = "Reina",
  Visir = "Visir",
  Monstruo = "Monstruo",
  Concepto = "Concepto"
}

export interface Character {
  id: number;
  name: string;
  epithet: string; // Ej: "El Oculto" para Amón
  description: string;
  imageUrl: string;
  eras: Era[];
  type: CharacterType;
  family: {
    fatherId?: number;
    motherId?: number;
    spousesIds?: number[];
    childrenIds?: number[];
  };
}
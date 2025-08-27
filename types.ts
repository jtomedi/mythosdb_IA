
export enum Work {
  Iliad = "La Ilíada",
  Odyssey = "La Odisea",
  Theogony = "Teogonía",
  GreekMythology = "Mitología Griega General"
}

export enum CharacterType {
  Dios = "Dios",
  Titan = "Titán",
  Primordial = "Primordial",
  Heroe = "Héroe",
  Mortal = "Mortal",
  Semidios = "Semidiós",
  Ninfa = "Ninfa",
  Monstruo = "Monstruo"
}

export interface Character {
  id: number;
  name: string;
  greekName: string;
  romanName?: string;
  description: string;
  imageUrl: string;
  works: Work[];
  type: CharacterType;
  family: {
    fatherId?: number;
    motherId?: number;
    spousesIds?: number[];
    childrenIds?: number[];
  };
}
type EnergyClass = 'A' | 'B' | 'C';

type Capacity = 8 | 9 | 10.5;

type Features =
  | 'Drzwi AddWash™'
  | 'Panel AI Control'
  | 'Silnik inwerterowy'
  | 'Wyświetlacz elektroniczny';

export interface IProduct {
  image: string;
  code: string;
  name: string;
  color: string;
  capacity: Capacity;
  dimensions: string;
  features: Features[];
  energyClass: EnergyClass;
  price: {
    value: number;
    currency: string;
    installment: {
      value: number;
      period: number;
    };
    validFrom: Date;
    validTo: Date;
  };
}

type Sort = 'price' | 'capacity';

export interface IProductListOptions {
  capacity: Capacity;
  energyClass: EnergyClass;
  feature: Features;
  sort: Sort;
  query: string;
  page: number;
}

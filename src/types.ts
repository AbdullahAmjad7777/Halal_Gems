export type HalalStatus = 'Fully Halal' | 'Halal Options' | 'Unknown';

export type Restaurant = {
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  halal_status: HalalStatus | string;
  phone?: string;
  website?: string;
  hours?: string;
};


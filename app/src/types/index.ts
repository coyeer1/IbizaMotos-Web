export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  description: string;
  specifications: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    weight: string;
    fuelCapacity: string;
    colors: string[];
  };
  images: string[];
  imagesByColor?: Record<string, string[]>;
  videoUrl?: string;
  featured: boolean;
  stock?: 'available' | 'limited' | 'order';
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

export interface SparePart {
  id: string;
  name: string;
  category: string;
  price: number;
  compatibility: string[];
  image: string;
  stock: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  price?: string;
}

export interface Appointment {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  motorcycle?: string;
  message?: string;
}

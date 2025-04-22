import {
  GlobalStatus,
  Image,
  ParkingLot,
  ParkingLotAvailability,
  ParkingLotHistory,
  ParkingLotStatus,
  PaymentMethod,
  Service,
} from '../models';

export interface ParkingLotDto {
  id?: string;
  code?: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status?: ParkingLotStatus;
  availability?: ParkingLotAvailability;
  globalStatus?: GlobalStatus;
  ownerId?: string | null;
  nodeIds?: string[];
  price?: number;
  phoneNumber?: string;
  images?: Image[];
  paymentMethods?: PaymentMethod[];
  services?: Service[];
  description?: string;
  priceCarPerHour?: number;
  priceMotorcyclePerHour?: number;
  priceMotorcyclePerDay?: number;
  priceCarPerDay?: number;
  comfort?: number;
  acceptedVehicleTypes?: string[];
}

export interface ParkingLotHistories {
  [idParkingLot: string]: { records: ParkingLotHistory[] };
}

export const sanitizeParkingLotData = (values: ParkingLot): ParkingLotDto => {
  return {
    code: values.code,
    name: values.name,
    address: values.address,
    latitude: values.latitude,
    longitude: values.longitude,
    status: values.status,
    availability: values.availability,
    globalStatus: values.globalStatus,
    ownerId: values.ownerId || null,
    nodeIds: values.nodeIds,
    price: values.price,
    description: values.description,
    priceCarPerHour: values.priceCarPerHour,
    priceMotorcyclePerHour: values.priceMotorcyclePerHour,
    priceMotorcyclePerDay: values.priceMotorcyclePerDay,
    priceCarPerDay: values.priceCarPerDay,
    comfort: values.comfort,
    acceptedVehicleTypes: values.acceptedVehicleTypes,
    phoneNumber: values.phoneNumber,
    images: values.images,
    paymentMethods: values.paymentMethods,
    services: values.services,
  };
};

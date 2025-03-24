import {
  GlobalStatus,
  Image,
  ParkingLot,
  ParkingLotAvailability,
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
  ownerId?: string;
  nodeIds?: string[];
  price?: number;
  phoneNumber?: string;
  images?: Image[];
  paymentMethods?: PaymentMethod[];
  services?: Service[];
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
    ownerId: values.ownerId,
    nodeIds: values.nodeIds,
    price: values.price,
    phoneNumber: values.phoneNumber,
    images: values.images,
    paymentMethods: values.paymentMethods,
    services: values.services,
  };
};

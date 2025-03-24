export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  USER = 'USER',
}

export enum GlobalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  status?: string;
  globalStatus?: GlobalStatus;
  createdAt: string;
  updatedAt: string;
  personId?: string | null;
  person?: Person | null;
}

export interface Person {
  id?: string;
  names?: string;
  lastNames?: string;
  email?: string;
  phone?: string;
  cretedAt?: string;
  updatedAt?: string;
  globalStatus?: GlobalStatus;
}

export enum NodeVersion {
  BETA = 'BETA',
  V1 = 'V1',
  V2 = 'V2',
}
export interface Node {
  id?: string;
  code?: string;
  version?: NodeVersion;
  globalStatus?: GlobalStatus;
  cretedAt?: string;
  updatedAt?: string;
}

export enum ParkingLotStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum ParkingLotAvailability {
  MORE_THAN_FIVE = 'MORE_THAN_FIVE',
  LESS_THAN_FIVE = 'LESS_THAN_FIVE',
  NO_AVAILABILITY = 'NO_AVAILABILITY',
}

export interface Image {
  key: string;
  url: string;
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CARD = 'CARD',
}

export enum Service {
  SECURITY = 'SECURITY',
  CAR_WASH = 'CAR_WASH',
  VALET_PARKING = 'VALET_PARKING',
}

export interface ParkingLot {
  id: string;
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: ParkingLotStatus;
  availability: ParkingLotAvailability;
  globalStatus?: GlobalStatus;
  price: number;
  phoneNumber: string;
  images?: Image[];
  paymentMethods?: PaymentMethod[];
  services?: Service[];
  createdAt?: string;
  updatedAt?: string;

  // Relaciones
  ownerId?: string;
  owner?: User;
  nodeIds?: string[];
  nodes?: Node[];
}

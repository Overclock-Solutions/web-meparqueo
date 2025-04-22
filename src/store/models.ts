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
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYMENT_APP = 'PAYMENT_APP',
  MEMBERSHIP = 'MEMBERSHIP',
  PSE = 'PSE',
  BALOTO = 'BALOTO',
  EFECTY = 'EFECTY',
  CREDICOP = 'CREDICOP',
  CREDIAGRO = 'CREDIAGRO',
  CONSIGNMENT = 'CONSIGNMENT',
  PAY_ONLINE = 'PAY_ONLINE',
  PAYPAL = 'PAYPAL',
  BANCOLOMBIA_APP = 'BANCOLOMBIA_APP',
  DAVIVIENDA_APP = 'DAVIVIENDA_APP',
  GIFT_CARD = 'GIFT_CARD',
  LOYALTY_POINTS = 'LOYALTY_POINTS',
  CREDIT_NOTE = 'CREDIT_NOTE',
  POSTDATED_CHECK = 'POSTDATED_CHECK',
  PAYROLL_DEDUCTION = 'PAYROLL_DEDUCTION',
  CREDIT = 'CREDIT',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  PAY_LATER = 'PAY_LATER',
}

export enum Service {
  SECURITY = 'SECURITY',
  CAR_WASH = 'CAR_WASH',
  COVERED = 'COVERED',
  TWENTY_FOUR_HOURS = 'TWENTY_FOUR_HOURS',
  VALET = 'VALET',
  EVC_CHARGER = 'EVC_CHARGER',
  MOTORCYCLE_AREA = 'MOTORCYCLE_AREA',
  TRAILER_PARKING = 'TRAILER_PARKING',
  UNDERGROUND = 'UNDERGROUND',
  DISABLED_ACCESS = 'DISABLED_ACCESS',
  TIRE_INFLATION = 'TIRE_INFLATION',
  VIDEO_SURVEILLANCE = 'VIDEO_SURVEILLANCE',
  OIL_CHECK = 'OIL_CHECK',
  BATTERY_CHARGE = 'BATTERY_CHARGE',
  VEHICLE_INSPECTION = 'VEHICLE_INSPECTION',
  DETAILING = 'DETAILING',
  LOCKER_SERVICE = 'LOCKER_SERVICE',
  RESTROOM = 'RESTROOM',
  WI_FI = 'WI_FI',
  CAFETERIA = 'CAFETERIA',
  TOW_SERVICE = 'TOW_SERVICE',
  INSURANCE = 'INSURANCE',
  CHILD_AREA = 'CHILD_AREA',
  PET_AREA = 'PET_AREA',
  BIKE_PARKING = 'BIKE_PARKING',
  TIRE_CHANGE = 'TIRE_CHANGE',
  VEHICLE_TUNING = 'VEHICLE_TUNING',
  ADVANCE_RESERVATION = 'ADVANCE_RESERVATION',
  MONTHLY_PLAN = 'MONTHLY_PLAN',
  PHONE_CHARGING = 'PHONE_CHARGING',
}

export interface ParkingLot {
  id: string;
  code: string;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  status: ParkingLotStatus;
  availability: ParkingLotAvailability;
  globalStatus?: GlobalStatus;
  price: number;
  priceCarPerHour: number;
  priceMotorcyclePerHour: number;
  priceMotorcyclePerDay: number;
  priceCarPerDay: number;
  comfort: number;
  acceptedVehicleTypes: string[];
  phoneNumber: string;
  images?: Image[];
  paymentMethods?: PaymentMethod[];
  services?: Service[];
  createdAt?: string;
  updatedAt?: string;

  // Relaciones
  ownerId?: string | null;
  owner?: User | null;
  nodeIds?: string[];
  nodes?: Node[];
}

export interface ParkingLotHistory {
  id: string;
  parkingLotId: string;
  status: ParkingLotStatus;
  availability: ParkingLotAvailability;
  updatedAt: string;
}

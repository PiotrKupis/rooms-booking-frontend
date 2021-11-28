import {PhotoPayload} from "./photoPayload";

export interface DetailedRoomPayload {
  resortName: string;
  country: string;
  city: string;
  street: string;
  streetNumber: string;
  roomNumber: number;
  price: string;
  priceCurrency: string;
  roomAmenities: Array<string>;
  singleBedQuantity: number;
  doubleBedQuantity: number;
  kingSizeBedQuantity: number;
  maxResidentsNumber: number;
  photos: Array<PhotoPayload>
}

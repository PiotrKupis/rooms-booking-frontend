export interface AddRoomRequest {
  resortName: string;
  roomNumber: number;
  price: string;
  priceCurrency: string;
  roomAmenities: Array<string>;
  singleBedQuantity: number;
  doubleBedQuantity: number;
  kingSizeBedQuantity: number;
  maxResidentsNumber: number;
}

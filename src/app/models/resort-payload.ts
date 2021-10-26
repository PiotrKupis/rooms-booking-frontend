export interface ResortPayload {
  resortName: string;
  country: string;
  city: string;
  street: string,
  streetNumber: string;
  resortAmenities: Array<string>;
  smokingPermitted: boolean;
  animalsPermitted: boolean;
  partyPermitted: boolean;
  hotelDayStart: string;
  hotelDayEnd: string;
  isParkingAvailable: boolean;
  parkingFee: string;
  parkingFeeCurrency: string;
}

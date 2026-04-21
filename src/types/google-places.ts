// types/google-places.ts

export interface MatchedSubstring {
  length: number;
  offset: number;
}

export interface Term {
  offset: number;
  value: string;
}

export interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: MatchedSubstring[];
  secondary_text: string;
}

export interface Prediction {
  description: string;
  matched_substrings: MatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: StructuredFormatting;
  terms: Term[];
  types: string[];
}

export interface GooglePlacesAutocompleteResponse {
  predictions: Prediction[];
  status: string;
  error_message?: string;
}

export interface AddressSuggestion {
  id: string;
  address: string;
  placeId: string;
  reference: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  terms: Term[];
  matchedSubstrings: MatchedSubstring[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface PlaceResult {
  formatted_address: string;
  geometry: Geometry;
  address_components: AddressComponent[];
  name?: string;
  place_id: string;
}

export interface GooglePlaceDetailsResponse {
  result: PlaceResult;
  status: string;
  error_message?: string;
}

export interface ProcessedAddressComponent {
  long_name: string;
  short_name: string;
}

export interface ProcessedAddressComponents {
  [key: string]: ProcessedAddressComponent;
}

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  name?: string;
  geometry: Geometry;
  addressComponents: ProcessedAddressComponents;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

export interface SelectedAddress extends AddressSuggestion {
  details?: PlaceDetails;
}

export interface AutocompleteApiResponse {
  suggestions: AddressSuggestion[];
}

export interface PlaceDetailsApiResponse {
  details: PlaceDetails;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
}

export interface GoogleAddressAutocompleteProps {
  onAddressSelect?: (address: SelectedAddress | null) => void;
  selectedAddress?: SelectedAddress | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  onDropdownStateChange?: (isOpen: boolean) => void;
}
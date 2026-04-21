import { NextRequest, NextResponse } from "next/server";
import type { 
  GooglePlaceDetailsResponse, 
  AddressComponent,
  ProcessedAddressComponents,
  PlaceDetails 
} from '@/types/google-places';

export async function GET(request: NextRequest, { params }: { params: { placeId: string } }) {
  try {
    const { placeId } = params;
    
    if (!placeId) {
      return NextResponse.json({ error: "placeId is required" }, { status: 400 });
    }

    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json({ message: 'Google Places API key not configured' }, { status: 500 });
    }

    const results = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}&fields=formatted_address,geometry,address_components,name`
    );
    
    const data: GooglePlaceDetailsResponse = await results.json();

    if (!results.ok) {
      throw new Error(data.error_message || 'Failed to fetch place details');
    }

    // Transform address components into a more usable format
    const addressComponents: ProcessedAddressComponents = {};
    if (data.result.address_components) {
      data.result.address_components.forEach((component: AddressComponent) => {
        component.types.forEach((type: string) => {
          addressComponents[type] = {
            long_name: component.long_name,
            short_name: component.short_name
          };
        });
      });
    }

    const details: PlaceDetails = {
      placeId: placeId,
      formattedAddress: data.result.formatted_address,
      name: data.result.name,
      geometry: data.result.geometry,
      addressComponents: addressComponents,
      // Extract common address parts
      streetNumber: addressComponents.street_number?.long_name || '',
      streetName: addressComponents.route?.long_name || '',
      city: addressComponents.locality?.long_name || 
            addressComponents.sublocality?.long_name || '',
      state: addressComponents.administrative_area_level_1?.long_name || '',
      stateCode: addressComponents.administrative_area_level_1?.short_name || '',
      postalCode: addressComponents.postal_code?.long_name || '',
      country: addressComponents.country?.long_name || '',
      countryCode: addressComponents.country?.short_name || ''
    };

    return NextResponse.json({ details }, { status: 200 });  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Place Details API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
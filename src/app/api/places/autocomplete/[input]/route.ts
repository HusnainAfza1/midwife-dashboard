import { NextRequest ,NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { input: string } }) {
  try {
   const { input } = params;

  if (!input) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 });
  }   

  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;  
   if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ message: 'Google Places API key not configured' }, { status: 500 });
  }

  // Simulate a database call
  const results = await fetch(
    // `https://api.example.com/autocomplete?input=${input}`  
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.GOOGLE_PLACES_API_KEY}&types=address&language=de&components=country:DE`
  );
  const data = await results.json();  
   if (!results.ok) {
      throw new Error(data.error_message || 'Failed to fetch places');
      
    }   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const suggestions = data.predictions.map((prediction: any) => ({
      id: prediction.place_id,
      address: prediction.description,
      placeId: prediction.place_id,
      reference: prediction.reference,
      mainText: prediction.structured_formatting?.main_text || prediction.description,
      secondaryText: prediction.structured_formatting?.secondary_text || '',
      types: prediction.types,
      terms: prediction.terms,
      matchedSubstrings: prediction.matched_substrings
    }));

  return NextResponse.json(suggestions, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
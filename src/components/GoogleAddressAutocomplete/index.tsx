import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, AlertCircle } from 'lucide-react';
import type { 
  AddressSuggestion, 
  SelectedAddress, 
  PlaceDetails,
  ApiErrorResponse,
  GoogleAddressAutocompleteProps 
} from '@/types/google-places';

const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({ 
  onAddressSelect,
  selectedAddress,
  placeholder = "Start typing an address...",
  className = "",
  disabled = false,
  required = false,
  onDropdownStateChange
}) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState<boolean>(false); 
  
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // If not enough space below (less than 200px), open upward
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedAddress?.address && !isSelecting) {
      setQuery(selectedAddress.address);
      setIsOpen(false);
      setSuggestions([]);
    } else if (!selectedAddress) {
      setQuery('');
    }
  }, [selectedAddress, isSelecting]);

  // Notify parent when dropdown state changes (optional)
  useEffect(() => {
    onDropdownStateChange?.(isOpen);
  }, [isOpen, onDropdownStateChange]);

  const fetchSuggestions = async (input: string): Promise<AddressSuggestion[]> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setError('');
      const response = await fetch(
        `/api/places/autocomplete/${encodeURIComponent(input)}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to fetch suggestions');
      }

      const data = await response.json();
      return data.suggestions || data || [];
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') return [];
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  };

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      const response = await fetch(`/api/places/details/${encodeURIComponent(placeId)}`);
      if (!response.ok) throw new Error('Failed to fetch place details');
      const data = await response.json();
      return data.details || data;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  useEffect(() => {
    if (query.length < 2 || isSelecting) {
      setSuggestions([]);
      setIsOpen(false);
      setError('');
      return;
    }

    if (selectedAddress && query === selectedAddress.address) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchSuggestions(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch suggestions';
        setError(errorMessage);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, isSelecting, selectedAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setError('');
    setIsSelecting(false); 
    
    
    if (selectedAddress && value !== selectedAddress.address) {
      onAddressSelect?.(null);
    }
  };

  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {

    setIsSelecting(true);
    
    setQuery(suggestion.address);
    setIsOpen(false);
    setSuggestions([]);

    // 2) Notify parent with basic selection
    const basicSelection: SelectedAddress = {
      id: suggestion.id,
      address: suggestion.address,
      placeId: suggestion.placeId,
      reference: suggestion.reference,
      mainText: suggestion.mainText,
      secondaryText: suggestion.secondaryText,
      types: suggestion.types,
      terms: suggestion.terms || [],
      matchedSubstrings: suggestion.matchedSubstrings || []
    };

    onAddressSelect?.(basicSelection);

    // 3) Fetch details and update parent
    if (suggestion.placeId) {
      try {
        const details = await getPlaceDetails(suggestion.placeId);
        if (details) {
          onAddressSelect?.({ ...basicSelection, details });
        }
      } catch (error) {
        console.error('Failed to fetch place details:', error);
      }
    }

    setTimeout(() => {
      setIsSelecting(false);
    }, 500);
  };

  const handleClearSelection = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setError('');
    setIsSelecting(false);
    inputRef.current?.focus();
    onAddressSelect?.(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      suggestionRefs.current[0]?.focus();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>, 
    index: number, 
    suggestion: AddressSuggestion
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % suggestions.length;
      suggestionRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index === 0 ? suggestions.length - 1 : index - 1;
      suggestionRefs.current[prevIndex]?.focus();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to filter out unwanted types for display
  const getDisplayTypes = (types: string[]) => {
    if (!types) return [];
    return types.filter(type => 
      type !== 'geocode' && 
      type !== 'route'
    );
  };

  const inputClasses = `
    w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 
    focus:border-transparent outline-none transition-all
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${selectedAddress ? 'border-green-300 bg-green-50' : ''}
    ${className}
  `.trim();

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClasses}
          autoComplete="off"
          disabled={disabled}
          required={required}
        />
        
        {selectedAddress && !disabled && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-3 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}

      {isOpen && suggestions.length > 0 && !disabled && (
        <div className={`absolute z-[9999] w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto ${
          dropdownPosition === 'top' ? 'bottom-full mb-1' : 'mt-1'
        }`}>
          {suggestions.map((suggestion, index) => {
            const displayTypes = getDisplayTypes(suggestion.types || []);
            
            return (
              <div
                key={suggestion.id}
                ref={el => { suggestionRefs.current[index] = el; }}
                tabIndex={0}
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyDown={(e) => handleSuggestionKeyDown(e, index, suggestion)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.mainText || suggestion.address}
                    </div>
                    {suggestion.secondaryText && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {suggestion.secondaryText}
                      </div>
                    )}
                    {displayTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {displayTypes.slice(0, 2).map((type, idx) => (
                          <span 
                            key={idx}
                            className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {type.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isOpen && suggestions.length === 0 && query.length >= 2 && !loading && !error && !disabled && (
        <div className={`absolute z-[9999] w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 ${
          dropdownPosition === 'top' ? 'bottom-full mb-1' : 'mt-1'
        }`}>
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No addresses found for &quot;{query}&quot;
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAddressAutocomplete;
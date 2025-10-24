"use client";
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';
import { cn } from '@/lib/utils';

let DefaultIcon = L.divIcon({
  html: `
    <div style="background-color: #3B82F6; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); position: relative;">
      <div style="position: absolute; width: 8px; height: 8px; background: white; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);"></div>
    </div>
  `,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Function to geocode coordinates to address
async function geocodeCoordinates(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name;
    } else {
      return 'Address not found';
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching address';
  }
}

// Component to handle map clicks
function LocationMarker({ 
  position, 
  onLocationSelect 
}: { 
  position: [number, number] | null;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
  const map = useMap();
  
  // Add click event listener to the map
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      const address = await geocodeCoordinates(lat, lng);
      onLocationSelect(lat, lng, address);
    },
  });

  // Update map view when position changes
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

// Function to convert decimal to DMS
function toDMS(coordinate: number, isLatitude: boolean): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

  const direction = isLatitude 
    ? (coordinate >= 0 ? "N" : "S")
    : (coordinate >= 0 ? "E" : "W");

  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

// Function to convert DMS to decimal
function fromDMS(dms: string): number | null {
  // Match patterns like: 33°25'09.0"N or 43°19'27.3"E
  const match = dms.match(/(\d+)°(\d+)'([\d.]+)"([NSEW])/i);
  if (!match) return null;

  const degrees = parseFloat(match[1]);
  const minutes = parseFloat(match[2]);
  const seconds = parseFloat(match[3]);
  const direction = match[4].toUpperCase();

  let decimal = degrees + minutes / 60 + seconds / 3600;

  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }

  return decimal;
}

interface MapLocationPickerProps {
  onLocationUpdate: (coordinates: [number, number] | null, address: string) => void;
  initialCoordinates?: [number, number] | null;
}

export function MapLocationPicker({ onLocationUpdate, initialCoordinates = [33.3152, 44.3661] }: MapLocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(initialCoordinates);
  const [address, setAddress] = useState('');
  const [latInput, setLatInput] = useState('33.3152');
  const [lngInput, setLngInput] = useState('44.3661');
  const [inputMode, setInputMode] = useState<'decimal' | 'dms'>('decimal');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Convert coordinates when input mode changes
  useEffect(() => {
    if (selectedLocation) {
      if (inputMode === 'dms') {
        setLatInput(toDMS(selectedLocation[0], true));
        setLngInput(toDMS(selectedLocation[1], false));
      } else {
        setLatInput(selectedLocation[0].toString());
        setLngInput(selectedLocation[1].toString());
      }
    }
  }, [inputMode, selectedLocation]);

  // Geocode initial address only on mount
  useEffect(() => {
    if (selectedLocation) {
      handleGeocodeAddress(selectedLocation[0], selectedLocation[1]);
    }
  }, []); // Empty dependency array - only run on mount

  const handleGeocodeAddress = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const newAddress = await geocodeCoordinates(lat, lng);
      setAddress(newAddress);
      return newAddress;
    } catch (error) {
      console.error('Error geocoding address:', error);
      setAddress('Error fetching address');
      return 'Error fetching address';
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleLocationSelect = async (lat: number, lng: number, newAddress: string) => {
    setSelectedLocation([lat, lng]);
    setAddress(newAddress);
    onLocationUpdate([lat, lng], newAddress); // Direct call
    setShowResult(true);
    
    if (inputMode === 'decimal') {
      setLatInput(lat.toString());
      setLngInput(lng.toString());
    } else {
      setLatInput(toDMS(lat, true));
      setLngInput(toDMS(lng, false));
    }
  };

  const handleManualCoordinateUpdate = async () => {
    let lat: number | null, lng: number | null;

    if (inputMode === 'decimal') {
      lat = parseFloat(latInput);
      lng = parseFloat(lngInput);
    } else {
      lat = fromDMS(latInput);
      lng = fromDMS(lngInput);
    }

    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setSelectedLocation([lat, lng]);
        setIsLoadingAddress(true);
        try {
          const newAddress = await handleGeocodeAddress(lat, lng);
          onLocationUpdate([lat, lng], newAddress); // Direct call
          setShowResult(true);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoadingAddress(false);
        }
      } else {
        alert('Invalid coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.');
      }
    } else {
      alert('Invalid coordinate format. Please check your input.');
    }
  };

  const handleInputChange = (value: string, type: 'lat' | 'lng') => {
    if (type === 'lat') {
      setLatInput(value);
    } else {
      setLngInput(value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Click on the map to set your clinic's location, or enter coordinates manually
        </label>
        
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <MapContainer
            center={selectedLocation || [33.3152, 44.3661]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker 
              position={selectedLocation} 
              onLocationSelect={handleLocationSelect} 
            />
          </MapContainer>
        </div>
      </div>

      {/* Coordinate Input Mode Selector */}
        <h1 className='text-md font-bold text-gray-700 dark:text-gray-300'>Or type your Coordinate manually</h1>
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input Format:</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setInputMode('decimal')}
            className={`px-3 py-1 text-sm rounded ${
              inputMode === 'decimal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Decimal (43.192730)
          </button>
          <button
            type="button"
            onClick={() => setInputMode('dms')}
            className={`px-3 py-1 text-sm rounded ${
              inputMode === 'dms' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            DMS (43°19'27.3"E)
          </button>
        </div>
      </div>

      {/* Manual Coordinate Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center ">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400  mb-2">
            Latitude {inputMode === 'dms' && '(DMS)'}
          </label>
          <input
            type="text"
            value={latInput}
            onChange={(e) => handleInputChange(e.target.value, 'lat')}
            placeholder={inputMode === 'decimal' ? "33.3152" : "33°25'09.0\"N"}
            className="w-full p-3 border border-gray-300 dark:border-dark-500 dark:bg-dark-400 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {inputMode === 'decimal' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 33.3152</p>
          )}
          {inputMode === 'dms' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 33°25'09.0"N</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            Longitude {inputMode === 'dms' && '(DMS)'}
          </label>
          <input
            type="text"
            value={lngInput}
            onChange={(e) => handleInputChange(e.target.value, 'lng')}
            placeholder={inputMode === 'decimal' ? "44.3661" : "44°19'27.3\"E"}
            className="w-full p-3 border border-gray-300 dark:border-dark-500 dark:bg-dark-400 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {inputMode === 'decimal' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 44.3661</p>
          )}
          {inputMode === 'dms' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 44°19'27.3"E</p>
          )}
        </div>

        <div className='pt-2'>
          <button
            type="button"
            onClick={handleManualCoordinateUpdate}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Map
          </button>
        </div>
      </div>

      {/* Coordinate Display */}
      <div className={cn(`grid-cols-1 md:grid-cols-2  gap-4`, showResult ? "grid" : "hidden")}>
        <div>
          <label className="block text-sm font-medium   mb-2">
            Current Coordinates
          </label>
          <div className="px-3 py-5 bg-gray-50 rounded-lg text-sm space-y-1 border border-gray-300 dark:border-dark-500 dark:bg-dark-400">
            <div><strong>Decimal:</strong> {selectedLocation?.[0].toFixed(6)}, {selectedLocation?.[1].toFixed(6)}</div>
            <div><strong>DMS:</strong> {selectedLocation ? toDMS(selectedLocation[0], true) : 'N/A'}, {selectedLocation ? toDMS(selectedLocation[1], false) : 'N/A'}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium 00 mb-2">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address will appear here after selecting location"
            rows={3}
            className="w-full p-3  border border-gray-300 dark:border-dark-500 dark:bg-dark-400 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          />
        </div>
      </div>
    </div>
  );
}
//npm install leaflet react-leaflet --legacy-peer-deps
// npm install -D @types/leaflet --legacy-peer-deps
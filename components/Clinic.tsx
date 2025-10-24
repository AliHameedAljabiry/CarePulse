'use client'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Clock, Phone, MapPin, Star, Users, Shield, Image as ImageIcon, Share2, Navigation } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import ImagekitDisplyer from './ImagekitDisplyer'
import Link from 'next/link'
import SpecialtyForm from './forms/SpecialtyForm'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { useRouter } from 'next/navigation'

// Fix for default markers
let DefaultIcon = L.divIcon({
  html: `
    <div style="background-color: #3B82F6; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); position: relative; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
      <div style="position: absolute; width: 12px; height: 12px; background: white; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Function to parse JSON fields safely
function parseJSONField<T>(field: string | null): T | null {
  if (!field) return null;
  try {
    return JSON.parse(field) as T;
  } catch {
    return null;
  }
}

// Function to convert 24-hour format to 12-hour format
function to12HourFormat(time24: string): string {
  if (!time24) return '';
  
  try {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return time24; // Return original if conversion fails
  }
}

// Function to format business hours with 12-hour display
function formatBusinessHours(hours: any) {
  if (!hours) return null;
  
  const days = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  return Object.entries(days).map(([key, dayName]) => {
    const day = hours[key];
    if (!day) return null;
    
    if (day.closed) {
      return { day: dayName, hours: 'Closed' };
    } else {
      // Convert both open and close times to 12-hour format
      const open12 = to12HourFormat(day.open);
      const close12 = to12HourFormat(day.close);
      return { day: dayName, hours: `${open12} - ${close12}` };
    }
  }).filter(Boolean);
}

  

// Function to get coordinates from location string (handles JSON format)
function getCoordinates(location: any): [number, number] | null {
  if (!location) return null;
  
  try {
    // If location is a string, try to parse it as JSON
    if (typeof location === 'string') {
      const locationData = JSON.parse(location);
      if (locationData.coordinates && Array.isArray(locationData.coordinates)) {
        return locationData.coordinates as [number, number];
      }
    }
    
    // If location is already an object with coordinates
    if (typeof location === 'object' && location.coordinates && Array.isArray(location.coordinates)) {
      return location.coordinates as [number, number];
    }
    
    // Fallback: try to parse as comma-separated string (your original approach)
    if (typeof location === 'string' && location.includes(',')) {
      const coords = location.split(',').map(coord => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return [coords[0], coords[1]];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing location:', error);
    return null;
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

const cardVariants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0,
    rotateX: -15
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

const Clinic = ({ clinicData }: any) =>  {
  const [openForm, setOpenForm] = useState(false);
  const [selectedClinictId, setSelectedClinicId] = useState('');
  const [formType, setFormType] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')
  const router = useRouter()
  useEffect(() => {
    setMounted(true)
    const actualTheme = theme === 'system' ? systemTheme : theme
    setCurrentTheme(actualTheme || 'light')
  }, [theme, systemTheme])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (clinicData === null || clinicData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Clinic Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The clinic you're looking for doesn't exist.</p>
        </motion.div>
      </div>
    )
  }

  console.log("clinicData", clinicData)
  const businessHours = formatBusinessHours(clinicData.businessHours)
  const coordinates = getCoordinates((clinicData as any)?.location)

  

  const handleSpecialty = (formTitle: string, formType: string, clinicId: string, ...specialty: any) => {
        setSelectedClinicId(clinicId);
        setSelectedSpecialty(specialty);
        setOpenForm(true);
        setFormType(formType);
        setFormTitle(formTitle)
    }
   
    // Function to handle successful form submission
    const handleFormSuccess = () => {
        setOpenForm(false); 
        router.refresh()
    }

  const handleShareLocation = () => {
    if (coordinates) {
      if (navigator.share) {
        navigator.share({
          title: clinicData.clinicName,
          text: `Visit ${clinicData.clinicName} at ${clinicData.address}`,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(`${clinicData.clinicName}\n${clinicData.address}\n\nLocation: https://www.google.com/maps?q=${coordinates[0]},${coordinates[1]}`)
        alert('Location copied to clipboard!')
      }
    }
  }

  const handleGetDirections = () => {
    if (coordinates) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates[0]},${coordinates[1]}`, '_blank')
    }
  }

  const handleCallClinic = () => {
    window.location.href = `tel:${clinicData.phoneNumber}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className='w-16 h-16'>
                {clinicData.clinicProfile && (
                  <ImagekitDisplyer documentUrl={clinicData.clinicProfile as any} text={"No clinic Profile image Uploaded"}/>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{clinicData.clinicName}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-gray-500 dark:text-gray-400">(128 reviews)</span>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      clinicData.status === 'OPEN' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : clinicData.status === 'CLOSED'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : clinicData.status === 'MAINTENANCE'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    {clinicData.status.charAt(0) + clinicData.status.slice(1).toLowerCase()}
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg"
            >
              Book Appointment
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Clinic Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <motion.div variants={cardVariants as any} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants as any} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{clinicData.phoneNumber}</p>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants as any} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <MapPin className="w-5 h-5 min-w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">{clinicData.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{clinicData.city}, {clinicData.country}</p>
                  </div>
                </motion.div>
                {clinicData.ownerName && (
                  <motion.div variants={itemVariants as any} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                      <p className="font-medium text-gray-900 dark:text-white">{clinicData.ownerName}</p>
                    </div>
                  </motion.div>
                )}
                {clinicData.managerName && (
                  <motion.div variants={itemVariants as any} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manager</p>
                      <p className="font-medium text-gray-900 dark:text-white">{clinicData.managerName}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Business Hours */}
            {businessHours && (
              <motion.div variants={cardVariants as any} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Business Hours</span>
                </h2>
                <div className="space-y-3">
                  {businessHours.map((day: any, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-300">{day.day}</span>
                      <span className={`font-medium ${
                        day.hours === 'Closed' 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {day.hours}
                      </span>
                    </motion.div>
                  ))}
                </div>
                {/* Optional: Show note about time format */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  All times shown in 12-hour format
                </p>
              </motion.div>
            )}

            {/* Specialties */}
              <motion.div variants={cardVariants as any} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
                <div className='flex items-center justify-between'>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Specialties</h2>
                    <motion.button 
                        onClick={() => handleSpecialty("Add Specialty", "create", clinicData?.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className=" bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium shadow-md"
                    >
                        Add Specialties
                    </motion.button>
                </div>
                <Dialog open={openForm} onOpenChange={setOpenForm}>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-inherit">
                    <DialogTitle className='dark:text-white text-center'>
                        {formTitle}
                    </DialogTitle>
                      <SpecialtyForm
                          type={formType}
                          specialty={selectedSpecialty}
                          clinicId={selectedClinictId}
                          onSuccess={handleFormSuccess} 
                      />
                  </DialogContent>
                </Dialog>

                {clinicData?.specialties  ? (
                  <div className="flex flex-wrap gap-2">
                  {clinicData?.specialties.map((specialty: any, index: number) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="flex gap-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                      >
                        {specialty.specialty}
                      <motion.button 
                          title='Edit'
                          onClick={() => handleSpecialty("Update Specialty", "update", clinicData?.id, specialty)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="  text-white  rounded-lg transition-colors font-medium shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </motion.button>
                      </motion.span>
                  ))}
                </div>
                ) : (
                  <div className='flex items-center justify-between gap-6'>
                      <h1>No Specialties added yet!</h1>
                  </div>
                  )}
                
              </motion.div>
         

            {/* Insurance Accepted */}
            {/* {insuranceAccepted && insuranceAccepted.length > 0 && (
              <motion.div variants={cardVariants} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Insurance Accepted</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {insuranceAccepted.map((insurance, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                    >
                      {insurance}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )} */}

            {/* Gallery */}
            {/* {gallery && gallery.length > 0 && (
              <motion.div variants={cardVariants} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Clinic Gallery</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((imageUrl, index) => (
                    <motion.img
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, z: 10 }}
                      src={imageUrl}
                      alt={`Clinic image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer shadow-md"
                    />
                  ))}
                </div>
              </motion.div>
            )}*/}
          </div> 

          {/* Right Column - Map & Actions */}
          <div className="space-y-6">
            {/* Location Map */}
            <motion.div variants={cardVariants as any} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
              {coordinates ? (
                <div className="space-y-4">
                  <div className="border dark:border-gray-600 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                    <MapContainer
                      center={coordinates}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={coordinates}>
                        <Popup>
                          <div className="text-center">
                            <strong>{clinicData.clinicName}</strong>
                            <br />
                            {clinicData.address}
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShareLocation}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGetDirections}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Directions</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p>Location not available</p>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={cardVariants as any} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium shadow-md"
                >
                  Book Appointment
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCallClinic}
                  className="w-full border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                >
                  Call Clinic
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetDirections}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Get Directions
                </motion.button>
              </div>
            </motion.div>

            {/* Clinic Stats */}
            <motion.div variants={cardVariants as any} whileHover="hover" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transform-gpu">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Clinic Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`font-medium ${
                    clinicData.status === 'OPEN' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {clinicData.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Established</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {clinicData.createdAt ? new Date(clinicData.createdAt).getFullYear() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {clinicData.updatedAt ? new Date(clinicData.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
    
  )
}

export default Clinic
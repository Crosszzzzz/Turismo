import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Clock, Lightbulb, ExternalLink } from 'lucide-react';
import type { StructuredRoute } from '@/types/route';
import { SUCRE_PLACES, PLACES_WITH_POS } from '@/lib/places';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeData: StructuredRoute | null;
  routeInfo?: string | null;
  visitedPlaces: Set<string>;
  onToggleVisited: (placeName: string) => void;
}

export default function RouteModal({ isOpen, onClose, routeData, routeInfo, visitedPlaces, onToggleVisited }: RouteModalProps) {
  // Fallback for raw text if JSON parsing failed
  const hasStructuredData = routeData && routeData.steps && routeData.steps.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-gray-100"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#c2410c] to-[#ea580c] px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">Tu Ruta Optimizada</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
                {!hasStructuredData && !routeInfo ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <div className="w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin mb-4" />
                    <p>Generando itinerario perfecto...</p>
                  </div>
                ) : hasStructuredData ? (
                  <div className="space-y-5">
                    {/* Introduction */}
                    <p className="text-gray-700 leading-relaxed text-base">
                      {routeData.introduction}
                    </p>

                    {/* Steps */}
                    <div className="space-y-4">
                      {routeData.steps.map((step, index) => {
                        const placeImage = SUCRE_PLACES.find(p => p.name.toLowerCase() === step.place.toLowerCase())?.image;
                        const place = PLACES_WITH_POS.find(p => p.name.toLowerCase() === step.place.toLowerCase());
                        const isVisited = place ? visitedPlaces.has(place.id) : false;

                        return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pl-8"
                        >
                          {/* Timeline connector */}
                          {index < routeData.steps.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-[#ea580c] to-orange-200" />
                          )}
                          
                          {/* Orange bullet */}
                          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#ea580c] flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>

                          {/* Step card */}
                          <div className={`bg-gradient-to-br from-orange-50 to-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                            isVisited ? 'border-green-300' : 'border-orange-100'
                          }`}>
                            {/* Image Header */}
                            {placeImage && (
                              <div className="w-full h-32 relative overflow-hidden">
                                <img 
                                  src={placeImage} 
                                  alt={step.place} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              </div>
                            )}
                            
                            <div className="p-4">
                              {/* Place name */}
                              <h3 className="font-bold text-orange-700 text-lg mb-2">
                                {step.place}
                              </h3>

                              {/* Travel time */}
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Clock className="w-4 h-4 text-[#ea580c]" />
                                <span className="font-semibold">{step.time}</span>
                              </div>

                              {/* Description */}
                              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {step.description}
                              </p>

                              {/* Tip */}
                              {step.tip && (
                                <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100 mb-3">
                                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                  <p className="text-amber-700 text-xs leading-relaxed">
                                    {step.tip}
                                  </p>
                                </div>
                              )}

                              {/* Mark as Visited */}
                              {place && (
                                <button
                                  onClick={() => onToggleVisited(step.place)}
                                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer border ${
                                    isVisited
                                      ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                                      : 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                                  }`}
                                >
                                  {isVisited ? (
                                    <>
                                      <span className="text-sm">✔</span>
                                      Visitado
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-sm opacity-50">○</span>
                                      Marcar como visitado
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                        );
                      })}
                    </div>

                    {/* Google Maps Button */}
                    {routeData.mapsUrl && (
                      <motion.a
                        href={routeData.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-3 w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6"
                      >
                        <Navigation className="w-5 h-5" />
                        Abrir ruta en Google Maps
                        <ExternalLink className="w-4 h-4 opacity-70" />
                      </motion.a>
                    )}
                  </div>
                ) : (
                  /* Fallback for raw text */
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {routeInfo}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-100 p-4 shrink-0 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

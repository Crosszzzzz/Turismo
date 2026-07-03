"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Lightbulb, Navigation, ExternalLink, Route } from 'lucide-react';
import type { StructuredRoute } from '@/types/route';
import { SUCRE_PLACES } from '@/lib/places';

interface RoutesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  routeData: StructuredRoute | null;
  routeInfo?: string | null;
  selectedPlaces: string[];
}

export default function RoutesPanel({
  isOpen,
  onClose,
  routeData,
  routeInfo,
  selectedPlaces,
}: RoutesPanelProps) {
  const hasStructuredData = routeData && routeData.steps && routeData.steps.length > 0;
  const hasRoute = hasStructuredData || !!routeInfo;

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
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm pointer-events-auto"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#c2410c] to-[#ea580c] px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Route className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Mis Rutas</h2>
                  <p className="text-white/70 text-xs">
                    {selectedPlaces.length > 0
                      ? `${selectedPlaces.length} lugar${selectedPlaces.length > 1 ? 'es' : ''} seleccionado${selectedPlaces.length > 1 ? 's' : ''}`
                      : 'Sin lugares seleccionados'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {!hasRoute ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <MapPin className="w-7 h-7 text-[#ea580c]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Sin rutas generadas</h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Agregá lugares a tu ruta desde el mapa y tocá &quot;Generar ruta&quot; para crear un itinerario personalizado con IA.
                  </p>
                </div>
              ) : hasStructuredData ? (
                <div className="space-y-4">
                  {/* Introduction */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {routeData!.introduction}
                  </p>

                  {/* Steps */}
                  <div className="space-y-3">
                    {routeData!.steps.map((step, index) => {
                      const placeImage = SUCRE_PLACES.find(
                        (p) => p.name.toLowerCase() === step.place.toLowerCase()
                      )?.image;

                      return (
                        <div key={index} className="relative pl-7">
                          {/* Timeline connector */}
                          {index < routeData!.steps.length - 1 && (
                            <div className="absolute left-[9px] top-7 bottom-0 w-0.5 bg-gradient-to-b from-[#ea580c] to-orange-200" />
                          )}

                          {/* Bullet */}
                          <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-[#ea580c] flex items-center justify-center shadow-sm">
                            <span className="text-white text-[10px] font-bold">{index + 1}</span>
                          </div>

                          {/* Step card */}
                          <div className="bg-orange-50/60 border border-orange-100 rounded-xl overflow-hidden">
                            {placeImage && (
                              <div className="w-full h-24 relative overflow-hidden">
                                <img
                                  src={placeImage}
                                  alt={step.place}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              </div>
                            )}
                            <div className="p-3">
                              <h3 className="font-bold text-orange-700 text-sm mb-1">{step.place}</h3>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                                <Clock className="w-3 h-3 text-[#ea580c]" />
                                <span className="font-medium">{step.time}</span>
                              </div>
                              <p className="text-gray-600 text-xs leading-relaxed mb-2">{step.description}</p>
                              {step.tip && (
                                <div className="flex items-start gap-1.5 bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-100">
                                  <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                  <p className="text-amber-700 text-[11px] leading-relaxed">{step.tip}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Google Maps Button */}
                  {routeData!.mapsUrl && (
                    <a
                      href={routeData!.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg mt-4"
                    >
                      <Navigation className="w-4 h-4" />
                      Abrir en Google Maps
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  )}
                </div>
              ) : (
                /* Fallback: raw text */
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {routeInfo}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

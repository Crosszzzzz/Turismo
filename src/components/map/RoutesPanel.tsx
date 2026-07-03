"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Lightbulb, Trash2, CheckCircle2, Route } from 'lucide-react';
import type { StructuredRoute } from '@/types/route';
import { PLACES_WITH_POS } from '@/lib/places';

interface RoutesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  routeHistory: Array<{
    id: string;
    timestamp: number;
    routeData: StructuredRoute | null;
    routeInfo: string | null;
    placeNames: string[];
  }>;
  onDeleteRoute: (id: string) => void;
  visitedPlaces: Set<string>;
  onToggleVisited: (placeId: string) => void;
}

export default function RoutesPanel({
  isOpen,
  onClose,
  routeHistory,
  onDeleteRoute,
  visitedPlaces,
  onToggleVisited,
}: RoutesPanelProps) {
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRouteId(prev => (prev === id ? null : id));
  };

  const visitedPlacesList = PLACES_WITH_POS.filter(p => visitedPlaces.has(p.id));

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
                    {routeHistory.length > 0
                      ? `${routeHistory.length} ruta${routeHistory.length > 1 ? 's' : ''} en historial`
                      : 'Sin rutas guardadas'}
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
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Historial de Rutas */}
              <section>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Historial de Rutas</h3>
                {routeHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-[#ea580c]" />
                    </div>
                    <h4 className="text-base font-bold text-gray-800 mb-1">Sin rutas generadas</h4>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Generá rutas desde el mapa y aparecerán aquí.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {routeHistory.map((entry) => {
                      const isExpanded = expandedRouteId === entry.id;
                      const hasSteps = entry.routeData && entry.routeData.steps && entry.routeData.steps.length > 0;
                      const date = new Date(entry.timestamp);

                      return (
                        <div key={entry.id} className="bg-orange-50/60 border border-orange-100 rounded-xl overflow-hidden">
                          {/* Route summary */}
                          <div className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-400 mb-1">
                                  {date.toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  {' · '}
                                  {date.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-sm font-semibold text-gray-800 leading-snug">
                                  {entry.placeNames.join(', ')}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {hasSteps && (
                                  <button
                                    onClick={() => toggleExpand(entry.id)}
                                    className="text-xs font-medium text-[#ea580c] hover:text-[#c2410c] px-2 py-1 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
                                  >
                                    {isExpanded ? 'Ocultar' : 'Ver pasos'}
                                  </button>
                                )}
                                <button
                                  onClick={() => onDeleteRoute(entry.id)}
                                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Eliminar ruta"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Raw text fallback if no structured data */}
                            {!hasSteps && entry.routeInfo && (
                              <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">
                                {entry.routeInfo}
                              </p>
                            )}
                          </div>

                          {/* Expanded steps */}
                          <AnimatePresence>
                            {isExpanded && hasSteps && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 space-y-2">
                                  {entry.routeData!.steps.map((step, index) => {
                                    const placeImage = PLACES_WITH_POS.find(
                                      (p) => p.name.toLowerCase() === step.place.toLowerCase()
                                    )?.image;

                                    return (
                                      <div key={index} className="relative pl-6">
                                        {/* Timeline connector */}
                                        {index < entry.routeData!.steps.length - 1 && (
                                          <div className="absolute left-[6px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-[#ea580c] to-orange-200" />
                                        )}

                                        {/* Bullet */}
                                        <div className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full bg-[#ea580c] flex items-center justify-center shadow-sm">
                                          <span className="text-white text-[8px] font-bold">{index + 1}</span>
                                        </div>

                                        {/* Step card */}
                                        <div className="bg-white/70 border border-orange-100 rounded-xl overflow-hidden">
                                          {placeImage && (
                                            <div className="w-full h-20 relative overflow-hidden">
                                              <img
                                                src={placeImage}
                                                alt={step.place}
                                                className="w-full h-full object-cover"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            </div>
                                          )}
                                          <div className="p-2.5">
                                            <h4 className="font-bold text-orange-700 text-xs mb-0.5">{step.place}</h4>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1.5">
                                              <Clock className="w-3 h-3 text-[#ea580c]" />
                                              <span className="font-medium">{step.time}</span>
                                            </div>
                                            <p className="text-gray-600 text-[11px] leading-relaxed mb-1.5">{step.description}</p>
                                            {step.tip && (
                                              <div className="flex items-start gap-1 bg-amber-50 rounded-lg px-2 py-1 border border-amber-100">
                                                <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                                <p className="text-amber-700 text-[10px] leading-relaxed">{step.tip}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Separator */}
              {visitedPlacesList.length > 0 && routeHistory.length > 0 && (
                <div className="border-t border-gray-100" />
              )}

              {/* Lugares Visitados */}
              <section>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Lugares Visitados</h3>
                {visitedPlacesList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="text-base font-bold text-gray-800 mb-1">Sin lugares visitados</h4>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Marcá lugares como visitados desde el mapa.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visitedPlacesList.map((place) => (
                      <div
                        key={place.id}
                        className="flex items-center justify-between bg-green-50/80 border border-green-200 rounded-xl px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <span className="text-sm font-medium text-gray-800 truncate">{place.name}</span>
                        </div>
                        <button
                          onClick={() => onToggleVisited(place.id)}
                          className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        >
                          Desmarcar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
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

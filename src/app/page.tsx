"use client";

import React, { useState } from 'react';
import { Navigation, MessageCircle, Search, MapPin, Clock, DollarSign, Plus, X, Minus } from 'lucide-react';
import InteractiveGlobe from '@/components/map/InteractiveGlobe';
import Link from 'next/link';
import { PLACES_WITH_POS, Place } from '@/lib/places';
import type { StructuredRoute } from '@/types/route';

import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ onSelectPlace }: { onSelectPlace: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter search results
  const searchResults = searchQuery.trim() === ''
    ? []
    : PLACES_WITH_POS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectSearchResult = (id: string) => {
    onSelectPlace(id);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <nav className="absolute top-0 w-full z-20 px-6 py-4 pointer-events-none">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/60 px-6 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur-md border border-white/60 pointer-events-auto">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#c2410c] drop-shadow-sm font-sans">
            SmartTour
          </h1>

          {/* Search Bar */}
          <div className="relative hidden md:block w-64">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar lugar..."
                className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#c2410c]/30 rounded-full py-1.5 pl-9 pr-4 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white p-2 flex flex-col gap-1"
                >
                  {searchResults.map(place => (
                    <button
                      key={place.id}
                      onClick={() => handleSelectSearchResult(place.id)}
                      className="text-left px-3 py-2 rounded-xl hover:bg-[#c2410c]/10 text-sm text-gray-700 transition-colors"
                    >
                      {place.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-gray-700 font-medium">
          <Link href="#" className="hover:text-[#c2410c] transition-colors">Inicio</Link>
          <Link href="/rutas" className="hover:text-[#c2410c] transition-colors">Rutas</Link>
          <Link href="/acerca-de" className="hover:text-[#c2410c] transition-colors">Acerca de</Link>
        </div>
      </div>
    </nav>
  );
}

import RouteModal from '@/components/map/RouteModal';
import ChatInterface from '@/components/chat/ChatInterface';

export default function HomePage() {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedRoutePlaces, setSelectedRoutePlaces] = useState<string[]>([]); // "Shopping Cart" state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Route generation state
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [generatedRouteData, setGeneratedRouteData] = useState<StructuredRoute | null>(null);
  const [generatedRouteInfo, setGeneratedRouteInfo] = useState<string | null>(null);

  // Route cache — avoid redundant API calls
  const [cachedRouteData, setCachedRouteData] = useState<StructuredRoute | null>(null);
  const [cachedRouteInfo, setCachedRouteInfo] = useState<string | null>(null);
  const [lastPlacesSnapshot, setLastPlacesSnapshot] = useState<string[]>([]);

  const selectedPlace = PLACES_WITH_POS.find(p => p.id === selectedPlaceId);
  const isAdded = selectedPlace ? selectedRoutePlaces.includes(selectedPlace.id) : false;

  const handleToggleRoute = () => {
    if (!selectedPlace) return;
    if (isAdded) {
      setSelectedRoutePlaces(prev => prev.filter(id => id !== selectedPlace.id));
    } else {
      setSelectedRoutePlaces(prev => [...prev, selectedPlace.id]);
    }
  };

  const handleGenerateRoute = async () => {
    if (selectedRoutePlaces.length === 0) {
      alert("Selecciona al menos un lugar para generar tu ruta.");
      return;
    }

    // Cache check: compare current selection with last snapshot
    const currentSorted = [...selectedRoutePlaces].sort().join(',');
    const lastSorted = [...lastPlacesSnapshot].sort().join(',');

    if (currentSorted === lastSorted && (cachedRouteData || cachedRouteInfo)) {
      // Same places, cached response exists — open modal without API call
      setGeneratedRouteData(cachedRouteData);
      setGeneratedRouteInfo(cachedRouteInfo);
      setIsRouteModalOpen(true);
      return;
    }

    // Cache miss — proceed with API call
    setIsGeneratingRoute(true);
    setIsRouteModalOpen(true);
    setGeneratedRouteData(null);
    setGeneratedRouteInfo(null);

    // Default Sucre Center coordinates
    let startLocation = { lat: -19.0430, lng: -65.2592 };

    // Try to get user location
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      startLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
    } catch (error) {
      console.log('Using default start location (Plaza 25 de Mayo).');
    }

    // Prepare data
    const placesData = selectedRoutePlaces.map(id => {
      const p = PLACES_WITH_POS.find(place => place.id === id);
      return p ? { name: p.name, lat: p.realLat, lon: p.realLng, category: p.category, time: p.time } : null;
    }).filter(Boolean);

    try {
      const res = await fetch('/api/generate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startLocation, places: placesData })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Update cache with new response and snapshot
      if (data.routeData) {
        setCachedRouteData(data.routeData);
        setGeneratedRouteData(data.routeData);
      } else if (data.routeInfo) {
        setCachedRouteInfo(data.routeInfo);
        setGeneratedRouteInfo(data.routeInfo);
      }
      setLastPlacesSnapshot([...selectedRoutePlaces]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || '';
      if (errorMsg.includes('429') || errorMsg.includes('Quota') || errorMsg.includes('Too Many Requests')) {
        setGeneratedRouteInfo("Límite de IA alcanzado. Parece que hay mucha gente planificando viajes en este momento y hemos excedido el límite de peticiones de la Inteligencia Artificial (Error 429 - Quota Exceeded). Por favor, espera unos 20 o 30 segundos e intenta generar tu ruta de nuevo.");
      } else {
        setGeneratedRouteInfo("Hubo un error al generar la ruta. Por favor intenta de nuevo.\n\n" + errorMsg);
      }
    } finally {
      setIsGeneratingRoute(false);
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#fafaf9]">

      {/* Navbar Minimalista, Flotante y con Buscador Desacoplado */}
      <Navbar onSelectPlace={setSelectedPlaceId} />

      {/* 3D Interactive Globe Background */}
      <div className="absolute inset-0 z-0">
        <InteractiveGlobe
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={setSelectedPlaceId}
        />
      </div>

      {/* Foreground UI Layer */}
      <div className="pointer-events-none absolute inset-0 z-10 p-6 pb-8">

        {/* Bottom Area Container */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mx-auto w-full h-full max-w-6xl relative">

          {/* Left Panel: Place Details (Draggable) */}
          <AnimatePresence>
            {selectedPlace && (
              <motion.div
                key="draggable-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                className="pointer-events-auto absolute bottom-0 left-0 w-full md:w-96 cursor-grab active:cursor-grabbing"
              >
                <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col resize overflow-auto min-h-[400px] min-w-[320px] max-w-[90vw] max-h-[85vh]">
                  {/* Drag handle hint */}
                  <div className="w-12 h-1.5 bg-gray-300/80 rounded-full mx-auto mb-4 opacity-70"></div>

                  {/* Content that updates when selectedPlace changes */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPlace.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      {/* Header Image */}
                      <div className="w-full h-40 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center bg-gray-100">
                        {selectedPlace.image ? (
                          <img
                            src={selectedPlace.image}
                            alt={selectedPlace.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-5xl drop-shadow-md">{selectedPlace.emoji}</span>
                        )}
                        {/* Close Button overlay */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedPlaceId(null); }}
                          className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center transition-colors shrink-0 cursor-pointer pointer-events-auto"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Header Title & Category */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#c2410c] bg-[#ffedd5] px-2 py-0.5 rounded-full">
                            {selectedPlace.type}
                          </span>
                          <span className="text-xs font-bold text-amber-500 flex items-center">
                            ⭐ {selectedPlace.rating}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight tracking-tight pr-2">{selectedPlace.name}</h2>
                      </div>

                      <p className="text-sm text-gray-600 mb-5 cursor-text leading-relaxed">{selectedPlace.info}</p>

                      {/* Fast Data Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                          <Clock className="w-4 h-4 text-[#4d7c0f]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Tiempo</span>
                            <span className="text-xs font-semibold text-gray-700">{selectedPlace.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                          <DollarSign className="w-4 h-4 text-[#4d7c0f]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Costo</span>
                            <span className="text-xs font-semibold text-gray-700">{selectedPlace.cost}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                          <MapPin className="w-4 h-4 text-[#4d7c0f]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Dificultad</span>
                            <span className="text-xs font-semibold text-gray-700">{selectedPlace.difficulty}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                          <MessageCircle className="w-4 h-4 text-[#4d7c0f]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Horario</span>
                            <span className="text-xs font-semibold text-gray-700">{selectedPlace.schedule}</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Action Button */}
                      <button
                        onClick={handleToggleRoute}
                        className={`group relative w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all cursor-pointer border ${isAdded
                            ? 'bg-transparent text-[#c2410c] border-[#c2410c]/40 hover:bg-[#c2410c]/5 hover:border-[#c2410c]/60 shadow-none'
                            : 'bg-gradient-to-r from-[#c2410c] to-[#ea580c] hover:from-[#9a3412] hover:to-[#c2410c] text-white shadow-[0_8px_20px_rgba(234,88,12,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(234,88,12,0.4)] border-white/20'
                          }`}
                      >
                        {isAdded ? (
                          <>
                            <Minus className="w-4 h-4" />
                            Quitar de la ruta
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Agregar a la ruta
                          </>
                        )}
                      </button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Action Buttons (Centered/Right aligned in large screens) */}
          <div className="pointer-events-auto absolute bottom-0 right-0 flex w-full md:w-auto flex-col sm:flex-row justify-center md:justify-end gap-4 shrink-0 items-end">
            {/* Clear All Button */}
            <AnimatePresence>
              {selectedRoutePlaces.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => setSelectedRoutePlaces([])}
                  className="flex items-center justify-center rounded-full bg-black/10 hover:bg-red-500/20 text-gray-500 hover:text-red-500 backdrop-blur-sm w-12 h-12 transition-colors cursor-pointer border border-black/5 hover:border-red-400/30"
                  title="Limpiar ruta"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <button
              onClick={handleGenerateRoute}
              disabled={isGeneratingRoute}
              className={`group relative flex items-center justify-center gap-2 overflow-visible rounded-full px-6 py-4 font-bold text-white shadow-[0_8px_20px_rgba(194,65,12,0.3),_inset_0_4px_0_rgba(255,255,255,0.2)] transition-all active:translate-y-1 active:shadow-[0_4px_10px_rgba(194,65,12,0.3),_inset_0_0px_0_rgba(255,255,255,0)] ${isGeneratingRoute ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#c2410c] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(194,65,12,0.4),_inset_0_4px_0_rgba(255,255,255,0.3)]'
                }`}
            >
              {isGeneratingRoute ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
              <span className="text-base whitespace-nowrap">
                {isGeneratingRoute ? 'Generando...' : 'Generar ruta'}
              </span>

              {/* Notification Badge */}
              <AnimatePresence>
                {!isGeneratingRoute && selectedRoutePlaces.length > 0 && (
                  <motion.div
                    key={selectedRoutePlaces.length} // Force re-animate on count change
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white"
                  >
                    {selectedRoutePlaces.length}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setIsChatOpen(true)}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#f97316] px-6 py-4 font-bold text-white shadow-[0_8px_20px_rgba(249,115,22,0.3),_inset_0_4px_0_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(249,115,22,0.4),_inset_0_4px_0_rgba(255,255,255,0.5)] active:translate-y-1 active:shadow-[0_4px_10px_rgba(249,115,22,0.3),_inset_0_0px_0_rgba(255,255,255,0)]"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-base whitespace-nowrap">Hablar con la guía IA</span>
            </button>
          </div>

        </div>
      </div>

      {/* AI Route Result Modal */}
      <RouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        routeData={generatedRouteData}
        routeInfo={generatedRouteInfo}
      />

      {/* AI Chat Assistant */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

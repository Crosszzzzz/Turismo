"use client";

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Place } from '@/lib/places';

interface PlaceMarkerProps {
  place: Place;
  isSelected?: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

export function PlaceMarker({ place, isSelected = false, onHover, onClick }: PlaceMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [labelHovered, setLabelHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const position = place.position!;
  
  // Category icon mapping
  const categoryIcon: Record<string, string> = {
    church: '⛪', museum: '🏛️', park: '🌳', castle: '🏰',
    market: '🏪', historic: '🏛️', dino: '🦕',
  };

  // Earthy/Tourism color palette for markers
  const baseColor = place.type === 'park' ? '#4d7c0f' : // Sage green
                    place.type === 'museum' ? '#c2410c' : // Terracotta
                    place.type === 'historic' ? '#9a3412' : // Dark orange/brown
                    place.type === 'church' ? '#fbbf24' : // Golden/Sand
                    '#f97316'; // Warm orange
                    
  const hoverColor = '#fb923c'; // Lighter orange for hover
  const selectedColor = '#fed7aa'; // Very light orange/sand for selection highlight
  
  const color = isSelected ? selectedColor : (hovered ? hoverColor : baseColor);
  
  // Emissive glow for contrast
  const emissiveColor = color;
  const emissiveIntensity = isSelected ? 0.4 : (hovered ? 0.3 : 0.1);

  // Massive scale to match the cartoon miniature planet style
  const baseScale = 3.0;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating animation (diorama feeling)
      groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.02;
      
      // Scaling animation on hover or select
      const targetScale = isSelected ? baseScale * 1.4 : (hovered ? baseScale * 1.2 : baseScale);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    // --- Occlusion: direct DOM manipulation, zero React re-renders ---
    const el = containerRef.current;
    if (el) {
      const worldPos = new THREE.Vector3();
      groupRef.current!.getWorldPosition(worldPos);

      const cameraPos = state.camera.position;
      const markerNormal = worldPos.clone().normalize();
      const viewDir = cameraPos.clone().sub(worldPos).normalize();
      const dot = markerNormal.dot(viewDir);

      // Fade zone: fully visible > 0.3, fully hidden < 0.1
      const target = dot > 0.3 ? 1 : dot < 0.1 ? 0 : (dot - 0.1) / 0.2;
      const current = parseFloat(el.style.opacity || '1');
      const next = current + (target - current) * Math.min(delta * 20, 1);

      el.style.opacity = String(next);
      el.style.pointerEvents = next < 0.05 ? 'none' : 'auto';
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    setLabelHovered(true);
    onHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    setLabelHovered(false);
    onHover(false);
    document.body.style.cursor = 'auto';
  };

  const commonMaterialProps = {
    roughness: 0.2,
    metalness: 0.1,
    emissive: emissiveColor,
    emissiveIntensity: emissiveIntensity
  };

  const wallColor = isSelected ? selectedColor : (hovered ? hoverColor : '#eaddcf'); // Stone/wall color for buildings
  const roofColor = color;

  // Complex Low-Poly Models
  const renderGeometry = () => {
    switch (place.type) {
      case 'castle': // Castle/Glorieta
      case 'historic':
        return (
          <group position={[0, 0.03, 0]}>
            {/* Main Block */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.06, 0.04, 0.06]} />
              <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
            </mesh>
            {/* 4 Towers */}
            {[
              [-0.03, -0.03], [0.03, -0.03], [-0.03, 0.03], [0.03, 0.03]
            ].map((pos, idx) => (
              <group key={idx} position={[pos[0], 0.01, pos[1]]}>
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
                  <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0.04, 0]}>
                  <coneGeometry args={[0.012, 0.02, 8]} />
                  <meshStandardMaterial color={roofColor} {...commonMaterialProps} />
                </mesh>
              </group>
            ))}
          </group>
        );
        
      case 'church': // Church/Temple
        return (
          <group position={[0, 0.03, 0]}>
            {/* Main nave */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.05, 0.04, 0.07]} />
              <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.025, 0.025, 0.07, 3]} />
              <meshStandardMaterial color={roofColor} {...commonMaterialProps} />
            </mesh>
            {/* Tower */}
            <group position={[0, 0.02, 0.03]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.03, 0.08, 0.03]} />
                <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <coneGeometry args={[0.02, 0.03, 4]} />
                <meshStandardMaterial color={roofColor} {...commonMaterialProps} />
              </mesh>
            </group>
          </group>
        );
        
      case 'museum': // Classic Museum (Columns)
        return (
          <group position={[0, 0.03, 0]}>
            {/* Base */}
            <mesh position={[0, -0.015, 0]}>
              <boxGeometry args={[0.08, 0.01, 0.06]} />
              <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
            </mesh>
            {/* Columns */}
            {[-0.03, -0.01, 0.01, 0.03].map((x, idx) => (
              <mesh key={idx} position={[x, 0.01, 0.02]}>
                <cylinderGeometry args={[0.005, 0.005, 0.04, 8]} />
                <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
              </mesh>
            ))}
            {/* Back Wall */}
            <mesh position={[0, 0.01, -0.01]}>
              <boxGeometry args={[0.07, 0.04, 0.03]} />
              <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
            </mesh>
            {/* Classic Roof */}
            <mesh position={[0, 0.04, 0]} rotation={[Math.PI/2, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 3]} />
              <meshStandardMaterial color={roofColor} {...commonMaterialProps} />
            </mesh>
          </group>
        );
        
      case 'park': // Mini Park Scene
        return (
          <group position={[0, 0.02, 0]}>
            {/* Grass Base */}
            <mesh position={[0, -0.01, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
              <meshStandardMaterial color="#3f6212" {...commonMaterialProps} />
            </mesh>
            {/* Trees */}
            {[
              { pos: [-0.02, 0.01, -0.01], scale: 1 },
              { pos: [0.02, 0.01, 0.01], scale: 0.8 },
              { pos: [0.0, 0.01, 0.02], scale: 1.2 }
            ].map((tree, idx) => (
              <group key={idx} position={new THREE.Vector3(...tree.pos)} scale={tree.scale}>
                {/* Trunk */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.02, 8]} />
                  <meshStandardMaterial color="#78350f" />
                </mesh>
                {/* Leaves */}
                <mesh position={[0, 0.015, 0]}>
                  <sphereGeometry args={[0.015, 8, 8]} />
                  <meshStandardMaterial color={color} {...commonMaterialProps} />
                </mesh>
              </group>
            ))}
          </group>
        );

      case 'dino': // Dinosaur for Parque Cretácico
        return (
          <group position={[0, 0.03, 0]}>
            {/* Body */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.015, 0.04, 4, 8]} />
              <meshStandardMaterial color="#4ade80" {...commonMaterialProps} />
            </mesh>
            {/* Neck */}
            <mesh position={[0.025, 0.02, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <cylinderGeometry args={[0.005, 0.008, 0.05, 8]} />
              <meshStandardMaterial color="#4ade80" {...commonMaterialProps} />
            </mesh>
            {/* Head */}
            <mesh position={[0.035, 0.045, 0]}>
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshStandardMaterial color="#22c55e" {...commonMaterialProps} />
            </mesh>
            {/* Tail */}
            <mesh position={[-0.03, -0.01, 0]} rotation={[0, 0, Math.PI / 4]}>
              <coneGeometry args={[0.01, 0.05, 8]} />
              <meshStandardMaterial color="#4ade80" {...commonMaterialProps} />
            </mesh>
            {/* Legs */}
            {[-0.015, 0.015].map((x, i) => (
              <React.Fragment key={i}>
                <mesh position={[x, -0.015, 0.01]}>
                  <cylinderGeometry args={[0.004, 0.004, 0.02, 8]} />
                  <meshStandardMaterial color="#22c55e" {...commonMaterialProps} />
                </mesh>
                <mesh position={[x, -0.015, -0.01]}>
                  <cylinderGeometry args={[0.004, 0.004, 0.02, 8]} />
                  <meshStandardMaterial color="#22c55e" {...commonMaterialProps} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );
        
      default: // Market / Default -> Nice Tent/Stall
        return (
          <group position={[0, 0.02, 0]}>
            {/* Table */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.05, 0.02, 0.04]} />
              <meshStandardMaterial color={wallColor} {...commonMaterialProps} />
            </mesh>
            {/* Tent top */}
            <mesh position={[0, 0.025, 0]} rotation={[Math.PI/2, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.06, 3]} />
              <meshStandardMaterial color={roofColor} {...commonMaterialProps} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      // Orient the marker to point outwards from the center of the sphere
      quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize())}
    >
      <group
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {renderGeometry()}
      </group>

      {/* Glassmorphism Label — manual occlusion via DOM + hover expand */}
      <Html zIndexRange={[100, 0]} className="pointer-events-none">
        <div
          ref={containerRef}
          className="transform -translate-x-1/2 -translate-y-[calc(100%+25px)]"
          style={{ opacity: 1, transition: 'opacity 0.1s ease-out' }}
        >
          <div
            className={`bg-white/15 backdrop-blur-md border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden ${labelHovered ? 'rounded-xl px-3.5 py-2.5' : 'rounded-lg px-3 py-1.5'}`}
            style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <span className="text-gray-800 font-semibold text-xs tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] whitespace-nowrap block text-center">
              {place.name}
            </span>
            {/* Expanded: category icon + rating */}
            <div
              className="text-center"
              style={{
                maxHeight: labelHovered ? '36px' : '0px',
                opacity: labelHovered ? 1 : 0,
                marginTop: labelHovered ? '6px' : '0px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
              }}
            >
              <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-gray-600">
                <span className="flex items-center gap-1">
                  <span>{categoryIcon[place.type] || '📍'}</span>
                  <span className="capitalize">{place.type}</span>
                </span>
                <span className="w-px h-2.5 bg-gray-400/40"></span>
                <span className="text-amber-600">⭐ {place.rating}</span>
              </div>
            </div>
          </div>
          <div className="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white/15"></div>
        </div>
      </Html>
    </group>
  );
}

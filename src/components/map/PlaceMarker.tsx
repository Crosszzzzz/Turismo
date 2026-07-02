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
  const groupRef = useRef<THREE.Group>(null);
  const position = place.position!;
  
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
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
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

      {/* Enriched Hover Tooltip */}
      {hovered && !isSelected && (
        <Html zIndexRange={[100, 0]} className="pointer-events-none">
          <div className="transform -translate-x-1/2 -translate-y-[calc(100%+25px)]">
            <div className="bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl text-center shadow-lg border border-white/10 flex flex-col items-center gap-1 min-w-[120px]">
              <div className="flex items-center gap-1.5 w-full justify-center">
                <span className="text-lg">{place.emoji}</span>
                <span className="text-white font-bold text-sm tracking-tight">{place.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium w-full justify-center">
                <span className="text-amber-400 bg-amber-400/10 px-1.5 rounded">⭐ {place.rating}</span>
                <span className="text-green-400 bg-green-400/10 px-1.5 rounded">{place.cost === 'Gratis' ? 'Gratis' : '$$'}</span>
              </div>
            </div>
            {/* Triangle */}
            <div className="w-0 h-0 mx-auto border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black/85"></div>
          </div>
        </Html>
      )}
    </group>
  );
}

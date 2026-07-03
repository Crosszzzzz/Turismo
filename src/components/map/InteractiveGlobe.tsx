"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { PlaceMarker } from './PlaceMarker';
import { PLACES_WITH_POS, GLOBE_RADIUS, latLongToVector3 } from '@/lib/places';

// Procedural Urban Environment (Flat Roads and Global Scattering)
function UrbanEnvironment({ radius }: { radius: number }) {
  const { roads, decorations } = useMemo(() => {
    const r = radius + 0.002; // Very close to ground so lines are flat
    const allCurves = [];
    
    // 1. Main Route connecting landmarks
    const landmarkPositions = PLACES_WITH_POS.map(p => p.position!.clone().normalize().multiplyScalar(r));
    landmarkPositions.sort((a, b) => Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x));
    const mainCurve = new THREE.CatmullRomCurve3(landmarkPositions, true);
    allCurves.push(mainCurve);

    // 2. Organic Branching Roads
    for (let i = 0; i < 25; i++) {
      const startPt = landmarkPositions[Math.floor(Math.random() * landmarkPositions.length)].clone();
      let currentPt = startPt;
      const branchPts = [currentPt];
      
      let dir = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
      const steps = Math.floor(Math.random() * 3) + 4;
      for(let j = 0; j < steps; j++) {
        currentPt = currentPt.clone().add(dir.clone().multiplyScalar(0.3)).normalize().multiplyScalar(r);
        branchPts.push(currentPt);
        dir.add(new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).multiplyScalar(0.8)).normalize();
      }
      allCurves.push(new THREE.CatmullRomCurve3(branchPts, false));
    }

    // 3. Global Decoration Dispersion (Mostly Nature to fill empty spaces)
    const decs = [];
    for (let i = 0; i < 90; i++) { // 90 items for lush nature but avoiding complete clutter
      // Pure random position on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi)
      );

      // Heavily biased towards nature (trees and bushes)
      const rand = Math.random();
      let type = 'tree'; // Default is tree
      let scaleVal = Math.random() > 0.6 ? (Math.random() * 4 + 4) : (Math.random() * 3 + 2);

      if (rand > 0.95) { type = 'trafficlight'; scaleVal = Math.random() * 1.5 + 1.5; }
      else if (rand > 0.90) { type = 'lightpost'; scaleVal = Math.random() * 1.5 + 2.0; }
      else if (rand > 0.80) { type = 'house'; scaleVal = Math.random() > 0.5 ? (Math.random() * 2 + 3) : (Math.random() * 2 + 1.5); }
      else if (rand > 0.40) { type = 'bush'; scaleVal = Math.random() * 2 + 1.5; } // 40% chance of bush
      
      // Orientation with random Y rotation
      const baseQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      const randomYQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
      const quaternion = baseQuat.multiply(randomYQuat);

      decs.push({ pos, quaternion, type, scale: [scaleVal, scaleVal, scaleVal], id: i });
    }

    return { roads: allCurves, decorations: decs };
  }, [radius]);

  return (
    <group>
      {/* Flat Cartographic Roads */}
      {roads.map((curve, idx) => (
        <Line 
          key={`road-${idx}`} 
          points={curve.getPoints(100)} 
          color="#fdf6e3" // Light beige/sand color for paths
          lineWidth={10} // Much thicker for cartoon style
        />
      ))}

      {/* Decorations */}
      {decorations.map((dec) => (
        <group key={dec.id} position={dec.pos} quaternion={dec.quaternion} scale={dec.scale as [number, number, number]}>
          {dec.type === 'house' && (
            <group position={[0, 0.015, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.03, 0.03, 0.03]} />
                <meshStandardMaterial color="#ffffff" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <coneGeometry args={[0.025, 0.02, 4]} />
                <meshStandardMaterial color="#c2410c" roughness={0.8} />
              </mesh>
            </group>
          )}
          {dec.type === 'tree' && (
            <group position={[0, 0.01, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.003, 0.003, 0.02, 4]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              <mesh position={[0, 0.015, 0]}>
                <sphereGeometry args={[0.015, 6, 6]} />
                <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
              </mesh>
            </group>
          )}
          {dec.type === 'bush' && (
            <mesh position={[0, 0.01, 0]}>
              <sphereGeometry args={[0.015, 5, 5]} />
              <meshStandardMaterial color="#3f6212" roughness={0.9} />
            </mesh>
          )}
          {dec.type === 'lightpost' && (
            <group position={[0, 0.015, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.001, 0.001, 0.03, 4]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
              <mesh position={[0, 0.015, 0]}>
                <sphereGeometry args={[0.003, 4, 4]} />
                <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
              </mesh>
            </group>
          )}
          {dec.type === 'trafficlight' && (
            <group position={[0, 0.015, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.0015, 0.0015, 0.03, 4]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
              <mesh position={[0, 0.01, 0.002]}>
                <boxGeometry args={[0.006, 0.015, 0.006]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <mesh position={[0, 0.014, 0.005]}>
                <sphereGeometry args={[0.002, 4, 4]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
              </mesh>
              <mesh position={[0, 0.010, 0.005]}>
                <sphereGeometry args={[0.002, 4, 4]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
              <mesh position={[0, 0.006, 0.005]}>
                <sphereGeometry args={[0.002, 4, 4]} />
                <meshStandardMaterial color="#22c55e" />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

interface SceneProps {
  selectedPlaceId: string | null;
  onSelectPlace: (id: string) => void;
}

function Scene({ selectedPlaceId, onSelectPlace }: SceneProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  
  // Track target position for camera to zoom/pan to
  const targetCameraPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  
  // State for hover to pause controls if needed, but since we disabled auto-rotate
  // we just need to ensure controls don't interfere when moving camera programmatically
  const isAnimating = useRef(false);

  useEffect(() => {
    if (selectedPlaceId) {
      const place = PLACES_WITH_POS.find(p => p.id === selectedPlaceId);
      if (place && place.position) {
        // Calculate a point above the marker for the camera
        const zoomDistance = GLOBE_RADIUS + 1.2;
        const direction = place.position.clone().normalize();
        targetCameraPos.current = direction.clone().multiplyScalar(zoomDistance);
        targetLookAt.current = place.position.clone();
        isAnimating.current = true;
      }
    } else {
      // If deselected, we could zoom out slightly or just do nothing
      isAnimating.current = false;
    }
  }, [selectedPlaceId]);

  useFrame((state, delta) => {
    // Smooth camera transition on select
    if (isAnimating.current && targetCameraPos.current && controlsRef.current) {
      camera.position.lerp(targetCameraPos.current, 0.05);
      
      // Update OrbitControls target to look at the marker instead of the center
      // For a globe, looking at the center is usually best, but slightly towards the marker feels better
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.1); 
      
      // If we are close enough to target, stop animating
      if (camera.position.distanceTo(targetCameraPos.current) < 0.1) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <>
      <OrbitControls 
        ref={controlsRef}
        autoRotate={false}
        enablePan={false}
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.05} // Smooth, heavy feeling
        rotateSpeed={0.4} // Reduced sensitivity
        minDistance={GLOBE_RADIUS + 0.5}
        maxDistance={GLOBE_RADIUS + 4}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.9} />
      
      <Environment preset="city" />
      
      {/* The Globe - Pastel Map Theme */}
      <Sphere ref={globeRef} args={[GLOBE_RADIUS, 64, 64]} castShadow receiveShadow>
        <MeshDistortMaterial 
          color="#dce3d0" // Earthy map green/sand
          roughness={0.9} // Matte
          metalness={0.05}
          distort={0.03} // Reduced distortion for a more city-like ground
          speed={0} // No animation on the ground
        />
      </Sphere>

      {/* Procedural Urban Environment (Roads + Clusters) */}
      <UrbanEnvironment radius={GLOBE_RADIUS} />

      {/* Markers */}
      {PLACES_WITH_POS.map(place => (
        <PlaceMarker 
          key={place.id}
          place={place}
          isSelected={selectedPlaceId === place.id}
          onHover={(hovered) => {
            // Can add specific hover logic here if needed
          }}
          onClick={() => {
            onSelectPlace(place.id);
          }}
        />
      ))}
    </>
  );
}

interface InteractiveGlobeProps {
  selectedPlaceId: string | null;
  onSelectPlace: (id: string) => void;
}

export default function InteractiveGlobe({ selectedPlaceId, onSelectPlace }: InteractiveGlobeProps) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, GLOBE_RADIUS + 3], fov: 45 }}>
        <Scene selectedPlaceId={selectedPlaceId} onSelectPlace={onSelectPlace} />
      </Canvas>
    </div>
  );
}

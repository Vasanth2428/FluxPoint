// src/FluxBot.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

const FluxBot = () => {
  const headRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouse = state.pointer; // Mouse x/y (-1 to 1)

    // 1. Look at mouse (Smooth dampening)
    if (headRef.current) {
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.x * 0.5, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.y * 0.5, 0.1);
    }

    // 2. Rings Idle Animation (Gyroscopic motion)
    if (ring1Ref.current) {
        ring1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.5;
        ring1Ref.current.rotation.y += 0.01;
    }
    if (ring2Ref.current) {
        ring2Ref.current.rotation.x = Math.cos(t * 0.4) * 0.5;
        ring2Ref.current.rotation.y -= 0.02;
    }
  });

  return (
    <group>
      <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[0, 0.5]}>
        
        {/* --- THE HEAD --- */}
        <group ref={headRef}>
            
            {/* Main Shell (Glossy White) */}
            <Sphere args={[1, 32, 32]}>
                <meshPhysicalMaterial 
                    color="#e2e8f0" 
                    roughness={0.2} 
                    metalness={0.1} 
                    clearcoat={1} 
                />
            </Sphere>

            {/* The "Face" / Visor (Black Glass) */}
            <group position={[0, 0, 0.85]}>
                <Sphere args={[0.35, 32, 32]} scale={[1.2, 0.8, 0.5]}>
                    <meshBasicMaterial color="#000" />
                </Sphere>
            </group>

            {/* The Glowing Eye (Signal Orange) */}
            <mesh position={[0, 0, 0.98]}>
                <circleGeometry args={[0.12, 32]} />
                <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>
            {/* Eye Light */}
            <pointLight position={[0, 0, 1.5]} color="#f59e0b" intensity={5} distance={3} />

            {/* Side "Ears" / Antennas */}
            <Box args={[0.2, 0.6, 0.6]} position={[0.9, 0, 0]}>
                <meshStandardMaterial color="#333" />
            </Box>
            <Box args={[0.2, 0.6, 0.6]} position={[-0.9, 0, 0]}>
                <meshStandardMaterial color="#333" />
            </Box>
        </group>

        {/* --- FLOATING GYRO RINGS --- */}
        <group ref={ring1Ref}>
            <Torus args={[1.4, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} toneMapped={false} />
            </Torus>
        </group>

        <group ref={ring2Ref}>
            <Torus args={[1.7, 0.015, 16, 100]} rotation={[0, 0, 0]}>
                <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.2} />
            </Torus>
        </group>

      </Float>
    </group>
  );
};

export default FluxBot;
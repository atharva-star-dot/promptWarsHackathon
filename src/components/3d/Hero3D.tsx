import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedGlobe: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <MeshDistortMaterial
          color="#4F46E5"
          wireframe
          distort={0.25}
          speed={2}
          roughness={0.2}
          emissive="#6366F1"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
};

export const Hero3D: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) setReducedMotion(true);

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const hasWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setWebGLSupported(hasWebGL);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  if (reducedMotion || !webGLSupported) {
    return (
      <div className="w-full h-48 md:h-64 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-cyan-900/40 border border-indigo-500/20 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_70%)]"></div>
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-3 animate-pulse">
          🌐
        </div>
        <h3 className="text-xl font-bold text-white">CityPulse Urban Intelligence</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          Explore real-world city analytics, live weather, safety metrics, and community insights.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-48 md:h-64 rounded-3xl relative overflow-hidden bg-[#0F172A]/40 border border-slate-800/80 shadow-2xl">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} color="#06B6D4" intensity={1} />
        <AnimatedGlobe />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent"></div>
    </div>
  );
};

export default Hero3D;

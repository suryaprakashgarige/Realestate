"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function FloatingObject() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.3}
          distortionScale={0.5}
          temporalDistortion={0.2}
          clearcoat={1}
          attenuationDistance={1.2}
          attenuationColor="#ffffff"
          color="#1a1a1a"
        />
      </mesh>
    </Float>
  );
}

export default function SplineHero() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-bg z-0">
        <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxury-mansion-34571-large.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30" 
          style={{ zIndex: 0 }} 
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-bg">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-bg via-transparent to-bg pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="w-full h-full"
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F5C518" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
          <pointLight position={[0, 0, 2]} intensity={1} color="#3B82F6" />
          
          <FloatingObject />
          
          <Environment preset="night" />
        </Canvas>
      </motion.div>

      {/* Luxury Ambient Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,10,10,0.4)_70%)]" />
      </div>
    </div>
  );
}

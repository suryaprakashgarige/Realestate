"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uDispIntensity;
  uniform float uTime;

  void main() {
    vec2 uv = vUv;
    float displacement = sin(uv.y * 10.0 + uTime) * uDispIntensity;
    uv.x += displacement;
    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
  }
`;

function DisplacementMesh({
  src,
  isHovered,
}: {
  src: string;
  isHovered: boolean;
}) {
  const texture = useLoader(THREE.TextureLoader, src);
  const uniforms = useRef({
    uTexture: { value: texture },
    uDispIntensity: { value: 0.0 },
    uTime: { value: 0.0 },
  });

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.getElapsedTime();
  });

  // Animate the uniform — NOT mount/unmount the Canvas
  useEffect(() => {
    gsap.to(uniforms.current.uDispIntensity, {
      value: isHovered ? 0.05 : 0.0,
      duration: isHovered ? 0.5 : 0.3,
      ease: isHovered ? "power2.out" : "power2.in",
    });
  }, [isHovered]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
}

export default function LiquidImage({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={src} 
          alt="Listing" 
          className="w-full h-full object-cover" 
          style={{ 
            transform: isHovered ? "scale(1.03)" : "scale(1)", 
            transition: "transform 0.4s ease" 
          }} 
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Static base image */}
      <img src={src} alt="Listing" className="w-full h-full object-cover" />

      {/* Canvas always mounted — preserves WebGL context across hovers */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Suspense fallback={null}>
          <Canvas
            gl={{ alpha: true, antialias: false }}
            style={{ background: "transparent" }}
            camera={{ position: [0, 0, 1] }}
          >
            <DisplacementMesh src={src} isHovered={isHovered} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}

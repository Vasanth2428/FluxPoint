import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const DroneProbe = ({ targetPosition = [0, 0, 0] }) => {
  const meshRef = useRef();
  // Using a ref to track current position for smooth interpolation
  const currentPos = useRef(new THREE.Vector3(targetPosition[0], 1.0, targetPosition[2]));

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const target = new THREE.Vector3(targetPosition[0], 1.0, targetPosition[2]);

    // Z-Axis Fix: We calculate velocity to determine the tilt
    const velocityX = (target.x - currentPos.current.x);

    // Smoothly interpolate position
    currentPos.current.lerp(target, 0.15);
    meshRef.current.position.copy(currentPos.current);

    // Apply a subtle, professional tilt (clamped to 0.2 radians)
    const tiltAmount = THREE.MathUtils.clamp(-velocityX * 0.5, -0.2, 0.2);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, tiltAmount, 0.1);
  });

  return (
    <group ref={meshRef}>
      {/* Matte Industrial Body */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.2, 0.7]} />
        <meshStandardMaterial color="#2d2d30" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Status Indicator LED */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <pointLight distance={3} intensity={4} color="#22d3ee" />
    </group>
  );
};

const PrecisionPath = ({ points, color, opacity = 1, width = 0.04 }) => {
  const curve = useMemo(() => {
    if (!points || points.length < 2) return null;
    const vectors = points.map(p => new THREE.Vector3(p.x, 0.02, p.y));
    return new THREE.CatmullRomCurve3(vectors);
  }, [points]);

  if (!curve) return null;

  return (
    <mesh>
      <tubeGeometry args={[curve, 128, width, 8, false]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.2} // Subdued glow for professionalism
      />
    </mesh>
  );
};

const NoiseCloud = ({ data }) => {
  const vertices = useMemo(() => {
    const pts = [];
    data.forEach(d => {
      if (d.noisy_x !== undefined && d.noisy_y !== undefined) {
        pts.push(d.noisy_x, 0.05, d.noisy_y);
      }
    });
    return new Float32Array(pts);
  }, [data]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={vertices.length / 3} array={vertices} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.7} // Phase 1: Increased size for visibility
        color="#ef4444"
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const SceneController = ({ viewMode, lastPoint }) => {
  const controlsRef = useRef();

  useFrame((state) => {
    if (!controlsRef.current) return;

    if (viewMode === 'top') {
      const targetPos = new THREE.Vector3(lastPoint.pred_x, 0, lastPoint.pred_y);
      state.camera.position.lerp(new THREE.Vector3(targetPos.x, 80, targetPos.z), 0.05);
      state.camera.lookAt(targetPos);
      controlsRef.current.target.lerp(targetPos, 0.1);
    } else {
      // Follow Mode
      const targetPos = new THREE.Vector3(lastPoint.pred_x, 0, lastPoint.pred_y);
      controlsRef.current.target.lerp(targetPos, 0.1);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={false}
    />
  );
};

const Flux3D = ({ data = [], showNoise, viewMode }) => {
  const lastPoint = data.length > 0 ? data[data.length - 1] : { pred_x: 0, pred_y: 0 };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ position: [30, 30, 30], fov: 45 }}>
        <color attach="background" args={['#121214']} />
        <fog attach="fog" args={['#121214', 20, 90]} />

        <SceneController viewMode={viewMode} lastPoint={lastPoint} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />

        <Grid
          infiniteGrid
          fadeDistance={50}
          sectionColor="#333"
          cellColor="#222"
          position={[0, -0.01, 0]}
          sectionSize={5}
        />

        {/* Academic Axes: RGB = XYZ */}
        <primitive object={new THREE.AxesHelper(5)} position={[0, 0.1, 0]} />

        {/* AI Estimation (Teal) */}
        <PrecisionPath points={data.map(d => ({ x: d.pred_x, y: d.pred_y }))} color="#22d3ee" width={0.05} />

        {/* Ground Truth (Slate) */}
        <PrecisionPath points={data.map(d => ({ x: d.truth_x, y: d.truth_y }))} color="#94a3b8" opacity={0.3} width={0.03} />

        {showNoise && <NoiseCloud data={data} />}

        <DroneProbe targetPosition={[lastPoint.pred_x, 0, lastPoint.pred_y]} />

        <EffectComposer multisampling={4}>
          <Bloom luminanceThreshold={1} intensity={0.3} radius={0.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Flux3D;
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Snowfall background — a nod to Jammu & Kashmir ❄️
 *
 * A GPU particle field rendered with Three.js. Soft sprite flakes are spread
 * through a real depth volume, so perspective makes near flakes large/bright and
 * far ones tiny/dim. The camera parallax-tilts the whole field as the cursor
 * moves, and cursor *speed* ramps the intensity: more flakes, faster fall, and
 * a horizontal "wind" that pushes the snow — all easing back to a calm drift.
 */
export default function Snowfall() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // ---- Soft round snowflake sprite (radial gradient) -------------------
    const makeFlakeTexture = () => {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const g = c.getContext('2d')!;
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.25, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.35)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const flakeTexture = makeFlakeTexture();

    // ---- Visible volume bounds ------------------------------------------
    let halfH = Math.tan((camera.fov / 2) * (Math.PI / 180)) * camera.position.z;
    let halfW = halfH * camera.aspect;
    const Z_NEAR = 25;   // closest to camera
    const Z_FAR = -50;   // furthest
    const spanX = () => halfW * 1.6;
    const spanY = () => halfH * 1.5;

    const COUNT = isMobile ? 700 : 1600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    // Per-flake motion data (kept on CPU)
    const vy = new Float32Array(COUNT);      // fall speed
    const swayAmp = new Float32Array(COUNT); // horizontal sway amplitude
    const swaySpd = new Float32Array(COUNT); // sway frequency
    const phase = new Float32Array(COUNT);   // sway phase
    const drift = new Float32Array(COUNT);   // wind susceptibility (bigger near flakes drift more)

    const setDepthColor = (i: number, z: number) => {
      // Nearer (z high) -> brighter; far -> dimmer, faking atmospheric depth.
      const t = (z - Z_FAR) / (Z_NEAR - Z_FAR); // 0..1
      const b = 0.45 + t * 0.55;
      colors[i * 3] = b;
      colors[i * 3 + 1] = b;
      colors[i * 3 + 2] = b;
    };

    const seedFlake = (i: number, atTop = false) => {
      const z = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      positions[i * 3] = (Math.random() * 2 - 1) * spanX();
      positions[i * 3 + 1] = atTop ? spanY() : (Math.random() * 2 - 1) * spanY();
      positions[i * 3 + 2] = z;
      vy[i] = 0.06 + Math.random() * 0.12;
      swayAmp[i] = 0.15 + Math.random() * 0.5;
      swaySpd[i] = 0.5 + Math.random() * 1.2;
      phase[i] = Math.random() * Math.PI * 2;
      drift[i] = 0.3 + Math.random() * 1.0;
      setDepthColor(i, z);
    };
    for (let i = 0; i < COUNT; i++) seedFlake(i);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.1,
      map: flakeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      depthTest: false,
      sizeAttenuation: true,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Start with only a fraction visible; intensity ramps the draw range up.
    const baseVisible = Math.round(COUNT * (isMobile ? 0.45 : 0.5));
    geometry.setDrawRange(0, baseVisible);

    // ---- Interaction state ----------------------------------------------
    const mouse = { x: width / 2, y: height / 2 };
    let lastMouseX = mouse.x;
    let lastMouseY = mouse.y;
    let intensity = 0; // 0..1
    let windX = 0;     // world-space horizontal wind
    let camTX = 0, camTY = 0; // parallax targets

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      camTX = (e.clientX / width) * 2 - 1;
      camTY = -((e.clientY / height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      halfH = Math.tan((camera.fov / 2) * (Math.PI / 180)) * camera.position.z;
      halfW = halfH * camera.aspect;
    };
    window.addEventListener('resize', handleResize);

    let animationId = 0;
    let last = performance.now();

    const render = () => {
      const isLight = document.documentElement.classList.contains('light');
      // Dark theme: pure white snow. Light theme: cool blue-grey so it reads.
      material.color.setRGB(isLight ? 0.62 : 1, isLight ? 0.72 : 1, isLight ? 0.86 : 1);

      const fallMul = 1 + intensity * 2.6;
      const sx = spanX();
      const sy = spanY();
      const pos = geometry.attributes.position.array as Float32Array;

      const visible = Math.min(
        COUNT,
        Math.round(baseVisible + (COUNT - baseVisible) * intensity)
      );
      geometry.setDrawRange(0, visible);

      for (let i = 0; i < visible; i++) {
        phase[i] += 0.016 * swaySpd[i];
        pos[i * 3 + 1] -= vy[i] * fallMul;                       // fall
        pos[i * 3] += Math.sin(phase[i]) * swayAmp[i] * 0.05     // gentle sway
          + windX * drift[i];                                    // cursor wind

        // Recycle off-screen flakes back to the top.
        if (pos[i * 3 + 1] < -sy) {
          pos[i * 3 + 1] = sy;
          pos[i * 3] = (Math.random() * 2 - 1) * sx;
        }
        if (pos[i * 3] > sx) pos[i * 3] = -sx;
        else if (pos[i * 3] < -sx) pos[i * 3] = sx;
      }
      geometry.attributes.position.needsUpdate = true;

      // Camera parallax + subtle field tilt for real 3D depth feel.
      camera.position.x += (camTX * 8 - camera.position.x) * 0.04;
      camera.position.y += (camTY * 5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      points.rotation.y += (camTX * 0.12 - points.rotation.y) * 0.03;
      points.rotation.x += (-camTY * 0.06 - points.rotation.x) * 0.03;

      renderer.render(scene, camera);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const now = performance.now();
      if (now - last < 15) return; // ~60fps cap
      last = now;

      // Cursor velocity -> intensity (with decay) + wind.
      const dx = mouse.x - lastMouseX;
      const dy = mouse.y - lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      intensity = Math.min(1, intensity * 0.95 + Math.min(speed / 130, 1) * 0.22);
      windX += ((dx / width) * 6 * intensity - windX) * 0.06;
      lastMouseX = mouse.x;
      lastMouseY = mouse.y;

      render();
    };

    if (reduceMotion) {
      geometry.setDrawRange(0, baseVisible);
      render();
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      flakeTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

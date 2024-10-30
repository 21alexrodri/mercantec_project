import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const JobPreview = ({ modelPath }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080); // Fondo gris

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xbfbfbf, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new STLLoader();

    // URL completa al archivo STL en el servidor
    const absolutePath = modelPath;
    console.log("Attempting to load model from:", absolutePath);

    loader.load(
      absolutePath,
      (geometry) => {
        try {
          // Comprobar si el STL tiene colores
          const material = geometry.hasColors
            ? new THREE.MeshStandardMaterial({ vertexColors: true })
            : new THREE.MeshStandardMaterial({ color: 0x4F4F4F }); 
          
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          // Centrar la cámara en el objeto 3D
          const boundingBox = new THREE.Box3().setFromObject(mesh);
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          mesh.position.sub(center);

          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
          
          camera.position.set(center.x, center.y, distance);
          camera.lookAt(center);
          controls.target.copy(center);

        } catch (error) {
          console.error('Error processing STL geometry:', error);
        }
      },
      undefined,
      (error) => {
        console.error(`Error loading STL at ${absolutePath}:`, error);
      }
    );

    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden' }}></div>;
};

export default JobPreview;

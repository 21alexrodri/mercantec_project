// job_preview.jsx
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const JobPreview = ({ modelPath }) => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const previewElement = document.getElementById('3d-preview');
    
    // Solo agregar el renderizador si el elemento está disponible
    if (previewElement) {
      previewElement.appendChild(renderer.domElement);
    }

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const loader = new STLLoader();
    loader.load(modelPath, function (geometry) {
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Función de limpieza: remover el renderizador solo si el elemento existe
    return () => {
      if (previewElement && renderer.domElement) {
        previewElement.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  return <div id="3d-preview" style={{ width: '100%', height: '100%' }}></div>;
};

export default JobPreview;

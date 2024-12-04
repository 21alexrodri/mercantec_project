import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
/**
 * A component to show a preview of a 3D model
 * @param {modelPath} the path of the model to be shown
 * @param {fileColor} the color of the model 
 * @returns a preview of the model
 */
const JobPreview = ({ modelPath, fileColor }) => {
  const mountRef = useRef(null);
  const requestIdRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

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

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 1).normalize();
    scene.add(dirLight);

    scene.add(new THREE.AmbientLight(0xbfbfbf, 0.5));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const absolutePath = modelPath;
    //console.log("Attempting to load model from:", absolutePath);

    /**
     * Loads the model into the scene
     * @returns The model loaded into the scene
     */
    const loadModel = () => {
      const extension = modelPath.split('.').pop().toLowerCase();
      let loader;

      if (extension === 'stl') {
        loader = new STLLoader();
      } else if (extension === '3mf') {
        loader = new ThreeMFLoader();
      } else {
        console.error('Unsupported file type:', extension);
        return;
      }

      loader.load(
        absolutePath,
        (object) => {
          try {
            const materialColor = new THREE.Color(fileColor || '#808080');
            //console.log('Color aplicado:', materialColor);

            const material = new THREE.MeshPhongMaterial({
              color: materialColor,
              specular: 0x333333,
              shininess: 50,
            });

            if (object instanceof THREE.Group || object instanceof THREE.Object3D) {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  if (child.geometry) {
                    child.geometry.computeVertexNormals();
                  }
                  child.material = material;
                  child.material.needsUpdate = true;
                }
              });
              scene.add(object);
              centerAndScaleObject(object, camera, controls);
            } else if (object instanceof THREE.BufferGeometry) {
              const mesh = new THREE.Mesh(object, material);
              if (mesh.geometry) {
                mesh.geometry.computeVertexNormals();
              }
              scene.add(mesh);
              centerAndScaleObject(mesh, camera, controls);
            } else {
              console.error('Unsupported object type:', object);
            }
          } catch (error) {
            console.error('Error processing object:', error);
          }
        },
        undefined,
        (error) => {
          console.error(`Error loading model at ${absolutePath}:`, error);
        }
      );
    };

    /**
     * Centers and scales the object in the scene
     * @param {object} the object to be centered and scaled 
     * @param {camera} the camera  
     * @param {controls} the controls 
     */
    const centerAndScaleObject = (object, camera, controls) => {
      const boundingBox = new THREE.Box3().setFromObject(object);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);


      object.position.sub(center);

      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z);
      const padding = 1.4;
      const fov = camera.fov * (Math.PI / 180);
      const distance = (maxDim * padding) / (2 * Math.tan(fov / 2));

      camera.position.set(0, 0, distance);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      controls.target.set(0, 0, 0);
      controls.update();
    };

    loadModel();

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
      requestIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);

      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }

      controls.dispose();
      renderer.dispose();

      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (child.material.isMaterial) {
            child.material.dispose();
          } else if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          }
        }
      });

      scene.clear();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, fileColor]);

  return (
    <div
      id='preview'
      ref={mountRef}
      style={{ width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden' }}
    ></div>
  );
};

export default JobPreview;

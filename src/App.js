import * as THREE from 'three';
import { ARButton, RealityAccelerator } from 'ratk';
import { createWindow } from './components/Window.js';

let scene, camera, renderer, ratk;

export function initializeScene() {
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.getElementById('scene-container').appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // AR Button
  const arButton = document.getElementById('ar-button');
  ARButton.convertToARButton(arButton, renderer, {
    sessionInit: {
      requiredFeatures: ['hit-test', 'plane-detection', 'mesh-detection', 'anchors'],
      optionalFeatures: []
    }
  });

  // Reality Accelerator Toolkit
  ratk = new RealityAccelerator(renderer.xr);
  scene.add(ratk.root);

  // Handle window resize
  window.addEventListener('resize', onWindowResize);

  // Example window creation
  createWindow(scene);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

export function animate() {
  renderer.setAnimationLoop(() => {
    ratk.update();
    renderer.render(scene, camera);
  });
}


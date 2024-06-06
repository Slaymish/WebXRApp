import { RealityAccelerator } from 'ratk';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let scene, camera, renderer, hand1Box, hand2Box, ratk;

export function initializeScene() {
  console.log('Initializing scene...');

  try {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.setClearColor(0x000000, 0); // Transparent background for passthrough
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // AR Button
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ['hit-test', 'hand-tracking'],
    });
    document.getElementById('enter-ar-button-container').appendChild(arButton);
    console.log('AR Button added.');

    // RATK initialization
    ratk = new RealityAccelerator(renderer.xr);
    scene.add(ratk.root);
    console.log('RATK initialized.');

    // Create hand tracking boxes
    createHandBoxes();
    console.log('Hand boxes created.');

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    console.log('Scene initialized.');
  } catch (error) {
    console.error('Error initializing scene:', error);
  }
}

function onWindowResize() {
  try {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    console.log('Window resized.');
  } catch (error) {
    console.error('Error handling window resize:', error);
  }
}

function createHandBoxes() {
  try {
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    hand1Box = new THREE.Mesh(geometry, material);
    hand2Box = new THREE.Mesh(geometry, material);

    scene.add(hand1Box);
    scene.add(hand2Box);
    console.log('Hand boxes added to scene.');
  } catch (error) {
    console.error('Error creating hand boxes:', error);
  }
}

function updateHandTracking() {
  try {
    const session = renderer.xr.getSession();
    if (session) {
      const inputSources = session.inputSources;
      inputSources.forEach((inputSource) => {
        if (inputSource.hand) {
          const wrist = inputSource.hand.get('wrist');
          if (wrist && wrist.length > 0) {
            const wristJoint = wrist[0];
            const handPosition = new THREE.Vector3().setFromMatrixPosition(wristJoint.targetRaySpace.matrixWorld);

            if (inputSource === renderer.xr.getController(0)) {
              hand1Box.position.copy(handPosition);
              console.log('Updated hand1Box position.');
            } else if (inputSource === renderer.xr.getController(1)) {
              hand2Box.position.copy(handPosition);
              console.log('Updated hand2Box position.');
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error updating hand tracking:', error);
  }
}

export function animate() {
  renderer.setAnimationLoop(() => {
    try {
      updateHandTracking();
      ratk.update();
      renderer.render(scene, camera);
    } catch (error) {
      console.error('Error in animation loop:', error);
    }
  });
}

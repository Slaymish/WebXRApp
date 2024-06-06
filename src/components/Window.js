import * as THREE from 'three';

export function createWindow(scene) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);

  // Position the plane
  plane.position.set(0, 0, -3);

  // Add plane to the scene
  scene.add(plane);
}


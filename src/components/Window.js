import * as THREE from 'three';

export function createWindow(scene, position = { x: 0, y: 0, z: -3 }) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);

  plane.position.set(position.x, position.y, position.z);
  scene.add(plane);

  return plane;
}


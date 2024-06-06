/* eslint-disable sort-imports */
/* eslint-disable no-unused-vars */
/**
 * Custom App: Spatial UI Test Zone
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './styles/index.css';

import { Clock, DoubleSide, MeshBasicMaterial, SkeletonHelper } from 'three';
import { PlayerComponent, PlayerSystem } from './player';
import { SpinComponent, SpinSystem } from './spin';

import { World } from 'elics';
import { RealityAccelerator } from 'ratk';
import { GlobalComponent } from './global';
import { InlineSystem } from './landing';
import { setupScene } from './scene';
import { SpawnSystem } from './spawner';

const world = new World();
world
    .registerComponent(GlobalComponent)
    .registerComponent(PlayerComponent)
    .registerComponent(SpinComponent)
    .registerSystem(PlayerSystem)
    .registerSystem(SpawnSystem)
    .registerSystem(SpinSystem)
    .registerSystem(InlineSystem);
const clock = new Clock();

console.log('Execution order:', ...world.getSystems());

const { scene, camera, renderer } = setupScene();
const ratk = new RealityAccelerator(renderer.xr);
ratk.onPlaneAdded = (plane) => {
    const mesh = plane.planeMesh;
    mesh.material = new MeshBasicMaterial({
        transparent: true,
        opacity: 0.3,
        color: Math.random() * 0xffffff,
        side: DoubleSide,
    });
};
scene.add(ratk.root);

renderer.xr.addEventListener('sessionstart', () => {
    setTimeout(() => {
        if (ratk.planes.size == 0) {
            renderer.xr
                .getSession()
                .initiateRoomCapture()
                .then(() => {
                    console.log('room capture complete');
                });
        }
    }, 5000);

    // Enable hand tracking
    const session = renderer.xr.getSession();
    session.requestReferenceSpace('local').then((refSpace) => {
        session.requestAnimationFrame((time, frame) => {
            const inputSources = session.inputSources;
            for (const inputSource of inputSources) {
                if (inputSource.hand) {
                    const skeletonHelper = new SkeletonHelper(inputSource.hand);
                    skeletonHelper.material.linewidth = 2;
                    scene.add(skeletonHelper);
                }
            }
        });
    });
});

world
    .createEntity()
    .addComponent(GlobalComponent, { renderer, camera, scene, ratk });

renderer.setAnimationLoop(function () {
    ratk.update();

    const delta = clock.getDelta();
    const time = clock.elapsedTime;
    world.update(delta, time);

    renderer.render(scene, camera);
});

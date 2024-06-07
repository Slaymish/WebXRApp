/* eslint-disable no-unused-vars */
import { Component, System } from 'elics';
import { Group, Mesh, MeshBasicMaterial, SkeletonHelper, SphereGeometry } from 'three';
import { GlobalComponent } from './global';
import { WindowSystem } from './windows'; // Import WindowSystem

export class PlayerComponent extends Component {}

export class PlayerSystem extends System {
    async _setup(global) {
        const { renderer, camera, scene } = global;
        const hands = {};

        const playerSpace = new Group();
        playerSpace.add(camera);
        this.world.createEntity().addComponent(PlayerComponent, {
            space: playerSpace,
            hands: hands,
            leftWristButton: null
        });

        const session = await renderer.xr.getSession();
        if (session) {
            session.addEventListener('inputsourceschange', () => {
                session.inputSources.forEach((inputSource) => {
                    if (inputSource.hand) {
                        if (!hands[inputSource.handedness]) {
                            const skeletonHelper = new SkeletonHelper(inputSource.hand);
                            skeletonHelper.material.linewidth = 2;
                            scene.add(skeletonHelper);
                            hands[inputSource.handedness] = skeletonHelper;

                            // Add a button on the left wrist
                            if (inputSource.handedness === 'left') {
                                const wristButton = new Mesh(
                                    new SphereGeometry(0.05),
                                    new MeshBasicMaterial({ color: 0xff0000 })
                                );
                                wristButton.position.set(0, 0, -0.1); // Adjust position relative to wrist
                                skeletonHelper.add(wristButton);
                                this.leftWristButton = wristButton;
                            }
                        }
                    }
                });
            });
        } else {
            console.error('XR session not available');
        }
    }

    update() {
        const global = this.getEntities(this.queries.global)[0].getComponent(GlobalComponent);

        const player = this.getEntities(this.queries.player)[0]?.getComponent(PlayerComponent);

        if (!player) {
            this._setup(global);
        } else {
            // Update hands and handle interactions
            Object.values(player.hands).forEach((handHelper) => {
                if (handHelper) {
                    handHelper.update();
                }
            });

            if (player.leftWristButton) {
                // Check for interaction with the left wrist button
                const rightHand = player.hands.right;
                if (rightHand) {
                    // Logic to check if right index finger is touching the left wrist button
                    // If true, call the function to create a new window
                    const rightIndexPosition = rightHand.bones[9].position; // Adjust the index to match right index finger bone
                    if (rightIndexPosition.distanceTo(player.leftWristButton.position) < 0.05) {
                        this._createWindowInFrontOfUser(global, player);
                    }
                }
            }
        }
    }

    _createWindowInFrontOfUser(global, player) {
        const windowSystem = this.world.getSystem(WindowSystem);
        const position = player.space.position.clone();
        position.z -= 1; // Adjust the position to be in front of the user
        const quaternion = player.space.quaternion.clone();
        windowSystem.createWindow(position, quaternion);
    }
}

PlayerSystem.queries = {
    global: { required: [GlobalComponent] },
    player: { required: [PlayerComponent] },
};

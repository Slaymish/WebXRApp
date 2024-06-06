/**
 * Custom App: Spatial UI Test Zone
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, System } from 'elics';
import { Group, SkeletonHelper } from 'three';
import { GlobalComponent } from './global';

export class PlayerComponent extends Component {}

export class PlayerSystem extends System {
    _setup(global) {
        const { renderer, camera, scene } = global;
        const hands = {};

        const playerSpace = new Group();
        playerSpace.add(camera);
        this.world.createEntity().addComponent(PlayerComponent, {
            space: playerSpace,
            hands: hands,
        });

        const session = renderer.xr.getSession();
        session.addEventListener('inputsourceschange', () => {
            session.inputSources.forEach((inputSource) => {
                if (inputSource.hand) {
                    if (!hands[inputSource.handedness]) {
                        const skeletonHelper = new SkeletonHelper(inputSource.hand);
                        skeletonHelper.material.linewidth = 2;
                        scene.add(skeletonHelper);
                        hands[inputSource.handedness] = skeletonHelper;
                    }
                }
            });
        });
    }

    update() {
        const global = this.getEntities(this.queries.global)[0].getComponent(
            GlobalComponent,
        );

        const player = this.getEntities(this.queries.player)[0]?.getComponent(
            PlayerComponent,
        );

        if (!player) {
            this._setup(global);
        } else {
            // Update hands if necessary
            Object.values(player.hands).forEach((handHelper) => {
                if (handHelper) {
                    handHelper.update();
                }
            });
        }
    }
}

PlayerSystem.queries = {
    global: { required: [GlobalComponent] },
    player: { required: [PlayerComponent] },
};

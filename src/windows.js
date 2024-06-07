/* eslint-disable no-unused-vars */
import { Component, System } from 'elics';
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { GlobalComponent } from './global';

export class WindowComponent extends Component {}

export class WindowSystem extends System {
    init() {
        this.windows = [];
    }

    createWindow(position, quaternion) {
        const windowMesh = new Mesh(
            new PlaneGeometry(1, 1),
            new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide })
        );
        windowMesh.position.copy(position);
        windowMesh.quaternion.copy(quaternion);

        const windowEntity = this.world.createEntity();
        windowEntity.addComponent(WindowComponent, { mesh: windowMesh });
        this.windows.push(windowEntity);

        const global = this.getEntities(this.queries.global)[0].getComponent(GlobalComponent);
        global.scene.add(windowMesh);
    }

    update() {
        const global = this.getEntities(this.queries.global)[0].getComponent(GlobalComponent);

        this.windows.forEach((windowEntity) => {
            const windowComponent = windowEntity.getComponent(WindowComponent);
            // Handle movement and interaction logic here
        });
    }
}

WindowSystem.queries = {
    global: { required: [GlobalComponent] },
};

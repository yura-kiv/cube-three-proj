import "./styles/styles.css";
import * as THREE from "three";
import { Viewer } from "./js/viewer";

class App {
  constructor() {
    this.viewer = new Viewer();
    this.createCube();
    this.createPlatform();
  }

  createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(geometry, material);
    this.viewer.scene.add(cube);
    cube.position.y = 2;
    cube.position.x = 0;
    cube.position.z = 0;
    cube.castShadow = true;
    cube.receiveShadow = true;

    this.viewer.addUpdateAction("cube_rotation", () => {
      cube.rotateY(0.01);
    });
  }

  createPlatform() {
    const geometry = new THREE.BoxGeometry(5, 0.2, 5);
    const material = new THREE.MeshStandardMaterial();
    const platform = new THREE.Mesh(geometry, material);
    platform.castShadow = true;
    platform.receiveShadow = true;
    this.viewer.scene.add(platform);

    this.viewer.addUpdateAction("platform_rotation", () => {
      platform.rotateY(-0.001);
    });
  }
}

const app = new App();

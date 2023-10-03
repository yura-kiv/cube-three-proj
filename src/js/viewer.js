import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Viewer {
  constructor() {
    this.createResize();
    this.camera = this.createCamera();
    this.scene = this.createScene();
    this.renderer = this.createRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.createLight(this.scene);
    this.update(this.camera, this.scene, this.renderer);
  }

  updateActionsPool = {};
  resizeActionsPool = {};

  createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20);
    camera.position.z = 5;
    camera.position.y = 5;

    this.addResizeAction("resize_camera", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return camera;
  }

  createScene() {
    const scene = new THREE.Scene();
    return scene;
  }

  createRenderer() {
    if (this.renderer) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      pixelRatio: window.devicePixelRatio,
    });
    renderer.setClearColor(0xfaf0e6);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    this.addResizeAction("resize_renderer", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return renderer;
  }

  createLight(scene) {
    const spotLight = new THREE.SpotLight(0xffffff, 10);
    spotLight.position.set(1, 5, 1);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    const ambientLight = new THREE.AmbientLight(0x404040);
    const pointLight1 = new THREE.PointLight(0xffb02e, 5, 20);
    const pointLight2 = new THREE.PointLight(0xffb03, 5, 20);
    pointLight1.position.set(-4, -2, -4);
    pointLight2.position.set(4, -2, 4);
    scene.add(ambientLight);
    scene.add(pointLight1);
    scene.add(pointLight2);
    scene.add(spotLight);
  }

  addUpdateAction(name, action) {
    this.updateActionsPool[name] = action;
  }

  removeUpdateAction(name) {
    delete this.updateActionsPool[name];
  }

  createResize() {
    window.addEventListener("resize", () => {
      for (var key in this.resizeActionsPool) this.resizeActionsPool[key]();
    });
  }

  addResizeAction(name, action) {
    this.resizeActionsPool[name] = action;
  }

  removeResizeAction(name) {
    delete this.resizePool[name];
  }

  update(camera, scene, renderer) {
    renderer.render(scene, camera);
    for (const key in this.updateActionsPool) this.updateActionsPool[key]();
    requestAnimationFrame(() => this.update(camera, scene, renderer));
  }
}

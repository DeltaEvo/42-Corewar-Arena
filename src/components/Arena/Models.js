import {
  MeshBasicMaterial,
  DoubleSide,
  Shape,
  Mesh,
  ExtrudeGeometry,
  MeshPhongMaterial,
  Object3D
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltf = new GLTFLoader();

function load(loader, path, resourcePath) {
  return new Promise((resolve, reject) => {
    if (resourcePath) loader.setResourcePath(resourcePath);
    loader.load(path, resolve, undefined, reject);
  });
}

function transformGltf(scale = 1) {
  return ({ scene, animations }) => {
    const [object] = scene.children;
    scene.dispose();

    object.traverse(object => {
      if (object.material && object.material.isShaderMaterial) {
        object.material = new MeshBasicMaterial({
          side: DoubleSide,
          depthWrite: false,
          transparent: true,
          map: object.material.map
        });
      }
    });

    object.scale.multiplyScalar(scale);

    return {
      object,
      animations
    };
  };
}

function createHeart() {
  const heartShape = new Shape();
  const x = -5,
    y = -18.4;

  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

  const mesh = new Mesh(
    new ExtrudeGeometry(heartShape, {
      depth: 2,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 0.5
    }),
    new MeshPhongMaterial({
      color: 0,
      side: DoubleSide
    })
  );

  mesh.rotateX(-Math.PI / 2);
  mesh.rotateY(Math.PI / 2);
  mesh.scale.multiplyScalar(1 / 150);

  return new Object3D().add(mesh);
}

export async function loadModels() {
  const [
    ring_blue,
    ring_green,
    ring_red,
    ring_white,
    ring_yellow,
    process
  ] = await Promise.all([
    load(gltf, "/models/ring_blue/scene.gltf", "/models/ring_blue/").then(
      transformGltf(0.125)
    ),
    load(gltf, "/models/ring_green/scene.gltf", "/models/ring_green/").then(
      transformGltf(0.125)
    ),
    load(gltf, "/models/ring_red/scene.gltf", "/models/ring_red/").then(
      transformGltf(0.125)
    ),
    load(gltf, "/models/ring_white/scene.gltf", "/models/ring_white/").then(
      transformGltf(0.125)
    ),
    load(gltf, "/models/ring_yellow/scene.gltf", "/models/ring_yellow/").then(
      transformGltf(0.125)
    ),
    load(gltf, "/models/process.glb")
      .then(transformGltf(0.055))
      .then(({ object }) => object)
  ]);

  return {
    ring_blue,
    ring_green,
    ring_red,
    ring_white,
    ring_yellow,
    process,
    heart: createHeart()
  };
}

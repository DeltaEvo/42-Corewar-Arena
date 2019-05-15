import { MeshBasicMaterial, DoubleSide } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TDSLoader from "three/examples/js/loaders/TDSLoader";

const gltf = new GLTFLoader();
gltf.setResourcePath("/models/");
const tds = new TDSLoader();

function load(loader, path, resourcePath) {
  return new Promise((resolve, reject) => {
    if (resourcePath) loader.setResourcePath(resourcePath);
    loader.load(path, resolve, undefined, reject);
  });
}

function transformGltf(scale) {
  return ({ scene, animations }) => {
    const [object] = scene.children;
    scene.dispose();

    object.traverse(object => {
      if (object.material) {
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

export async function loadModels() {
  const [ring_yellow, process] = await Promise.all([
    load(gltf, "/models/ring_yellow/scene.gltf", "/models/ring_yellow/").then(
      transformGltf(0.125)
    ),
    load(tds, "/process.3ds")
  ]);

  return {
    ring_yellow,
    process
  };
}

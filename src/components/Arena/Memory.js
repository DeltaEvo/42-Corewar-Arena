import {
  Object3D,
  TorusGeometry,
  MeshBasicMaterial,
  Mesh,
  FaceColors,
  Vector2,
  LineBasicMaterial,
  LineSegments,
  CanvasTexture,
  Vector3,
  DoubleSide
} from "three";
import { WireframeGeometry } from "./WireframeGeometry";

const MAJOR = 5;
const MINOR = 1.5;
const RATIO = 2;

const BORDER_COLOR = 0x00ff41;

export const COLORS = [0x33c47f, 0xff6950, 0x4180db, 0xa061d1];

export default class Memory extends Object3D {
  constructor(size, { wireframe = false, colorMode = false } = {}) {
    super();
    this.size = size;
    const size_sqrt = Math.sqrt(size);
    this.majorSegments = size_sqrt / RATIO;
    this.minorSegments = size_sqrt * RATIO;

    this.geometry = this._buildGeometry();

    this.torusMaterial = new MeshBasicMaterial({ vertexColors: FaceColors });
    this.linesMaterial = new LineBasicMaterial({ transparent: true });

    const materials = COLORS.map(color =>
      this._generateMaterials(color)
    ).reduce((c, v) => c.concat(v), [this.torusMaterial]);
    this.add(new Mesh(this.geometry, materials));
    this.add(
      new LineSegments(new WireframeGeometry(this.geometry), this.linesMaterial)
    );

    this.wireframe = wireframe;
    this.colorMode = colorMode;
  }

  _buildGeometry() {
    const geometry = new TorusGeometry(
      MAJOR,
      MINOR,
      this.majorSegments,
      this.minorSegments
    );

    // All face are black by default
    geometry.faces.forEach(face => {
      face.color.setHex(0);
      face.textureIndex = 0;
    });

    // Create uv to map texture on each face
    geometry.faceVertexUvs = [[]];
    for (let i = 0; i < geometry.faces.length; i++) {
      if (i % 2) {
        geometry.faceVertexUvs[0].push([
          new Vector2(1, 0),
          new Vector2(1, 1),
          new Vector2(0, 1)
        ]);
      } else {
        geometry.faceVertexUvs[0].push([
          new Vector2(0, 0),
          new Vector2(1, 0),
          new Vector2(0, 1)
        ]);
      }
    }
    geometry.uvsNeedUpdate = true;

    return geometry;
  }

  _generateMaterials(color) {
    const materials = [];
    for (let i = 0; i < 256; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 32;
      const context = canvas.getContext("2d");
      context.fillStyle = `#${color.toString(16)}`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = `${canvas.height / 3}px sans-serif`;
      context.textAlign = "center";
      context.fillStyle = "white";
      context.fillText(
        `0x${i.toString(16)}`,
        canvas.width / 2,
        canvas.height / 2 + canvas.height / 6
      );
      materials.push(
        new MeshBasicMaterial({
          map: new CanvasTexture(canvas),
          side: DoubleSide
        })
      );
    }
    return materials;
  }

  set wireframe(wireframe) {
    this.torusMaterial.wireframe = wireframe;
    if (wireframe) {
      this.linesMaterial.color.setHex(0);
      this.linesMaterial.opacity = 0.5;
    } else {
      this.linesMaterial.color.setHex(BORDER_COLOR);
      this.linesMaterial.opacity = 1;
    }
    this.torusMaterial.needsUpdate = true;
    this.linesMaterial.needsUpdate = true;
    this._wireframe = wireframe;
  }

  get wireframe() {
    return this._wireframe;
  }

  set colorMode(color) {
    if (color) {
      for (const face of this.geometry.faces) face.materialIndex = 0;
    } else {
      for (const face of this.geometry.faces)
        face.materialIndex = face.textureIndex;
    }
    this.geometry.elementsNeedUpdate = true;
    this._colorMode = color;
  }

  get colorMode() {
    return this._colorMode;
  }

  set(i, color, value) {
    i %= this.size;
    const minor = i % this.majorSegments | 0;
    const major = (i / this.majorSegments) | 0;
    i = minor * this.minorSegments + major;
    const texture = 1 + value + 256 * COLORS.indexOf(color);
    const materialIndex = this.colorMode ? 0 : texture;
    this.geometry.faces[i * 2].color.setHex(color);
    this.geometry.faces[i * 2 + 1].color.setHex(color);
    this.geometry.faces[i * 2].textureIndex = texture;
    this.geometry.faces[i * 2 + 1].textureIndex = texture;
    this.geometry.faces[i * 2].materialIndex = materialIndex;
    this.geometry.faces[i * 2 + 1].materialIndex = materialIndex;
    this.geometry.elementsNeedUpdate = true;
  }

  placeObject(object, i) {
    i %= this.size;
    const minor = ((i % this.majorSegments) / this.majorSegments) * Math.PI * 2;
    const major =
      (((i / this.majorSegments) | 0) / this.minorSegments) * Math.PI * 2;

    const normal = new Vector3(
      MINOR * Math.cos(minor) * Math.cos(major),
      MINOR * Math.cos(minor) * Math.sin(major),
      MINOR * Math.sin(minor)
    );

    if (object) {
      const x = (MAJOR + MINOR * Math.cos(minor)) * Math.cos(major);
      const y = (MAJOR + MINOR * Math.cos(minor)) * Math.sin(major);
      const z = MINOR * Math.sin(minor);

      object.position.set(0, 0, 0);
      object.lookAt(normal);
      object.position.set(x, y, z);
    }

    return normal;
  }
}

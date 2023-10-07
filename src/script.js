import * as THREE from "three";
import GUI from "lil-gui";

THREE.ColorManagement.enabled = false;

/* TEXTURES */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * OBJECTS
 */
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradientTexture });

// meshes
const objectDistance = 4;
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);

mesh1.position.y = objectDistance * -0;
mesh2.position.y = objectDistance * -1;
mesh3.position.y = objectDistance * -2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);
const sectionMeshes = [mesh1, mesh2, mesh3];

/* LIGHT */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  material.color.set(parameters.materialColor);
});
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* Particles count */
const particlesCount = 2000;
const particlesArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  let i3 = i * 3;

  particlesArray[i3 + 0] = (Math.random() - 0.5) * 15;
  particlesArray[i3 + 1] = Math.random() * -15 + 2;
  particlesArray[i3 + 2] = (Math.random() - 0.5) * -20;
}
const particlesAttribute = new THREE.BufferAttribute(particlesArray, 3);
const bufferGemetry = new THREE.BufferGeometry();
bufferGemetry.setAttribute("position", particlesAttribute);
const points = new THREE.Points(
  bufferGemetry,
  new THREE.PointsMaterial({
    size: 0.04,
  })
);
scene.add(points);

/**
 * Camera
 */
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //  by default alpha is 0 czyli całkiem przezroczysta
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* SROLL */
let scrollY = window.scrollY;
window.addEventListener("scroll", (e) => {
  scrollY = window.scrollY;
  //   console.log(window);
});

/* CURSOR*/
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width;
  cursor.y = e.clientY / sizes.height;
});
/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  //   console.log(deltaTime);

  //   Animata camera
  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 1 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 1 * deltaTime;

  //   console.log(cameraGroup.position.x);
  //   console.log(cursor.x);

  //   ANimate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.12;
  }
  //   console.log(mesh1.rotation.x);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

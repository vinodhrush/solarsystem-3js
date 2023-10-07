import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import your texture paths
import starsTexture from './src/stars.jpg';
import saturnTexture from './src/saturn.jpg';
import saturnMoonTexture from './src/saturnMoon.jpg';
import saturnRingTexture from './src/saturn_ring.png';
import sunTexture from './src/sun.png';
import AsteroidTexture from './src/asteroid.jpg';
import sunBumpMapTexture from './src/bump2.jpg'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.2,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-20, 100, 200);
orbit.update();

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // White directional light
directionalLight.position.set(0, 2, 200); // Set the light direction
scene.add(directionalLight);

// Create a skybox
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

// create saturn
const satGeometry = new THREE.SphereGeometry(30, 60, 60);
const satMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(saturnTexture),
    bumpMap: textureLoader.load(sunBumpMapTexture), // Load the bump map texture
    bumpScale: 1.0, // Adjust the bump scale as needed for the desired effect
});
const Saturn = new THREE.Mesh(satGeometry, satMaterial);
Saturn.position.set(100, 0, 0);
scene.add(Saturn);


// Create Saturn's ring
const saturnRingGeometry = new THREE.RingGeometry(40, 75, 250);
const saturnRingMaterial = new THREE.MeshPhongMaterial({ // Use MeshPhongMaterial for the ring
    map: textureLoader.load(saturnRingTexture),
    side: THREE.DoubleSide,
    transparent: true, // Make the ring material transparent
    opacity: 0.8, // Adjust opacity as needed
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
Saturn.add(saturnRing);
saturnRing.rotation.x = Math.PI / 2; // Rotate the rings to be horizontal

// Create Saturn moon
const satMoon = new THREE.SphereGeometry(5, 90, 100);
const saturnMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(saturnMoonTexture)
});
const SaturnMoon = new THREE.Mesh(satMoon, saturnMaterial);
const SaturnMoon2 = new THREE.Mesh(satMoon, saturnMaterial);
const SaturnMoon3 = new THREE.Mesh(satMoon, saturnMaterial);

SaturnMoon.position.set(200, 0, 0);
SaturnMoon2.position.set(-100, 0, 0);
SaturnMoon3.position.set(-100, 0, 100);

Saturn.add(SaturnMoon);
Saturn.add(SaturnMoon2);
Saturn.add(SaturnMoon3);

//add sun
const sunGeometry = new THREE.SphereGeometry(100, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    map:textureLoader.load(sunTexture) });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);


sun.position.set(0, 2, 600)
scene.add(sun);

//Adding asteroids
// Function to create a random asteroid-like particle
function createAsteroid() {
    const asteroidGeometry = new THREE.SphereGeometry(1, 8, 8); // Adjust the size and detail as needed
    const asteroidMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(AsteroidTexture)
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    const theta = Math.random() * Math.PI * 2; // Random angle
    const radius = Math.random() * 255 + 40; // Random radius within the rings
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    // Position the asteroid
    asteroid.position.set(x, 0, z);

    return asteroid;
}

// Create and add randomized asteroids to the scene
const asteroidCount = 100; // Adjust the number of asteroids as needed

for (let i = 0; i < asteroidCount; i++) {
    const asteroid = createAsteroid();
    scene.add(asteroid);
}

// Add rotation animations
function animate() {
    Saturn.rotateY(0.009)
    SaturnMoon.rotateY(0.03)
    SaturnMoon2.rotateY(0.05)
    SaturnMoon3.rotateY(0.07)
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

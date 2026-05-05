import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b1a);
scene.fog = new THREE.FogExp2(0x050b1a, 0.006);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 2.5, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// CSS2 Renderer for floating labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.style.zIndex = '5';
container.appendChild(labelRenderer.domElement);

// Main central crystal - rotating with inner glow
const coreGeo = new THREE.IcosahedronGeometry(0.7, 0);
const coreMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.85 });
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
scene.add(coreMesh);

// Inner floating smaller crystal
const innerCoreGeo = new THREE.IcosahedronGeometry(0.35, 0);
const innerCoreMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x6d28d9, emissiveIntensity: 0.5, metalness: 0.9 });
const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
scene.add(innerCoreMesh);

// Main ring with particles
const ringGeo = new THREE.TorusGeometry(1.2, 0.04, 128, 300);
const ringMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x2563eb, emissiveIntensity: 0.4 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

// Second ring tilted
const ring2Geo = new THREE.TorusGeometry(1.55, 0.03, 128, 300);
const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 0.35 });
const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
ring2.rotation.z = Math.PI / 3;
ring2.rotation.x = 0.9;
scene.add(ring2);

// Particle ring around center
const particleRingCount = 300;
const particleRingGeo = new THREE.BufferGeometry();
const particleRingPos = [];
for (let i = 0; i < particleRingCount; i++) {
    const angle = (i / particleRingCount) * Math.PI * 2;
    const radius = 1.85;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    particleRingPos.push(x, Math.sin(angle * 2) * 0.15, z);
}
particleRingGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleRingPos), 3));
const particleRingMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.03, transparent: true, blending: THREE.AdditiveBlending });
const particleRing = new THREE.Points(particleRingGeo, particleRingMat);
scene.add(particleRing);

// Floating orbs around
const orbMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, emissiveIntensity: 0.35 });
const orbPositions = [
    [-2.1, 1.5, -1.4], [2.2, 1.2, -1.6], [-1.8, -1.5, -1.2], [1.9, -1.3, -1.5],
    [0, 2.1, -2.0], [0, -2.1, -1.8], [2.4, 0.4, 0.6], [-2.3, 0.3, 0.7],
    [1.2, 1.8, -1.0], [-1.3, 1.9, -0.8]
];
const orbs = [];
orbPositions.forEach(pos => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), orbMat);
    sphere.position.set(pos[0], pos[1], pos[2]);
    scene.add(sphere);
    orbs.push(sphere);
});

// Floating tetrahedrons
const tetraMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x7c3aed, emissiveIntensity: 0.25 });
const tetraPos = [[1.6, 1.8, -1.0], [-1.9, 1.5, 0.3], [1.0, -1.7, 1.4], [-0.8, -1.9, 1.2], [0.5, 1.2, 1.8]];
tetraPos.forEach(pos => {
    const tetra = new THREE.Mesh(new THREE.TetrahedronGeometry(0.3), tetraMat);
    tetra.position.set(pos[0], pos[1], pos[2]);
    scene.add(tetra);
});

// Starfield background
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPositions[i*3] = (Math.random() - 0.5) * 250;
    starPositions[i*3+1] = (Math.random() - 0.5) * 150;
    starPositions[i*3+2] = (Math.random() - 0.5) * 100 - 50;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.7 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Floating particles field
const particleCount = 1500;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = [];
for (let i = 0; i < particleCount; i++) {
    const radius = 2.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
    const z = radius * Math.cos(phi);
    particlePositions.push(x, y, z);
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particlePositions), 3));
const particleMat = new THREE.PointsMaterial({ color: 0x4b8eff, size: 0.04, transparent: true, blending: THREE.AdditiveBlending });
const particleField = new THREE.Points(particleGeo, particleMat);
scene.add(particleField);

// Lights setup
const ambientLight = new THREE.AmbientLight(0x1a1a3a);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(3, 5, 4);
scene.add(mainLight);
const fillLight = new THREE.PointLight(0x3b82f6, 0.6);
fillLight.position.set(-2, 1.5, 3);
scene.add(fillLight);
const backLight = new THREE.PointLight(0x8b5cf6, 0.5);
backLight.position.set(0, 0, -4);
scene.add(backLight);
const rimLight = new THREE.PointLight(0xffaa66, 0.4);
rimLight.position.set(1.5, 2, -2.5);
scene.add(rimLight);

// Floating glowing rings around core
const glowRingGeo = new THREE.TorusGeometry(0.92, 0.02, 64, 200);
const glowMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.9 });
const glowRingObj = new THREE.Mesh(glowRingGeo, glowMat);
scene.add(glowRingObj);

// CSS2D floating tech labels
const labels = [
    { text: '⚡ AI | Machine Learning', pos: [2.2, 1.5, 0.8], color: '#bbd7ff' },
    { text: '💻 Full Stack Development', pos: [-2.0, -1.2, 1.5], color: '#aac8ff' },
    { text: '📱 React Native | Firebase', pos: [-2.3, 1.6, -0.9], color: '#c9deff' },
    { text: '🎨 UI/UX Design (Figma)', pos: [1.8, -1.4, 1.2], color: '#e0d4ff' },
    { text: '🔧 ASP.NET | SQL Server', pos: [0.5, 2.2, -1.1], color: '#b8d4ff' }
];

const floatingLabels = [];
labels.forEach((label, idx) => {
    const div = document.createElement('div');
    div.textContent = label.text;
    div.style.cssText = `color:${label.color}; font-size:12px; font-weight:500; background:rgba(0,0,0,0.55); padding:5px 14px; border-radius:25px; backdrop-filter:blur(5px); border:1px solid #3b82f6; white-space:nowrap; font-family:'Inter',sans-serif;`;
    const labelObj = new CSS2DObject(div);
    labelObj.position.set(label.pos[0], label.pos[1], label.pos[2]);
    scene.add(labelObj);
    floatingLabels.push(labelObj);
});

// Animation
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.012;
    
    // Rotate rings
    ring.rotation.z = time * 0.45;
    ring.rotation.x = Math.sin(time * 0.25) * 0.15;
    ring2.rotation.y = time * 0.35;
    ring2.rotation.x = Math.sin(time * 0.4) * 0.2;
    
    // Core pulse and rotation
    const scale = 1 + Math.sin(time * 4.5) * 0.04;
    coreMesh.scale.set(scale, scale, scale);
    innerCoreMesh.rotation.y = time * 0.8;
    innerCoreMesh.rotation.x = time * 0.5;
    
    // Glow ring rotation
    glowRingObj.rotation.x = time * 0.8;
    glowRingObj.rotation.z = time * 0.6;
    particleRing.rotation.y = time * 0.3;
    
    // Floating orbs movement
    orbs.forEach((orb, idx) => {
        orb.position.y += Math.sin(time * 1.1 + idx) * 0.0025;
        orb.position.x += Math.cos(time * 0.8 + idx) * 0.002;
    });
    
    // Rotate fields
    particleField.rotation.y = time * 0.08;
    particleField.rotation.x = Math.sin(time * 0.15) * 0.08;
    stars.rotation.y = time * 0.015;
    
    // Floating labels movement
    floatingLabels.forEach((label, idx) => {
        label.position.x += Math.sin(time * 0.6 + idx) * 0.002;
        label.position.y += Math.cos(time * 0.5 + idx * 0.5) * 0.002;
    });
    
    // Smooth camera movement
    camera.position.x += (Math.sin(time * 0.08) * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (2.3 + Math.sin(time * 0.12) * 0.1 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse parallax and cursor glow
const cursorGlow = document.querySelector('.cursor-glow');
document.body.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    
    // Camera parallax effect
    camera.position.x += (mouseX * 0.25 - (camera.position.x - 0)) * 0.03;
    camera.position.y += (-mouseY * 0.2 - (camera.position.y - 2.3)) * 0.03;
    
    // Cursor glow effect
    if (cursorGlow) {
        cursorGlow.style.left = event.clientX + 'px';
        cursorGlow.style.top = event.clientY + 'px';
    }
});
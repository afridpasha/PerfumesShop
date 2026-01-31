import * as THREE from 'three';

class ChatbotThreeEffects {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = [];
    this.animationId = null;
    
    this.init();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    
    // Add canvas to container
    this.container.appendChild(this.renderer.domElement);
    
    // Create particle system
    this.createParticles();
    
    // Create floating geometries
    this.createFloatingGeometries();
    
    // Start animation
    this.animate();
    
    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Positions
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Colors
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.8);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Sizes
      sizes[i] = Math.random() * 0.1 + 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Add floating animation
          mvPosition.y += sin(time + position.x * 0.5) * 0.1;
          mvPosition.x += cos(time + position.z * 0.3) * 0.05;
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      vertexColors: true
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  createFloatingGeometries() {
    // Create floating geometric shapes
    const geometries = [
      new THREE.TetrahedronGeometry(0.2),
      new THREE.OctahedronGeometry(0.15),
      new THREE.IcosahedronGeometry(0.18)
    ];

    for (let i = 0; i < 8; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.8),
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      
      // Random rotation speed
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.01 + 0.005,
        floatOffset: Math.random() * Math.PI * 2
      };

      this.scene.add(mesh);
      this.particles.push(mesh);
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const time = Date.now() * 0.001;
    
    // Update particle system
    if (this.particleSystem && this.particleSystem.material.uniforms) {
      this.particleSystem.material.uniforms.time.value = time;
      this.particleSystem.rotation.y = time * 0.1;
    }
    
    // Update floating geometries
    this.particles.forEach((particle, index) => {
      // Rotation
      particle.rotation.x += particle.userData.rotationSpeed.x;
      particle.rotation.y += particle.userData.rotationSpeed.y;
      particle.rotation.z += particle.userData.rotationSpeed.z;
      
      // Floating motion
      particle.position.y += Math.sin(time * particle.userData.floatSpeed + particle.userData.floatOffset) * 0.002;
      particle.position.x += Math.cos(time * particle.userData.floatSpeed + particle.userData.floatOffset) * 0.001;
    });
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container) return;
    
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  addMessageEffect(isUser = false) {
    // Create a burst effect when a message is sent
    const burstGeometry = new THREE.SphereGeometry(0.1, 8, 6);
    const burstMaterial = new THREE.MeshBasicMaterial({
      color: isUser ? 0x667eea : 0x4ecdc4,
      transparent: true,
      opacity: 0.8
    });
    
    const burst = new THREE.Mesh(burstGeometry, burstMaterial);
    burst.position.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      2
    );
    
    this.scene.add(burst);
    
    // Animate burst
    const startTime = Date.now();
    const animateBurst = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / 1000; // 1 second animation
      
      if (progress < 1) {
        burst.scale.setScalar(1 + progress * 2);
        burst.material.opacity = 0.8 * (1 - progress);
        requestAnimationFrame(animateBurst);
      } else {
        this.scene.remove(burst);
        burst.geometry.dispose();
        burst.material.dispose();
      }
    };
    
    animateBurst();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    
    // Dispose of geometries and materials
    this.particles.forEach(particle => {
      particle.geometry.dispose();
      particle.material.dispose();
    });
    
    if (this.particleSystem) {
      this.particleSystem.geometry.dispose();
      this.particleSystem.material.dispose();
    }
  }
}

export default ChatbotThreeEffects;
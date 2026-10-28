/**
 * Oltre il Portale - Interactive Portal Vortex Background
 * High performance HTML5 2D Canvas with dimensional particles
 */

(function () {
  const canvas = document.getElementById('portal-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, centerX, centerY;
  let particles = [];
  const PARTICLE_COUNT = 75;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height * 0.42;
  }

  window.addEventListener('resize', resize);
  resize();

  class DimensionalParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      // Distance from center
      this.radius = initial ? Math.random() * Math.max(width, height) * 0.7 : Math.random() * 300 + 100;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (0.003 + Math.random() * 0.007) * (Math.random() > 0.5 ? 1 : -1);
      this.radialSpeed = -0.4 - Math.random() * 0.8; // spiral inwards
      this.size = Math.random() * 2.2 + 0.8;
      this.colorType = Math.random();
      this.opacity = initial ? Math.random() * 0.7 + 0.2 : 0.05;
      this.maxOpacity = Math.random() * 0.65 + 0.35;
      this.glow = Math.random() > 0.5;
    }

    update() {
      this.angle += this.angularSpeed;
      this.radius += this.radialSpeed;

      if (this.opacity < this.maxOpacity) {
        this.opacity += 0.02;
      }

      // If particle reaches the singularity center or escapes out
      if (this.radius <= 15) {
        this.reset(false);
        this.radius = Math.max(width, height) * 0.55;
      }
    }

    draw(ctx) {
      const x = centerX + Math.cos(this.angle) * this.radius;
      const y = centerY + Math.sin(this.angle) * (this.radius * 0.55); // Isometric elliptical squash

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);

      let color;
      if (this.colorType < 0.45) {
        // Cyan abyssal
        color = `rgba(0, 240, 255, ${this.opacity})`;
      } else if (this.colorType < 0.85) {
        // Portal purple
        color = `rgba(157, 78, 221, ${this.opacity})`;
      } else {
        // Golden arcane ember
        color = `rgba(255, 183, 3, ${this.opacity})`;
      }

      ctx.fillStyle = color;
      if (this.glow) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
      }
      ctx.fill();
      ctx.restore();
    }
  }

  // Init particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new DimensionalParticle());
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw central rift glow
    const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 280);
    grad.addColorStop(0, 'rgba(157, 78, 221, 0.16)');
    grad.addColorStop(0.4, 'rgba(0, 240, 255, 0.08)');
    grad.addColorStop(1, 'rgba(5, 6, 11, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 280, 0, Math.PI * 2);
    ctx.fill();

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
})();

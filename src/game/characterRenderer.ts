import { ChickenType, SandeepType } from '../types/game';

export interface SandeepRenderState {
  type: SandeepType;
  healthRatio: number; // 0 to 1
  isPanicked: boolean;
  eyeTargetX?: number; // target to look at (chicken position)
  eyeTargetY?: number;
  blinkTimer?: number;
}

export class CharacterRenderer {
  private static sandeepImg: HTMLImageElement | null = null;
  private static imgLoaded: boolean = false;

  private static initImage() {
    if (typeof window === 'undefined' || CharacterRenderer.sandeepImg) return;
    CharacterRenderer.sandeepImg = new Image();
    CharacterRenderer.sandeepImg.src = `${import.meta.env.BASE_URL}assets/1000025505-removebg-preview.png`;
    CharacterRenderer.sandeepImg.onload = () => {
      CharacterRenderer.imgLoaded = true;
    };
    CharacterRenderer.sandeepImg.onerror = () => {
      if (CharacterRenderer.sandeepImg && !CharacterRenderer.sandeepImg.src.includes('sandeep.svg')) {
        CharacterRenderer.sandeepImg.src = `${import.meta.env.BASE_URL}assets/sandeep.svg`;
      } else {
        CharacterRenderer.imgLoaded = false;
      }
    };
  }

  // Draw Sandeep Pig
  public static drawSandeep(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    angle: number = 0,
    state: SandeepRenderState = { type: 'standard', healthRatio: 1, isPanicked: false }
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const isKing = state.type === 'king';
    const isHelmet = state.type === 'helmet';
    const isHurt = state.healthRatio < 0.6;
    const isCritical = state.healthRatio < 0.3;

    CharacterRenderer.initImage();
    if (CharacterRenderer.imgLoaded && CharacterRenderer.sandeepImg) {
      const s = radius * 2.35;
      ctx.drawImage(CharacterRenderer.sandeepImg, -s / 2, -s / 2, s, s);

      // Damage Overlays
      if (isHurt) {
        ctx.save();
        ctx.translate(radius * 0.35, -radius * 0.15);
        ctx.rotate(0.3);
        ctx.fillStyle = '#e8b87d';
        ctx.fillRect(-radius * 0.2, -radius * 0.07, radius * 0.4, radius * 0.14);
        ctx.fillStyle = '#fce5c8';
        ctx.fillRect(-radius * 0.08, -radius * 0.07, radius * 0.16, radius * 0.14);
        ctx.restore();
      }
      if (isCritical) {
        ctx.fillStyle = 'rgba(74, 20, 140, 0.45)';
        ctx.beginPath();
        ctx.arc(-radius * 0.3, -radius * 0.1, radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
      if (state.isPanicked) {
        // Sweat drop
        ctx.fillStyle = '#64d2ff';
        ctx.beginPath();
        ctx.arc(radius * 0.65, -radius * 0.5, radius * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Helmet or Crown
      if (isHelmet) {
        ctx.fillStyle = '#8a959e';
        ctx.beginPath();
        ctx.arc(0, -radius * 0.35, radius * 0.72, Math.PI, 0);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#5a626a';
        ctx.stroke();

        ctx.fillStyle = '#4c555e';
        ctx.fillRect(-radius * 0.76, -radius * 0.35 - 4, radius * 1.52, 9);
      } else if (isKing) {
        const crownY = -radius * 0.8;
        ctx.fillStyle = '#f5c316';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.45, crownY);
        ctx.lineTo(-radius * 0.45, crownY - radius * 0.35);
        ctx.lineTo(-radius * 0.22, crownY - radius * 0.15);
        ctx.lineTo(0, crownY - radius * 0.42);
        ctx.lineTo(radius * 0.22, crownY - radius * 0.15);
        ctx.lineTo(radius * 0.45, crownY - radius * 0.35);
        ctx.lineTo(radius * 0.45, crownY);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#b88909';
        ctx.stroke();

        ctx.fillStyle = '#d91a2a';
        ctx.beginPath();
        ctx.arc(-radius * 0.22, crownY - radius * 0.15, 3.5, 0, Math.PI * 2);
        ctx.arc(0, crownY - radius * 0.22, 4.5, 0, Math.PI * 2);
        ctx.arc(radius * 0.22, crownY - radius * 0.15, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return;
    }

    // --- LEGS (Stubby bottom legs with black hooves) ---
    const legOffset = radius * 0.45;
    const legW = radius * 0.35;
    const legH = radius * 0.4;

    // Left leg
    ctx.fillStyle = '#5fb815';
    ctx.beginPath();
    ctx.roundRect(-legOffset - legW / 2, radius * 0.65, legW, legH, 6);
    ctx.fill();
    // Left hoof
    ctx.fillStyle = '#221915';
    ctx.beginPath();
    ctx.roundRect(-legOffset - legW / 2, radius * 0.65 + legH * 0.5, legW, legH * 0.5, [0, 0, 5, 5]);
    ctx.fill();
    // Hoof slit
    ctx.fillStyle = '#110b08';
    ctx.fillRect(-legOffset - 1, radius * 0.65 + legH * 0.65, 2, legH * 0.35);

    // Right leg
    ctx.fillStyle = '#5fb815';
    ctx.beginPath();
    ctx.roundRect(legOffset - legW / 2, radius * 0.65, legW, legH, 6);
    ctx.fill();
    // Right hoof
    ctx.fillStyle = '#221915';
    ctx.beginPath();
    ctx.roundRect(legOffset - legW / 2, radius * 0.65 + legH * 0.5, legW, legH * 0.5, [0, 0, 5, 5]);
    ctx.fill();
    // Hoof slit
    ctx.fillStyle = '#110b08';
    ctx.fillRect(legOffset - 1, radius * 0.65 + legH * 0.65, 2, legH * 0.35);

    // --- ARMS (Stubby pig arms with hooves) ---
    const armW = radius * 0.28;
    const armH = radius * 0.38;

    // Left arm
    ctx.save();
    ctx.translate(-radius * 0.9, radius * 0.2);
    ctx.rotate(state.isPanicked ? -0.4 : -0.2);
    ctx.fillStyle = '#65c918';
    ctx.beginPath();
    ctx.roundRect(-armW / 2, -armH / 2, armW, armH, 8);
    ctx.fill();
    ctx.fillStyle = '#221915';
    ctx.beginPath();
    ctx.roundRect(-armW / 2, armH * 0.1, armW, armH * 0.4, [0, 0, 6, 6]);
    ctx.fill();
    ctx.restore();

    // Right arm
    ctx.save();
    ctx.translate(radius * 0.9, radius * 0.2);
    ctx.rotate(state.isPanicked ? 0.4 : 0.2);
    ctx.fillStyle = '#65c918';
    ctx.beginPath();
    ctx.roundRect(-armW / 2, -armH / 2, armW, armH, 8);
    ctx.fill();
    ctx.fillStyle = '#221915';
    ctx.beginPath();
    ctx.roundRect(-armW / 2, armH * 0.1, armW, armH * 0.4, [0, 0, 6, 6]);
    ctx.fill();
    ctx.restore();

    // --- PIG EARS (On top of head) ---
    const earY = -radius * 0.88;
    const earDist = radius * 0.68;
    const earR = radius * 0.32;

    // Left ear
    ctx.fillStyle = '#67cc19';
    ctx.beginPath();
    ctx.arc(-earDist, earY, earR, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#4a990f';
    ctx.stroke();
    // Left ear cavity
    ctx.fillStyle = '#39780b';
    ctx.beginPath();
    ctx.arc(-earDist, earY, earR * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // Right ear
    ctx.fillStyle = '#67cc19';
    ctx.beginPath();
    ctx.arc(earDist, earY, earR, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#4a990f';
    ctx.stroke();
    // Right ear cavity
    ctx.fillStyle = '#39780b';
    ctx.beginPath();
    ctx.arc(earDist, earY, earR * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // --- MAIN ROUND PIG BODY ---
    const bodyGrad = ctx.createRadialGradient(
      -radius * 0.25,
      -radius * 0.25,
      radius * 0.2,
      0,
      0,
      radius
    );
    bodyGrad.addColorStop(0, '#86e42b');
    bodyGrad.addColorStop(0.5, '#6ec91e');
    bodyGrad.addColorStop(0.85, '#58ab14');
    bodyGrad.addColorStop(1, '#44870f');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#39750d';
    ctx.stroke();

    // --- SANDEEP FACE BLEND AREA (Centered on upper body) ---
    // Subtle green-tinted human head structure
    const faceW = radius * 1.05;
    const faceH = radius * 1.15;
    const faceY = -radius * 0.12;

    // Soft head contour with green tint
    const headGrad = ctx.createRadialGradient(
      0,
      faceY - faceH * 0.1,
      faceW * 0.1,
      0,
      faceY,
      faceW * 0.6
    );
    headGrad.addColorStop(0, '#82d936');
    headGrad.addColorStop(0.7, '#6bc222');
    headGrad.addColorStop(1, '#5ca919');

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, faceY, faceW * 0.5, faceH * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- SANDEEP'S STYLED DARK HAIR (Modern quiff / pompadour with neat sides) ---
    ctx.save();
    ctx.fillStyle = '#181412'; // Rich black/dark brown hair
    ctx.beginPath();
    // Hair crest shape
    const hairTopY = faceY - faceH * 0.52;
    ctx.moveTo(-faceW * 0.46, faceY - faceH * 0.18);
    // Left temple
    ctx.bezierCurveTo(
      -faceW * 0.5,
      faceY - faceH * 0.4,
      -faceW * 0.38,
      hairTopY - faceH * 0.18,
      -faceW * 0.1,
      hairTopY - faceH * 0.2
    );
    // Quiff peak & volume
    ctx.bezierCurveTo(
      faceW * 0.15,
      hairTopY - faceH * 0.22,
      faceW * 0.4,
      hairTopY - faceH * 0.08,
      faceW * 0.46,
      faceY - faceH * 0.18
    );
    // Hairline down to forehead
    ctx.bezierCurveTo(
      faceW * 0.3,
      faceY - faceH * 0.3,
      -faceW * 0.2,
      faceY - faceH * 0.32,
      -faceW * 0.46,
      faceY - faceH * 0.18
    );
    ctx.closePath();
    ctx.fill();

    // Hair texture highlights
    ctx.strokeStyle = '#2b231f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, hairTopY - faceH * 0.08, faceW * 0.3, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
    ctx.restore();

    // --- SANDEEP'S EYEBROWS ---
    ctx.fillStyle = '#1a1614';
    const browY = faceY - faceH * 0.15;
    const browW = faceW * 0.24;
    const browH = faceH * 0.065;

    // Left eyebrow
    ctx.save();
    ctx.translate(-faceW * 0.25, browY);
    ctx.rotate(state.isPanicked ? 0.35 : 0.05);
    ctx.beginPath();
    ctx.roundRect(-browW / 2, -browH / 2, browW, browH, 3);
    ctx.fill();
    ctx.restore();

    // Right eyebrow
    ctx.save();
    ctx.translate(faceW * 0.25, browY);
    ctx.rotate(state.isPanicked ? -0.35 : -0.05);
    ctx.beginPath();
    ctx.roundRect(-browW / 2, -browH / 2, browW, browH, 3);
    ctx.fill();
    ctx.restore();

    // --- EYES & TRACKING PUPILS ---
    const eyeY = faceY - faceH * 0.02;
    const eyeX = faceW * 0.24;
    const eyeR = state.isPanicked ? radius * 0.16 : radius * 0.14;

    // Eye whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#352b24';
    ctx.stroke();

    // Pupil tracking logic towards chicken
    let lookDx = 0;
    let lookDy = 0;
    if (state.eyeTargetX !== undefined && state.eyeTargetY !== undefined) {
      const dx = state.eyeTargetX - x;
      const dy = state.eyeTargetY - y;
      const dist = Math.hypot(dx, dy) || 1;
      lookDx = (dx / dist) * (eyeR * 0.45);
      lookDy = (dy / dist) * (eyeR * 0.35);
    }

    if (isCritical) {
      // Dizzy spirals when heavily damaged
      ctx.strokeStyle = '#1a1614';
      ctx.lineWidth = 2;
      [-eyeX, eyeX].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(ex, eyeY, eyeR * 0.6, 0, Math.PI * 1.5);
        ctx.stroke();
      });
    } else {
      // Dark pupils
      ctx.fillStyle = '#1c1511';
      ctx.beginPath();
      ctx.arc(-eyeX + lookDx, eyeY + lookDy, eyeR * 0.55, 0, Math.PI * 2);
      ctx.arc(eyeX + lookDx, eyeY + lookDy, eyeR * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight highlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-eyeX + lookDx - eyeR * 0.15, eyeY + lookDy - eyeR * 0.15, eyeR * 0.2, 0, Math.PI * 2);
      ctx.arc(eyeX + lookDx - eyeR * 0.15, eyeY + lookDy - eyeR * 0.15, eyeR * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- NOSE ---
    ctx.fillStyle = '#4f9415';
    ctx.beginPath();
    ctx.ellipse(0, faceY + faceH * 0.1, faceW * 0.1, faceH * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nostril subtle dots
    ctx.fillStyle = '#32660a';
    ctx.beginPath();
    ctx.arc(-faceW * 0.035, faceY + faceH * 0.11, 1.8, 0, Math.PI * 2);
    ctx.arc(faceW * 0.035, faceY + faceH * 0.11, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // --- SANDEEP'S BEARD & MUSTACHE (Well-groomed trimmed beard) ---
    ctx.fillStyle = '#1a1411';

    // Mustache above mouth
    ctx.beginPath();
    const musY = faceY + faceH * 0.18;
    ctx.ellipse(0, musY, faceW * 0.26, faceH * 0.07, 0, 0, Math.PI);
    ctx.fill();

    // Jawline Beard contour
    ctx.beginPath();
    ctx.moveTo(-faceW * 0.42, faceY + faceH * 0.08);
    // Down side of jaw to chin
    ctx.bezierCurveTo(
      -faceW * 0.42,
      faceY + faceH * 0.4,
      -faceW * 0.25,
      faceY + faceH * 0.48,
      0,
      faceY + faceH * 0.5
    );
    ctx.bezierCurveTo(
      faceW * 0.25,
      faceY + faceH * 0.48,
      faceW * 0.42,
      faceY + faceH * 0.4,
      faceW * 0.42,
      faceY + faceH * 0.08
    );
    // Inner chin cut-out for mouth
    ctx.bezierCurveTo(
      faceW * 0.35,
      faceY + faceH * 0.32,
      -faceW * 0.35,
      faceY + faceH * 0.32,
      -faceW * 0.42,
      faceY + faceH * 0.08
    );
    ctx.closePath();
    ctx.fill();

    // --- MOUTH & SMILE (With white teeth) ---
    const mouthY = faceY + faceH * 0.26;
    if (state.isPanicked) {
      // Panicked wide open mouth "O"
      ctx.fillStyle = '#3a0c0a';
      ctx.beginPath();
      ctx.ellipse(0, mouthY, faceW * 0.16, faceH * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1c0605';
      ctx.stroke();

      // Tongue
      ctx.fillStyle = '#e85c6f';
      ctx.beginPath();
      ctx.arc(0, mouthY + faceH * 0.06, faceW * 0.1, 0, Math.PI);
      ctx.fill();

      // Sweat drop
      ctx.fillStyle = '#64d2ff';
      ctx.beginPath();
      ctx.arc(faceW * 0.4, faceY - faceH * 0.2, radius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Handsome confident broad smile showing upper teeth!
      ctx.fillStyle = '#360906';
      ctx.beginPath();
      ctx.moveTo(-faceW * 0.25, mouthY);
      ctx.quadraticCurveTo(0, mouthY + faceH * 0.18, faceW * 0.25, mouthY);
      ctx.quadraticCurveTo(0, mouthY - faceH * 0.02, -faceW * 0.25, mouthY);
      ctx.closePath();
      ctx.fill();

      // Upper white teeth
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-faceW * 0.2, mouthY);
      ctx.quadraticCurveTo(0, mouthY + faceH * 0.07, faceW * 0.2, mouthY);
      ctx.quadraticCurveTo(0, mouthY - faceH * 0.01, -faceW * 0.2, mouthY);
      ctx.closePath();
      ctx.fill();
      // Teeth segment dividers
      ctx.strokeStyle = '#d5d5d5';
      ctx.lineWidth = 1;
      for (let t = -2; t <= 2; t++) {
        ctx.beginPath();
        ctx.moveTo(t * (faceW * 0.07), mouthY);
        ctx.lineTo(t * (faceW * 0.07), mouthY + faceH * 0.05);
        ctx.stroke();
      }

      // Red lower tongue
      ctx.fillStyle = '#e04c5e';
      ctx.beginPath();
      ctx.ellipse(0, mouthY + faceH * 0.1, faceW * 0.12, faceH * 0.05, 0, 0, Math.PI);
      ctx.fill();
    }

    // --- DAMAGE OVERLAYS (Band-aid, black eye) ---
    if (isHurt) {
      // Band-aid on left cheek
      ctx.save();
      ctx.translate(-faceW * 0.32, faceY + faceH * 0.15);
      ctx.rotate(-0.3);
      ctx.fillStyle = '#e8b87d';
      ctx.fillRect(-radius * 0.18, -radius * 0.06, radius * 0.36, radius * 0.12);
      ctx.fillStyle = '#fce5c8';
      ctx.fillRect(-radius * 0.07, -radius * 0.06, radius * 0.14, radius * 0.12);
      ctx.restore();
    }

    // --- HELMET OR KING CROWN ---
    if (isHelmet) {
      // Construction / Viking metallic helmet
      ctx.fillStyle = '#8a959e';
      ctx.beginPath();
      ctx.arc(0, faceY - faceH * 0.3, radius * 0.68, Math.PI, 0);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#5a626a';
      ctx.stroke();

      // Rim
      ctx.fillStyle = '#4c555e';
      ctx.fillRect(-radius * 0.72, faceY - faceH * 0.3 - 4, radius * 1.44, 9);
    } else if (isKing) {
      // Golden Crown with rubies
      const crownY = hairTopY - faceH * 0.22;
      ctx.fillStyle = '#f5c316';
      ctx.beginPath();
      ctx.moveTo(-radius * 0.45, crownY);
      ctx.lineTo(-radius * 0.45, crownY - radius * 0.35);
      ctx.lineTo(-radius * 0.22, crownY - radius * 0.15);
      ctx.lineTo(0, crownY - radius * 0.42);
      ctx.lineTo(radius * 0.22, crownY - radius * 0.15);
      ctx.lineTo(radius * 0.45, crownY - radius * 0.35);
      ctx.lineTo(radius * 0.45, crownY);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#b88909';
      ctx.stroke();

      // Rubies
      ctx.fillStyle = '#d91a2a';
      ctx.beginPath();
      ctx.arc(-radius * 0.22, crownY - radius * 0.15, 3.5, 0, Math.PI * 2);
      ctx.arc(0, crownY - radius * 0.22, 4.5, 0, Math.PI * 2);
      ctx.arc(radius * 0.22, crownY - radius * 0.15, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw Angry Chickens
  public static drawChicken(
    ctx: CanvasRenderingContext2D,
    type: ChickenType,
    x: number,
    y: number,
    radius: number,
    angle: number = 0,
    abilityActive: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    switch (type) {
      case 'red':
        this.drawRedChicken(ctx, radius);
        break;
      case 'chuck':
        this.drawChuckChicken(ctx, radius, abilityActive);
        break;
      case 'blues':
        this.drawBluesChicken(ctx, radius);
        break;
      case 'bomb':
        this.drawBombChicken(ctx, radius, abilityActive);
        break;
      case 'matilda':
        this.drawMatildaChicken(ctx, radius);
        break;
      case 'silver':
        this.drawSilverChicken(ctx, radius, abilityActive);
        break;
      default:
        this.drawRedChicken(ctx, radius);
        break;
    }

    ctx.restore();
  }

  // RED CHICKEN (Cluck / Leader) - Enhanced High-Fidelity Graphics
  private static drawRedChicken(ctx: CanvasRenderingContext2D, r: number) {
    // Tail feathers (3 dynamic layered black feathers with outline)
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.85, -r * 0.1);
    ctx.lineTo(-r * 1.5, -r * 0.38);
    ctx.lineTo(-r * 1.32, -r * 0.08);
    ctx.lineTo(-r * 1.6, 0.08);
    ctx.lineTo(-r * 1.28, 0.2);
    ctx.lineTo(-r * 1.45, 0.36);
    ctx.lineTo(-r * 0.85, 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#09090b';
    ctx.stroke();

    // Crest feathers on head (2 fluid organic tufts)
    const crestGrad = ctx.createLinearGradient(0, -r * 1.55, 0, -r * 0.8);
    crestGrad.addColorStop(0, '#f87171');
    crestGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = crestGrad;
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -r * 0.92);
    ctx.quadraticCurveTo(-r * 0.35, -r * 1.52, -r * 0.65, -r * 1.45);
    ctx.quadraticCurveTo(-r * 0.2, -r * 1.15, -r * 0.05, -r * 0.98);
    ctx.quadraticCurveTo(r * 0.1, -r * 1.56, -r * 0.08, -r * 1.62);
    ctx.quadraticCurveTo(r * 0.3, -r * 1.2, r * 0.22, -r * 0.92);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#991b1b';
    ctx.stroke();

    // Main red spherical body with rich 3D sphere gradient
    const bodyGrad = ctx.createRadialGradient(-r * 0.32, -r * 0.32, r * 0.08, 0, 0, r);
    bodyGrad.addColorStop(0, '#ff5252');
    bodyGrad.addColorStop(0.35, '#ef233c');
    bodyGrad.addColorStop(0.75, '#c9182b');
    bodyGrad.addColorStop(1, '#660713');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3.2;
    ctx.strokeStyle = '#4a040d';
    ctx.stroke();

    // Glossy 3D specular highlight arc on forehead
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.25, r * 0.58, -Math.PI * 0.75, -Math.PI * 0.3);
    ctx.stroke();
    ctx.restore();

    // Soft warm cream belly with feathered curve
    const bellyGrad = ctx.createLinearGradient(0, r * 0.1, 0, r * 0.95);
    bellyGrad.addColorStop(0, '#fff4e6');
    bellyGrad.addColorStop(1, '#fed7aa');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.ellipse(r * 0.1, r * 0.44, r * 0.58, r * 0.44, 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#e0a96d';
    ctx.stroke();

    // Detailed side wing feather with layered feathers
    ctx.save();
    ctx.fillStyle = '#b91c1c';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, 0.05);
    ctx.quadraticCurveTo(-r * 0.82, 0.15, -r * 0.85, 0.42);
    ctx.quadraticCurveTo(-r * 0.7, 0.58, -r * 0.45, 0.54);
    ctx.quadraticCurveTo(-r * 0.28, 0.48, -r * 0.35, 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Inner wing line
    ctx.beginPath();
    ctx.moveTo(-r * 0.72, 0.28);
    ctx.quadraticCurveTo(-r * 0.55, 0.38, -r * 0.4, 0.36);
    ctx.stroke();
    ctx.restore();

    // Dark feather spots on cheeks
    ctx.fillStyle = '#831843';
    ctx.beginPath();
    ctx.arc(-r * 0.62, r * 0.12, r * 0.07, 0, Math.PI * 2);
    ctx.arc(-r * 0.52, r * 0.26, r * 0.05, 0, Math.PI * 2);
    ctx.arc(r * 0.62, r * 0.12, r * 0.07, 0, Math.PI * 2);
    ctx.arc(r * 0.52, r * 0.26, r * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Big expressive cartoon eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.26, -r * 0.05, r * 0.26, 0, Math.PI * 2);
    ctx.arc(r * 0.26, -r * 0.05, r * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#18181b';
    ctx.stroke();

    // Focused black pupils
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(-r * 0.17, -r * 0.04, r * 0.13, 0, Math.PI * 2);
    ctx.arc(r * 0.17, -r * 0.04, r * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // Dual catchlight reflections
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.21, -r * 0.09, r * 0.05, 0, Math.PI * 2);
    ctx.arc(r * 0.13, -r * 0.09, r * 0.05, 0, Math.PI * 2);
    ctx.arc(-r * 0.14, -r * 0.01, r * 0.025, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.01, r * 0.025, 0, Math.PI * 2);
    ctx.fill();

    // Fierce Iconic Angry Eyebrows (Sculpted heavy V-brow)
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.03);
    ctx.lineTo(-r * 0.74, -r * 0.24);
    ctx.lineTo(-r * 0.74, -r * 0.46);
    ctx.lineTo(-r * 0.08, -r * 0.15);
    ctx.lineTo(r * 0.08, -r * 0.15);
    ctx.lineTo(r * 0.74, -r * 0.46);
    ctx.lineTo(r * 0.74, -r * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Beak (Sharp bright sculpted golden bill)
    const beakGrad = ctx.createLinearGradient(0, -r * 0.05, 0, r * 0.4);
    beakGrad.addColorStop(0, '#fef08a');
    beakGrad.addColorStop(0.35, '#facc15');
    beakGrad.addColorStop(1, '#ea580c');
    ctx.fillStyle = beakGrad;

    ctx.beginPath();
    ctx.moveTo(-r * 0.24, 0);
    ctx.lineTo(r * 0.24, 0);
    ctx.lineTo(0, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#9a3412';
    ctx.stroke();

    // Beak split seam & nostrils
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(-r * 0.14, r * 0.12, r * 0.28, 2.2);
    ctx.beginPath();
    ctx.arc(-r * 0.07, r * 0.05, 1.8, 0, Math.PI * 2);
    ctx.arc(r * 0.07, r * 0.05, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // CHUCK (Yellow Triangle - Speedster) - Enhanced High-Fidelity Graphics
  private static drawChuckChicken(ctx: CanvasRenderingContext2D, r: number, boosted: boolean) {
    if (boosted) {
      // Speed dash flame aura & streaks
      ctx.save();
      const auraGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.0);
      auraGrad.addColorStop(0, 'rgba(255, 235, 59, 0.7)');
      auraGrad.addColorStop(0.5, 'rgba(255, 112, 67, 0.45)');
      auraGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Trailing speed lines behind
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-r * 1.3, -r * 0.45);
      ctx.lineTo(-r * 2.2, -r * 0.45);
      ctx.moveTo(-r * 1.4, 0);
      ctx.lineTo(-r * 2.5, 0);
      ctx.moveTo(-r * 1.3, r * 0.45);
      ctx.lineTo(-r * 2.2, r * 0.45);
      ctx.stroke();
      ctx.restore();
    }

    // Black tail feathers
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.85, -r * 0.1);
    ctx.lineTo(-r * 1.55, -r * 0.32);
    ctx.lineTo(-r * 1.38, -r * 0.05);
    ctx.lineTo(-r * 1.65, 0.16);
    ctx.lineTo(-r * 0.85, 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Spiky punk head crest (4 prominent sharp black feathers)
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r * 0.7);
    ctx.lineTo(-r * 0.85, -r * 1.6);
    ctx.lineTo(-r * 0.28, -r * 1.18);
    ctx.lineTo(-r * 0.12, -r * 1.72);
    ctx.lineTo(0.06, -r * 1.18);
    ctx.lineTo(r * 0.34, -r * 1.55);
    ctx.lineTo(r * 0.16, -r * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#09090b';
    ctx.stroke();

    // Yellow triangular body with aerodynamic curvature
    const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r * 1.25);
    bodyGrad.addColorStop(0, '#fef08a');
    bodyGrad.addColorStop(0.3, '#fde047');
    bodyGrad.addColorStop(0.7, '#eab308');
    bodyGrad.addColorStop(1, '#854d0e');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(r * 1.2, 0); // nose point
    ctx.quadraticCurveTo(0, r * 0.95, -r * 0.92, r * 0.92); // bottom edge
    ctx.quadraticCurveTo(-r * 0.78, 0, -r * 0.92, -r * 0.92); // back edge
    ctx.quadraticCurveTo(0, -r * 0.95, r * 1.2, 0); // top edge
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#713f12';
    ctx.stroke();

    // Glossy 3D sheen on Chuck's back
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = r * 0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r * 0.4, -r * 0.65);
    ctx.quadraticCurveTo(0, -r * 0.65, r * 0.5, -r * 0.2);
    ctx.stroke();
    ctx.restore();

    // Lighter belly sheen
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.ellipse(-r * 0.15, r * 0.48, r * 0.52, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chuck's aerodynamic side wing
    ctx.save();
    ctx.fillStyle = '#ca8a04';
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, 0.05);
    ctx.lineTo(-r * 0.75, 0.35);
    ctx.lineTo(-r * 0.35, 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Fierce angled chestnut eyebrows
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(r * 0.4, -r * 0.06);
    ctx.lineTo(-r * 0.58, -r * 0.44);
    ctx.lineTo(-r * 0.52, -r * 0.25);
    ctx.lineTo(-r * 0.06, -r * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#451a03';
    ctx.stroke();

    // Big determined eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.08, -r * 0.04, r * 0.24, 0, Math.PI * 2);
    ctx.arc(r * 0.25, -r * 0.04, r * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#1c1917';
    ctx.stroke();

    // Pupils
    ctx.fillStyle = '#0c0a09';
    ctx.beginPath();
    ctx.arc(-r * 0.02, -r * 0.04, r * 0.11, 0, Math.PI * 2);
    ctx.arc(r * 0.29, -r * 0.04, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.05, -r * 0.09, r * 0.045, 0, Math.PI * 2);
    ctx.arc(r * 0.26, -r * 0.09, r * 0.045, 0, Math.PI * 2);
    ctx.fill();

    // Long razor-sharp yellow/orange beak
    const beakGrad = ctx.createLinearGradient(0, 0, r * 0.9, r * 0.15);
    beakGrad.addColorStop(0, '#fde047');
    beakGrad.addColorStop(0.55, '#f97316');
    beakGrad.addColorStop(1, '#c2410c');
    ctx.fillStyle = beakGrad;

    ctx.beginPath();
    ctx.moveTo(0, -r * 0.03);
    ctx.lineTo(r * 0.92, r * 0.1);
    ctx.lineTo(0, r * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#9a3412';
    ctx.stroke();

    // Beak seam
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.15);
    ctx.lineTo(r * 0.92, r * 0.1);
    ctx.stroke();
  }

  // THE BLUES (Cute Blue Birds - Splitter) - Enhanced High-Fidelity Graphics
  private static drawBluesChicken(ctx: CanvasRenderingContext2D, r: number) {
    // Tail feather
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, 0);
    ctx.lineTo(-r * 1.4, -r * 0.22);
    ctx.lineTo(-r * 1.34, r * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Head crest feather (cute single tuft)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, -r * 0.95);
    ctx.quadraticCurveTo(-r * 0.22, -r * 1.5, -r * 0.48, -r * 1.44);
    ctx.quadraticCurveTo(-r * 0.1, -r * 1.15, 0.1, -r * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0369a1';
    ctx.stroke();

    // Electric cyan body with deep cobalt 3D shading
    const bodyGrad = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.08, 0, 0, r);
    bodyGrad.addColorStop(0, '#7dd3fc');
    bodyGrad.addColorStop(0.35, '#38bdf8');
    bodyGrad.addColorStop(0.75, '#0284c7');
    bodyGrad.addColorStop(1, '#075985');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#0c4a6e';
    ctx.stroke();

    // 3D highlight arc
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = r * 0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.2, r * 0.58, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
    ctx.restore();

    // Cute little wing on side
    ctx.save();
    ctx.fillStyle = '#0369a1';
    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(-r * 0.58, 0.18, r * 0.26, r * 0.18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Peach cheek blush
    ctx.fillStyle = 'rgba(249, 115, 22, 0.7)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.65, r * 0.2, r * 0.18, r * 0.12, 0, 0, Math.PI * 2);
    ctx.ellipse(r * 0.65, r * 0.2, r * 0.18, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Enormous adorable anime eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.08, r * 0.33, 0, Math.PI * 2);
    ctx.arc(r * 0.28, -r * 0.08, r * 0.33, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Big shiny dark pupils
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.06, r * 0.19, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.06, r * 0.19, 0, Math.PI * 2);
    ctx.fill();

    // Sparkling eye reflections
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.24, -r * 0.13, r * 0.085, 0, Math.PI * 2);
    ctx.arc(r * 0.16, -r * 0.13, r * 0.085, 0, Math.PI * 2);
    ctx.arc(-r * 0.14, 0, r * 0.04, 0, Math.PI * 2);
    ctx.arc(r * 0.24, 0, r * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Cheerful bright orange beak with tiny smirk
    const beakGrad = ctx.createLinearGradient(0, 0, 0, r * 0.38);
    beakGrad.addColorStop(0, '#fbbf24');
    beakGrad.addColorStop(1, '#ea580c');
    ctx.fillStyle = beakGrad;

    ctx.beginPath();
    ctx.moveTo(-r * 0.19, 0.04);
    ctx.lineTo(r * 0.19, 0.04);
    ctx.lineTo(0, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#9a3412';
    ctx.stroke();
  }

  // BOMB (Black Chicken - Explosive) - Enhanced High-Fidelity Graphics
  private static drawBombChicken(ctx: CanvasRenderingContext2D, r: number, fuseLit: boolean) {
    // Brass / Gold metallic fuse collar ring
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(-r * 0.22, -r * 1.08, r * 0.44, r * 0.18, 4);
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();

    // Twisted rope fuse cord
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.08);
    ctx.quadraticCurveTo(r * 0.24, -r * 1.4, 0, -r * 1.62);
    ctx.stroke();

    if (fuseLit) {
      // Animated explosive fiery sparks and embers
      ctx.save();
      const sparkGrad = ctx.createRadialGradient(0, -r * 1.65, 2, 0, -r * 1.65, r * 0.55);
      sparkGrad.addColorStop(0, '#ffffff');
      sparkGrad.addColorStop(0.3, '#fde047');
      sparkGrad.addColorStop(0.7, '#ea580c');
      sparkGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = sparkGrad;
      ctx.beginPath();
      ctx.arc(0, -r * 1.65, r * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Sharp radiating spark rays
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.4;
      for (let a = 0; a < 8; a++) {
        const ang = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.65);
        ctx.lineTo(Math.cos(ang) * (r * 0.6), -r * 1.65 + Math.sin(ang) * (r * 0.6));
        ctx.stroke();
      }
      ctx.restore();
    } else {
      // Idle burning ember
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -r * 1.62, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -r * 1.62, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heavy round obsidian sphere with ambient rim light
    const bodyGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    if (fuseLit) {
      bodyGrad.addColorStop(0, '#991b1b');
      bodyGrad.addColorStop(0.4, '#581c87');
      bodyGrad.addColorStop(0.85, '#1c1917');
      bodyGrad.addColorStop(1, '#09090b');
    } else {
      bodyGrad.addColorStop(0, '#52525b');
      bodyGrad.addColorStop(0.35, '#27272a');
      bodyGrad.addColorStop(0.8, '#18181b');
      bodyGrad.addColorStop(1, '#09090b');
    }

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3.6;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // 3D glossy highlight rim
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.25, r * 0.58, -Math.PI * 0.75, -Math.PI * 0.28);
    ctx.stroke();
    ctx.restore();

    // Heavy iron side wing
    ctx.save();
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(-r * 0.62, 0.2, r * 0.28, r * 0.2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Glowing target dot on forehead
    ctx.fillStyle = fuseLit ? '#facc15' : '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -r * 0.48, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -r * 0.48, r * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Intense fiery orange-red furrowed eyebrows
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.1);
    ctx.lineTo(-r * 0.78, -r * 0.4);
    ctx.lineTo(-r * 0.72, -r * 0.22);
    ctx.lineTo(0, -r * 0.02);
    ctx.lineTo(r * 0.72, -r * 0.22);
    ctx.lineTo(r * 0.78, -r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#9a3412';
    ctx.stroke();

    // Round determined white eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.04, r * 0.21, 0, Math.PI * 2);
    ctx.arc(r * 0.28, -r * 0.04, r * 0.21, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Pinpoint intense pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-r * 0.21, -r * 0.04, r * 0.1, 0, Math.PI * 2);
    ctx.arc(r * 0.21, -r * 0.04, r * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Small eye reflection
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.24, -r * 0.08, 3, 0, Math.PI * 2);
    ctx.arc(r * 0.18, -r * 0.08, 3, 0, Math.PI * 2);
    ctx.fill();

    // Solid gunmetal/amber beak
    const beakGrad = ctx.createLinearGradient(0, 0, 0, r * 0.38);
    beakGrad.addColorStop(0, '#fde047');
    beakGrad.addColorStop(0.5, '#d97706');
    beakGrad.addColorStop(1, '#92400e');
    ctx.fillStyle = beakGrad;

    ctx.beginPath();
    ctx.moveTo(-r * 0.19, 0.04);
    ctx.lineTo(r * 0.19, 0.04);
    ctx.lineTo(0, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();
  }

  // MATILDA (White Chicken - Egg Bomber) - Enhanced High-Fidelity Graphics
  private static drawMatildaChicken(ctx: CanvasRenderingContext2D, r: number) {
    // 3 Sleek black tail feathers
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.75, r * 0.1);
    ctx.lineTo(-r * 1.4, -r * 0.12);
    ctx.lineTo(-r * 1.28, r * 0.15);
    ctx.lineTo(-r * 1.5, r * 0.38);
    ctx.lineTo(-r * 0.75, r * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Elegant black and pink crest feathers on top
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, -r * 1.05);
    ctx.quadraticCurveTo(-r * 0.32, -r * 1.55, -r * 0.54, -r * 1.48);
    ctx.quadraticCurveTo(-r * 0.15, -r * 1.2, 0.05, -r * 1.05);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.05);
    ctx.quadraticCurveTo(r * 0.22, -r * 1.5, r * 0.44, -r * 1.4);
    ctx.quadraticCurveTo(r * 0.15, -r * 1.15, 0.15, -r * 1.0);
    ctx.closePath();
    ctx.fill();

    // Pristine pearlescent white oval body with soft ambient shading
    const bodyGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r * 1.1);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.5, '#f8fafc');
    bodyGrad.addColorStop(0.85, '#e2e8f0');
    bodyGrad.addColorStop(1, '#94a3b8');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.9, r * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#64748b';
    ctx.stroke();

    // Specular shine on Matilda's forehead
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = r * 0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(-r * 0.15, -r * 0.35, r * 0.45, r * 0.3, -0.4, -Math.PI * 0.7, -Math.PI * 0.2);
    ctx.stroke();
    ctx.restore();

    // White rounded side wing with feather detail
    ctx.save();
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(-r * 0.58, 0.18, r * 0.28, r * 0.2, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Pretty pink blush cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.65)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.48, r * 0.18, r * 0.19, r * 0.13, 0, 0, Math.PI * 2);
    ctx.ellipse(r * 0.48, r * 0.18, r * 0.19, r * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big gentle cartoon eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-r * 0.24, -r * 0.1, r * 0.17, 0, Math.PI * 2);
    ctx.arc(r * 0.24, -r * 0.1, r * 0.17, 0, Math.PI * 2);
    ctx.fill();

    // White eye highlights & catchlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.27, -r * 0.14, r * 0.065, 0, Math.PI * 2);
    ctx.arc(r * 0.21, -r * 0.14, r * 0.065, 0, Math.PI * 2);
    ctx.arc(-r * 0.2, -r * 0.06, r * 0.03, 0, Math.PI * 2);
    ctx.arc(r * 0.28, -r * 0.06, r * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Soft arched brown eyebrows
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(-r * 0.24, -r * 0.32, r * 0.15, Math.PI * 1.1, Math.PI * 1.9);
    ctx.arc(r * 0.24, -r * 0.32, r * 0.15, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // Bright golden curved duck-like beak with cheerful smile
    const beakGrad = ctx.createLinearGradient(0, 0, 0, r * 0.4);
    beakGrad.addColorStop(0, '#fde047');
    beakGrad.addColorStop(0.5, '#f59e0b');
    beakGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = beakGrad;

    ctx.beginPath();
    ctx.moveTo(-r * 0.2, 0.05);
    ctx.lineTo(r * 0.2, 0.05);
    ctx.lineTo(0, r * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
  }

  // SILVER (The Steel Drill Falcon) - High-Velocity Steel-Piercing Bird
  private static drawSilverChicken(ctx: CanvasRenderingContext2D, r: number, drillActive: boolean) {
    if (drillActive) {
      // Spinning Rocket Drill Vortex Cone
      ctx.save();
      const vortexGrad = ctx.createRadialGradient(r * 0.8, 0, 2, r * 0.8, 0, r * 2.2);
      vortexGrad.addColorStop(0, '#fef08a');
      vortexGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.85)');
      vortexGrad.addColorStop(0.65, 'rgba(2, 132, 199, 0.5)');
      vortexGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
      ctx.fillStyle = vortexGrad;
      ctx.beginPath();
      ctx.arc(r * 0.8, 0, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp conical spiral drill waves
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      for (let s = 1; s <= 3; s++) {
        ctx.beginPath();
        ctx.ellipse(r * (0.6 + s * 0.4), 0, r * 0.35, r * (0.5 + s * 0.35), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Supersonic speed trail lines behind
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-r * 1.4, -r * 0.5);
      ctx.lineTo(-r * 2.4, -r * 0.5);
      ctx.moveTo(-r * 1.5, 0);
      ctx.lineTo(-r * 2.8, 0);
      ctx.moveTo(-r * 1.4, r * 0.5);
      ctx.lineTo(-r * 2.4, r * 0.5);
      ctx.stroke();
      ctx.restore();
    }

    // 3 Sleek metallic tail feathers
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.85, -r * 0.1);
    ctx.lineTo(-r * 1.6, -r * 0.36);
    ctx.lineTo(-r * 1.4, -r * 0.05);
    ctx.lineTo(-r * 1.7, 0.14);
    ctx.lineTo(-r * 1.35, 0.22);
    ctx.lineTo(-r * 1.55, 0.38);
    ctx.lineTo(-r * 0.85, 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Swept-back aerodynamic crest with metallic gold tips
    const crestGrad = ctx.createLinearGradient(-r * 0.8, -r * 1.6, 0, -r * 0.8);
    crestGrad.addColorStop(0, '#f59e0b'); // Golden tip
    crestGrad.addColorStop(0.35, '#cbd5e1'); // Silver feather
    crestGrad.addColorStop(1, '#475569'); // Dark root
    ctx.fillStyle = crestGrad;
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.9);
    ctx.quadraticCurveTo(-r * 0.5, -r * 1.65, -r * 0.95, -r * 1.55);
    ctx.quadraticCurveTo(-r * 0.4, -r * 1.25, -r * 0.1, -r * 1.05);
    ctx.quadraticCurveTo(0, -r * 1.7, -r * 0.35, -r * 1.8);
    ctx.quadraticCurveTo(r * 0.2, -r * 1.3, r * 0.15, -r * 0.92);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Metallic silver spherical aerodynamic body with rich 3D shading
    const bodyGrad = ctx.createRadialGradient(-r * 0.32, -r * 0.32, r * 0.08, 0, 0, r);
    bodyGrad.addColorStop(0, '#f1f5f9');
    bodyGrad.addColorStop(0.35, '#cbd5e1');
    bodyGrad.addColorStop(0.7, '#64748b');
    bodyGrad.addColorStop(1, '#334155');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3.2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    // Specular titanium highlight arc
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.25, r * 0.58, -Math.PI * 0.75, -Math.PI * 0.28);
    ctx.stroke();
    ctx.restore();

    // Platinum belly plumage
    const bellyGrad = ctx.createLinearGradient(0, r * 0.1, 0, r * 0.95);
    bellyGrad.addColorStop(0, '#ffffff');
    bellyGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bellyGrad;
    ctx.beginPath();
    ctx.ellipse(r * 0.1, r * 0.44, r * 0.56, r * 0.42, 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Sleek metallic wing with turbine styling
    ctx.save();
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, 0.05);
    ctx.quadraticCurveTo(-r * 0.85, 0.18, -r * 0.88, 0.45);
    ctx.quadraticCurveTo(-r * 0.68, 0.6, -r * 0.42, 0.54);
    ctx.quadraticCurveTo(-r * 0.25, 0.46, -r * 0.35, 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Golden wing trim stripe
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.75, 0.25);
    ctx.lineTo(-r * 0.48, 0.42);
    ctx.stroke();
    ctx.restore();

    // Sharp warrior eyes (Amber/Yellow fire eyes)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.05, r * 0.25, 0, Math.PI * 2);
    ctx.arc(r * 0.25, -r * 0.05, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Golden amber iris
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(-r * 0.18, -r * 0.04, r * 0.16, 0, Math.PI * 2);
    ctx.arc(r * 0.18, -r * 0.04, r * 0.16, 0, Math.PI * 2);
    ctx.fill();

    // Black pupil
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(-r * 0.16, -r * 0.04, r * 0.09, 0, Math.PI * 2);
    ctx.arc(r * 0.16, -r * 0.04, r * 0.09, 0, Math.PI * 2);
    ctx.fill();

    // Catchlight highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.09, r * 0.05, 0, Math.PI * 2);
    ctx.arc(r * 0.12, -r * 0.09, r * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Charcoal aerodynamic warrior eyebrows
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.02);
    ctx.lineTo(-r * 0.75, -r * 0.28);
    ctx.lineTo(-r * 0.72, -r * 0.48);
    ctx.lineTo(-r * 0.06, -r * 0.15);
    ctx.lineTo(r * 0.06, -r * 0.15);
    ctx.lineTo(r * 0.72, -r * 0.48);
    ctx.lineTo(r * 0.75, -r * 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#020617';
    ctx.stroke();

    // REINFORCED TITANIUM DRILL BEAK (Steel/Titanium conical drill with spiral grooves)
    const drillGrad = ctx.createLinearGradient(0, -r * 0.05, r * 0.9, r * 0.2);
    drillGrad.addColorStop(0, '#f8fafc');
    drillGrad.addColorStop(0.35, '#94a3b8');
    drillGrad.addColorStop(0.7, '#475569');
    drillGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = drillGrad;

    ctx.beginPath();
    ctx.moveTo(-r * 0.22, -r * 0.02);
    ctx.lineTo(r * 0.95, r * 0.1); // Long sharp drill tip
    ctx.lineTo(-r * 0.1, r * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Spiral drill grooves on beak
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 0.04);
    ctx.lineTo(r * 0.25, 0.16);
    ctx.moveTo(r * 0.25, 0.04);
    ctx.lineTo(r * 0.55, 0.16);
    ctx.moveTo(r * 0.55, 0.05);
    ctx.lineTo(r * 0.8, 0.14);
    ctx.stroke();
  }

  // Draw Block (Wood, Ice, Stone, Steel, TNT, Floating Islands)
  public static drawBlock(
    ctx: CanvasRenderingContext2D,
    material: string,
    x: number,
    y: number,
    w: number,
    h: number,
    angle: number = 0,
    healthRatio: number = 1,
    isCircle: boolean = false,
    isIsland: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const hw = w / 2;
    const hh = h / 2;

    // FLOATING ISLAND (Grassy bedrock sky platform)
    if (isIsland) {
      // 1. Craggy rock bedrock body
      const rockGrad = ctx.createLinearGradient(0, -hh, 0, hh);
      rockGrad.addColorStop(0, '#78716c');
      rockGrad.addColorStop(0.5, '#57534e');
      rockGrad.addColorStop(1, '#292524');
      ctx.fillStyle = rockGrad;
      ctx.beginPath();
      ctx.roundRect(-hw, -hh, w, h, [8, 8, 22, 22]);
      ctx.fill();

      // Rock fissures & strata lines
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-hw + 15, 0);
      ctx.lineTo(-hw + 45, hh * 0.5);
      ctx.moveTo(hw - 30, -hh * 0.2);
      ctx.lineTo(hw - 60, hh * 0.6);
      ctx.stroke();

      // 2. Lush green turf grass on top
      const grassH = Math.min(18, h * 0.35);
      const grassGrad = ctx.createLinearGradient(0, -hh, 0, -hh + grassH);
      grassGrad.addColorStop(0, '#4ade80');
      grassGrad.addColorStop(1, '#15803d');
      ctx.fillStyle = grassGrad;
      ctx.beginPath();
      ctx.roundRect(-hw, -hh, w, grassH, [8, 8, 4, 4]);
      ctx.fill();

      // Grass tufts / blades overhanging the edge
      ctx.fillStyle = '#16a34a';
      for (let gx = -hw + 8; gx < hw - 8; gx += 16) {
        ctx.beginPath();
        ctx.moveTo(gx, -hh + grassH);
        ctx.lineTo(gx + 8, -hh + grassH + 5);
        ctx.lineTo(gx + 16, -hh + grassH);
        ctx.fill();
      }

      // Rock outline
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1c1917';
      ctx.strokeRect(-hw, -hh, w, h);

      ctx.restore();
      return;
    }

    if (isCircle) {
      const r = w / 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);

      if (material === 'stone') {
        const stoneGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
        stoneGrad.addColorStop(0, '#adb5bd');
        stoneGrad.addColorStop(0.7, '#6c757d');
        stoneGrad.addColorStop(1, '#495057');
        ctx.fillStyle = stoneGrad;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#343a40';
        ctx.stroke();
      } else {
        ctx.fillStyle = '#b08968';
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    switch (material) {
      case 'wood': {
        // Wood beam with wood grain
        ctx.fillStyle = '#b07d48';
        ctx.fillRect(-hw, -hh, w, h);

        // Wood grain stripes
        ctx.strokeStyle = '#8d5b28';
        ctx.lineWidth = 1.5;
        const step = Math.min(w, h) > 20 ? 8 : 4;
        if (w >= h) {
          for (let ly = -hh + step; ly < hh; ly += step) {
            ctx.beginPath();
            ctx.moveTo(-hw, ly);
            ctx.lineTo(hw, ly);
            ctx.stroke();
          }
        } else {
          for (let lx = -hw + step; lx < hw; lx += step) {
            ctx.beginPath();
            ctx.moveTo(lx, -hh);
            ctx.lineTo(lx, hh);
            ctx.stroke();
          }
        }

        // Border & bevel
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#613c14';
        ctx.strokeRect(-hw, -hh, w, h);
        break;
      }
      case 'ice': {
        // Translucent ice/glass block
        const iceGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
        iceGrad.addColorStop(0, 'rgba(195, 235, 255, 0.88)');
        iceGrad.addColorStop(0.5, 'rgba(138, 209, 245, 0.85)');
        iceGrad.addColorStop(1, 'rgba(84, 180, 230, 0.9)');

        ctx.fillStyle = iceGrad;
        ctx.fillRect(-hw, -hh, w, h);

        // Glass highlight sheen
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-hw + 3, -hh + 3);
        ctx.lineTo(hw - 3, -hh + 3);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3296c8';
        ctx.strokeRect(-hw, -hh, w, h);
        break;
      }
      case 'stone': {
        // Heavy granite stone block
        const stoneGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
        stoneGrad.addColorStop(0, '#9aa0a6');
        stoneGrad.addColorStop(0.7, '#6b7280');
        stoneGrad.addColorStop(1, '#4b5563');

        ctx.fillStyle = stoneGrad;
        ctx.fillRect(-hw, -hh, w, h);

        // Stone texture spots
        ctx.fillStyle = '#374151';
        for (let i = 0; i < 4; i++) {
          const sx = -hw + (w * (i + 1)) / 5;
          const sy = (i % 2 === 0 ? -1 : 1) * (hh * 0.4);
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#1f2937';
        ctx.strokeRect(-hw, -hh, w, h);
        break;
      }
      case 'steel': {
        // Reinforced Heavy Steel Girder / Bar
        const steelGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
        steelGrad.addColorStop(0, '#64748b');
        steelGrad.addColorStop(0.3, '#475569');
        steelGrad.addColorStop(0.7, '#334155');
        steelGrad.addColorStop(1, '#1e293b');

        ctx.fillStyle = steelGrad;
        ctx.fillRect(-hw, -hh, w, h);

        // Metallic reflection highlight stripe
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        if (w >= h) {
          ctx.fillRect(-hw + 3, -hh + 2, w - 6, Math.max(2, h * 0.2));
        } else {
          ctx.fillRect(-hw + 2, -hh + 3, Math.max(2, w * 0.2), h - 6);
        }

        // Steel rivets / bolts along girder
        ctx.fillStyle = '#94a3b8';
        const rivetSpacing = Math.min(32, Math.max(14, (w >= h ? w : h) / 4));
        const numRivets = Math.max(2, Math.floor((w >= h ? w : h) / rivetSpacing));

        for (let r = 0; r < numRivets; r++) {
          const t = (r + 0.5) / numRivets;
          const rx = w >= h ? -hw + t * w : 0;
          const ry = w >= h ? 0 : -hh + t * h;

          ctx.beginPath();
          ctx.arc(rx, ry, Math.min(3.5, Math.min(w, h) * 0.16), 0, Math.PI * 2);
          ctx.fill();
        }

        // Dark industrial steel border
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0f172a';
        ctx.strokeRect(-hw, -hh, w, h);
        break;
      }
      case 'tnt': {
        // Red TNT explosive crate
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-hw, -hh, w, h);

        // Wood banding on TNT
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-hw, -hh + h * 0.28, w, h * 0.44);

        // "TNT" bold label
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${Math.max(12, Math.floor(h * 0.34))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('TNT', 0, 0);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#991b1b';
        ctx.strokeRect(-hw, -hh, w, h);
        break;
      }
    }

    // Cracks if damaged
    if (healthRatio < 0.65) {
      ctx.strokeStyle = material === 'ice' ? '#ffffff' : '#000000';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.5, -hh * 0.5);
      ctx.lineTo(0, 0);
      ctx.lineTo(hw * 0.4, -hh * 0.2);
      ctx.lineTo(hw * 0.6, hh * 0.5);
      ctx.stroke();

      if (healthRatio < 0.35) {
        ctx.beginPath();
        ctx.moveTo(-hw * 0.6, hh * 0.4);
        ctx.lineTo(-hw * 0.1, hh * 0.1);
        ctx.lineTo(hw * 0.2, hh * 0.6);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

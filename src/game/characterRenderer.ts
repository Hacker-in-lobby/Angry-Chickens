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
    CharacterRenderer.sandeepImg.src = '/assets/1000025505-removebg-preview.png';
    CharacterRenderer.sandeepImg.onload = () => {
      CharacterRenderer.imgLoaded = true;
    };
    CharacterRenderer.sandeepImg.onerror = () => {
      if (CharacterRenderer.sandeepImg) {
        CharacterRenderer.sandeepImg.src = '/assets/sandeep.svg';
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
      default:
        this.drawRedChicken(ctx, radius);
        break;
    }

    ctx.restore();
  }

  // RED CHICKEN (Cluck / Leader)
  private static drawRedChicken(ctx: CanvasRenderingContext2D, r: number) {
    // Tail feathers
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, -r * 0.1);
    ctx.lineTo(-r * 1.35, -r * 0.3);
    ctx.lineTo(-r * 1.25, -r * 0.05);
    ctx.lineTo(-r * 1.45, r * 0.1);
    ctx.lineTo(-r * 0.9, r * 0.15);
    ctx.closePath();
    ctx.fill();

    // Crest feathers on head
    ctx.fillStyle = '#d91d24';
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, -r * 0.95);
    ctx.quadraticCurveTo(-r * 0.2, -r * 1.45, -r * 0.45, -r * 1.4);
    ctx.quadraticCurveTo(-r * 0.1, -r * 1.15, 0, -r * 0.98);
    ctx.quadraticCurveTo(r * 0.15, -r * 1.4, 0, -r * 1.48);
    ctx.quadraticCurveTo(r * 0.25, -r * 1.15, r * 0.2, -r * 0.95);
    ctx.closePath();
    ctx.fill();

    // Main red spherical body
    const bodyGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    bodyGrad.addColorStop(0, '#f23a3a');
    bodyGrad.addColorStop(0.7, '#d91d24');
    bodyGrad.addColorStop(1, '#9e0d13');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#78080c';
    ctx.stroke();

    // Pale beige/white belly
    ctx.fillStyle = '#fcebd2';
    ctx.beginPath();
    ctx.ellipse(r * 0.15, r * 0.35, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fierce Angry Eyebrows (Black V-shape)
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, -r * 0.1);
    ctx.lineTo(-r * 0.65, -r * 0.38);
    ctx.lineTo(-r * 0.65, -r * 0.18);
    ctx.lineTo(0, -r * 0.02);
    ctx.lineTo(r * 0.65, -r * 0.18);
    ctx.lineTo(r * 0.65, -r * 0.38);
    ctx.lineTo(r * 0.1, -r * 0.1);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.05, r * 0.22, 0, Math.PI * 2);
    ctx.arc(r * 0.25, -r * 0.05, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#222';
    ctx.stroke();

    // Pupils
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(-r * 0.18, -r * 0.05, r * 0.1, 0, Math.PI * 2);
    ctx.arc(r * 0.18, -r * 0.05, r * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Beak (Sharp orange/yellow)
    ctx.fillStyle = '#fca510';
    ctx.beginPath();
    ctx.moveTo(-r * 0.18, 0);
    ctx.lineTo(r * 0.18, 0);
    ctx.lineTo(0, r * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#c47802';
    ctx.stroke();
  }

  // CHUCK (Yellow Triangle - Speedster)
  private static drawChuckChicken(ctx: CanvasRenderingContext2D, r: number, boosted: boolean) {
    if (boosted) {
      // Flame trail / speed aura
      ctx.fillStyle = 'rgba(255, 120, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Black spiky crest on top
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.8);
    ctx.lineTo(-r * 0.6, -r * 1.4);
    ctx.lineTo(-r * 0.1, -r * 1.05);
    ctx.lineTo(0, -r * 1.5);
    ctx.lineTo(r * 0.1, -r * 0.95);
    ctx.closePath();
    ctx.fill();

    // Yellow triangular body
    const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
    bodyGrad.addColorStop(0, '#fff44f');
    bodyGrad.addColorStop(0.7, '#fcd215');
    bodyGrad.addColorStop(1, '#d49b08');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(r * 1.1, 0);
    ctx.lineTo(-r * 0.85, -r * 0.95);
    ctx.lineTo(-r * 0.85, r * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#a67202';
    ctx.stroke();

    // Brown angry eyebrows
    ctx.fillStyle = '#9e2d09';
    ctx.beginPath();
    ctx.moveTo(-r * 0.1, -r * 0.15);
    ctx.lineTo(-r * 0.5, -r * 0.35);
    ctx.lineTo(-r * 0.45, -r * 0.2);
    ctx.lineTo(r * 0.35, -r * 0.05);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.08, -r * 0.05, r * 0.2, 0, Math.PI * 2);
    ctx.arc(r * 0.22, -r * 0.05, r * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-r * 0.04, -r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.arc(r * 0.26, -r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.fill();

    // Long yellow/orange beak
    ctx.fillStyle = '#f78d11';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r * 0.75, r * 0.1);
    ctx.lineTo(0, r * 0.28);
    ctx.closePath();
    ctx.fill();
  }

  // THE BLUES (Cute Blue Birds - Splitter)
  private static drawBluesChicken(ctx: CanvasRenderingContext2D, r: number) {
    // Cute cyan body
    const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
    bodyGrad.addColorStop(0, '#56d4f7');
    bodyGrad.addColorStop(0.7, '#24a5e0');
    bodyGrad.addColorStop(1, '#0c6999');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0a5278';
    ctx.stroke();

    // Cheerful big eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.28, -r * 0.1, r * 0.28, 0, Math.PI * 2);
    ctx.arc(r * 0.28, -r * 0.1, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.1, r * 0.14, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.1, r * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Orange tuft cheeks
    ctx.fillStyle = '#f07d24';
    ctx.beginPath();
    ctx.arc(-r * 0.65, r * 0.2, r * 0.15, 0, Math.PI * 2);
    ctx.arc(r * 0.65, r * 0.2, r * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Small orange beak
    ctx.fillStyle = '#fc9919';
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, 0.05);
    ctx.lineTo(r * 0.15, 0.05);
    ctx.lineTo(0, r * 0.35);
    ctx.closePath();
    ctx.fill();
  }

  // BOMB (Black Chicken - Explosive)
  private static drawBombChicken(ctx: CanvasRenderingContext2D, r: number, fuseLit: boolean) {
    // Top fuse feather
    ctx.fillStyle = '#111';
    ctx.fillRect(-2, -r * 1.3, 4, r * 0.4);

    if (fuseLit) {
      // Sparks & flame on fuse
      ctx.fillStyle = '#ff3300';
      ctx.beginPath();
      ctx.arc(0, -r * 1.35, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(0, -r * 1.35, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heavy round body
    const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
    if (fuseLit) {
      bodyGrad.addColorStop(0, '#5a1215');
      bodyGrad.addColorStop(0.7, '#851218');
      bodyGrad.addColorStop(1, '#3b0609');
    } else {
      bodyGrad.addColorStop(0, '#424242');
      bodyGrad.addColorStop(0.7, '#242424');
      bodyGrad.addColorStop(1, '#0d0d0d');
    }

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#050505';
    ctx.stroke();

    // Red dot on forehead
    ctx.fillStyle = '#e62229';
    ctx.beginPath();
    ctx.arc(0, -r * 0.45, r * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Intense fiery eyebrows
    ctx.fillStyle = '#c72e0a';
    ctx.fillRect(-r * 0.6, -r * 0.25, r * 1.2, r * 0.12);

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.26, -r * 0.05, r * 0.18, 0, Math.PI * 2);
    ctx.arc(r * 0.26, -r * 0.05, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.arc(r * 0.2, -r * 0.05, r * 0.09, 0, Math.PI * 2);
    ctx.fill();

    // Grey beak
    ctx.fillStyle = '#e09819';
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, 0.05);
    ctx.lineTo(r * 0.15, 0.05);
    ctx.lineTo(0, r * 0.35);
    ctx.closePath();
    ctx.fill();
  }

  // MATILDA (White Chicken - Egg Bomber)
  private static drawMatildaChicken(ctx: CanvasRenderingContext2D, r: number) {
    // White oval body
    const bodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.7, '#f0f0f0');
    bodyGrad.addColorStop(1, '#c9c9c9');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.85, r * 1.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#8c8c8c';
    ctx.stroke();

    // Pink rosy cheeks
    ctx.fillStyle = '#f78da3';
    ctx.beginPath();
    ctx.arc(-r * 0.45, r * 0.15, r * 0.18, 0, Math.PI * 2);
    ctx.arc(r * 0.45, r * 0.15, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Big eyes
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-r * 0.22, -r * 0.1, r * 0.14, 0, Math.PI * 2);
    ctx.arc(r * 0.22, -r * 0.1, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.14, r * 0.05, 0, Math.PI * 2);
    ctx.arc(r * 0.19, -r * 0.14, r * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Yellow beak
    ctx.fillStyle = '#fc9d19';
    ctx.beginPath();
    ctx.moveTo(-r * 0.16, 0.05);
    ctx.lineTo(r * 0.16, 0.05);
    ctx.lineTo(0, r * 0.35);
    ctx.closePath();
    ctx.fill();
  }

  // Draw Block (Wood, Ice, Stone, TNT)
  public static drawBlock(
    ctx: CanvasRenderingContext2D,
    material: string,
    x: number,
    y: number,
    w: number,
    h: number,
    angle: number = 0,
    healthRatio: number = 1,
    isCircle: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

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

    const hw = w / 2;
    const hh = h / 2;

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

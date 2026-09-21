// High-resolution procedural panoramic canvas generator for Himalayan vistas
export function createEquirectangularHimalayaTexture(sceneId: string, skyTheme: 'daylight' | 'golden' | 'twilight'): HTMLCanvasElement {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (skyTheme === 'golden') {
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(0.2, '#1e293b');
    skyGrad.addColorStop(0.42, '#b45309');
    skyGrad.addColorStop(0.55, '#f59e0b');
    skyGrad.addColorStop(0.65, '#fde68a');
    skyGrad.addColorStop(0.72, '#fed7aa');
    skyGrad.addColorStop(1, '#1c1917');
  } else if (skyTheme === 'twilight') {
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.3, '#0b1329');
    skyGrad.addColorStop(0.52, '#1e1b4b');
    skyGrad.addColorStop(0.65, '#3b0764');
    skyGrad.addColorStop(0.72, '#4c0519');
    skyGrad.addColorStop(1, '#090d16');
  } else {
    // Crisp high-altitude daylight (Kedarkantha / Valley of Flowers)
    skyGrad.addColorStop(0, '#0369a1');
    skyGrad.addColorStop(0.25, '#0284c7');
    skyGrad.addColorStop(0.45, '#38bdf8');
    skyGrad.addColorStop(0.58, '#bae6fd');
    skyGrad.addColorStop(0.68, '#e0f2fe');
    skyGrad.addColorStop(1, '#0c4a6e');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Stars for twilight
  if (skyTheme === 'twilight') {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 450; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (height * 0.6);
      const r = Math.random() * 1.5 + 0.5;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  // 3. Sun / Celestial Glint
  const sunX = skyTheme === 'golden' ? width * 0.28 : width * 0.65;
  const sunY = height * 0.48;
  const sunRadius = 60;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 320);
  if (skyTheme === 'golden') {
    sunGrad.addColorStop(0, 'rgba(255, 255, 230, 0.95)');
    sunGrad.addColorStop(0.2, 'rgba(251, 191, 36, 0.7)');
    sunGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.25)');
    sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  } else if (skyTheme === 'twilight') {
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    sunGrad.addColorStop(0.2, 'rgba(192, 132, 252, 0.4)');
    sunGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
  } else {
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.7)');
    sunGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.3)');
    sunGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
  }
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 320, 0, Math.PI * 2);
  ctx.fill();

  // Draw mountain layers (360 continuous panorama wrapping seamlessly around)
  // Layer 1: Distant colossal snowy ridges (Swargarohini, Bandarpoonch, Kamet, Trishul)
  drawMountainRidge(ctx, width, height * 0.52, height * 0.16, 24, skyTheme === 'golden' ? '#ffedd5' : skyTheme === 'twilight' ? '#334155' : '#f8fafc', skyTheme === 'golden' ? '#fdba74' : skyTheme === 'twilight' ? '#1e293b' : '#cbd5e1', 12345);

  // Layer 2: Mid-distance glaciated peaks with sharp pyramid ridges
  drawMountainRidge(ctx, width, height * 0.58, height * 0.18, 38, skyTheme === 'golden' ? '#fed7aa' : skyTheme === 'twilight' ? '#1e1b4b' : '#e2e8f0', skyTheme === 'golden' ? '#c2410c' : skyTheme === 'twilight' ? '#0f172a' : '#94a3b8', 67890);

  // Layer 3: Closer rugged alpine ridges & rocky cliffs
  drawMountainRidge(ctx, width, height * 0.65, height * 0.14, 52, skyTheme === 'golden' ? '#7c2d12' : skyTheme === 'twilight' ? '#0f172a' : '#475569', skyTheme === 'golden' ? '#431407' : skyTheme === 'twilight' ? '#020617' : '#1e293b', 11223);

  // Layer 4: Foreground snow plateau & Himalayan ridge with alpine textures / flora
  drawForegroundPlateau(ctx, width, height, sceneId, skyTheme);

  // Layer 5: Tibetan prayer flags on high ridge (adds authentic Garhwal atmosphere)
  drawPrayerFlags(ctx, width * 0.12, height * 0.73, width * 0.26, height * 0.78);
  drawPrayerFlags(ctx, width * 0.68, height * 0.74, width * 0.82, height * 0.79);

  return canvas;
}

function drawMountainRidge(
  ctx: CanvasRenderingContext2D,
  width: number,
  baseY: number,
  maxHeight: number,
  pointsCount: number,
  litColor: string,
  shadowColor: string,
  seed: number
) {
  // Generate continuous periodic heights that match at x=0 and x=width for seamless 360 wrap
  const heights: number[] = [];
  let s = seed;
  const random = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let i = 0; i < pointsCount; i++) {
    const angle = (i / pointsCount) * Math.PI * 2;
    // Harmonic frequencies for natural mountain peaks
    const h =
      Math.sin(angle * 3) * 0.35 +
      Math.sin(angle * 7) * 0.25 +
      Math.cos(angle * 13) * 0.18 +
      (random() - 0.5) * 0.3;
    heights.push(Math.max(0, h + 0.5));
  }

  // Draw shadow facet and lit facet
  ctx.beginPath();
  ctx.moveTo(0, baseY + 120);

  const step = width / pointsCount;
  for (let i = 0; i <= pointsCount; i++) {
    const idx = i % pointsCount;
    const x = i * step;
    const y = baseY - heights[idx] * maxHeight;
    if (i === 0) {
      ctx.lineTo(x, y);
    } else {
      const prevIdx = (i - 1 + pointsCount) % pointsCount;
      const prevX = (i - 1) * step;
      const prevY = baseY - heights[prevIdx] * maxHeight;
      const cx = (prevX + x) / 2;
      ctx.quadraticCurveTo(prevX, prevY, cx, (prevY + y) / 2);
    }
  }
  ctx.lineTo(width, baseY + 200);
  ctx.lineTo(0, baseY + 200);
  ctx.closePath();

  // Fill gradient
  const grad = ctx.createLinearGradient(0, baseY - maxHeight, 0, baseY + 100);
  grad.addColorStop(0, litColor);
  grad.addColorStop(0.5, shadowColor);
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fill();

  // Add sharp glacial ridges & couloir lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < pointsCount; i += 2) {
    const idx = i % pointsCount;
    const x = i * step;
    const y = baseY - heights[idx] * maxHeight;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (random() - 0.5) * 40, baseY + 40);
    ctx.stroke();
  }
}

function drawForegroundPlateau(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneId: string,
  skyTheme: string
) {
  const plateauY = height * 0.76;
  const grad = ctx.createLinearGradient(0, plateauY, 0, height);

  if (sceneId === 'valley-of-flowers') {
    // Alpine flowers & emerald slope
    grad.addColorStop(0, '#15803d');
    grad.addColorStop(0.4, '#166534');
    grad.addColorStop(1, '#052e16');
  } else if (sceneId === 'rupin-pass') {
    grad.addColorStop(0, '#44403c');
    grad.addColorStop(0.3, '#292524');
    grad.addColorStop(1, '#1c1917');
  } else {
    // Kedarkantha snow summit ridge
    if (skyTheme === 'golden') {
      grad.addColorStop(0, '#fed7aa');
      grad.addColorStop(0.2, '#fdba74');
      grad.addColorStop(0.6, '#3b251a');
      grad.addColorStop(1, '#1c1917');
    } else {
      grad.addColorStop(0, '#f1f5f9');
      grad.addColorStop(0.2, '#cbd5e1');
      grad.addColorStop(0.6, '#475569');
      grad.addColorStop(1, '#0f172a');
    }
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, plateauY + 30);

  // Rolling foreground contour
  const segs = 16;
  const segW = width / segs;
  for (let i = 0; i <= segs; i++) {
    const x = i * segW;
    const y = plateauY + Math.sin(i * 1.2) * 25 + Math.cos(i * 2.1) * 15;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // If Valley of flowers, paint wild flower specks (blue poppies, Brahmakamal, yellow buttercups)
  if (sceneId === 'valley-of-flowers') {
    const flowerColors = ['#ec4899', '#38bdf8', '#facc15', '#a855f7', '#ffffff'];
    for (let f = 0; f < 300; f++) {
      const fx = Math.random() * width;
      const fy = plateauY + 30 + Math.random() * (height - plateauY - 40);
      ctx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      ctx.beginPath();
      ctx.arc(fx, fy, Math.random() * 2.5 + 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pine tree silhouettes for Har Ki Dun / lower slopes
  if (sceneId === 'har-ki-dun' || sceneId === 'kedarkantha') {
    ctx.fillStyle = '#061a14';
    for (let t = 0; t < 24; t++) {
      const tx = (t / 24) * width + (Math.sin(t) * 40);
      const ty = plateauY + 30;
      const treeH = 35 + (t % 5) * 8;
      drawPineTree(ctx, tx, ty, treeH);
    }
  }
}

function drawPineTree(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x - h * 0.28, y);
  ctx.lineTo(x + h * 0.28, y);
  ctx.closePath();
  ctx.fill();
}

function drawPrayerFlags(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  // Cord line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + 15; // sag
  ctx.quadraticCurveTo(midX, midY, x2, y2);
  ctx.stroke();

  // Five traditional Buddhist colors: Blue, White, Red, Green, Yellow
  const colors = ['#2563eb', '#ffffff', '#dc2626', '#16a34a', '#eab308'];
  const count = 15;
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    // quadratic bezier point
    const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
    const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 7, py + 12);
    ctx.lineTo(px - 4, py + 14);
    ctx.closePath();
    ctx.fill();
  }
}

// Shared background: WebGL shader, grain cursor. Used by every page.
const $ = (s, r = document) => r.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
/* =========================================================
   WebGL background: domain-warped fbm, reacts to pointer + scroll velocity
   ========================================================= */
const pointer = { x: .5, y: .5, tx: .5, ty: .5 };
let scrollVel = 0, lastY = scrollY;
(function gl() {
  const c = $('#gl');
  const g = c.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!g) { c.style.background = 'radial-gradient(circle at 70% 30%, #1a0d07, #07080a 60%)'; return; }
  const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
  const fs = `
  precision highp float;
  uniform vec2 r; uniform float t; uniform vec2 m; uniform float s; uniform float v; uniform float red;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float a=.5, o=0.; mat2 R=mat2(.8,.6,-.6,.8); for(int i=0;i<5;i++){ o+=a*n(p); p=R*p*2.02; a*=.5; } return o; }
  void main(){
    vec2 uv = (gl_FragCoord.xy - .5*r) / r.y;
    vec2 mp = (m - .5) * vec2(r.x/r.y, 1.);
    float tt = t*.045 + s*.00025;
    vec2 q = vec2(fbm(uv*1.6 + tt), fbm(uv*1.6 + vec2(5.2,1.3) - tt));
    vec2 w = vec2(fbm(uv*1.6 + 3.*q + vec2(1.7,9.2) + .15*t*.1), fbm(uv*1.6 + 3.*q + vec2(8.3,2.8)));
    float f = fbm(uv*1.6 + 3.5*w + .4*(mp-uv)*exp(-2.*length(uv-mp)));
    // contour lines — like a topo map / heat trace
    float lines = smoothstep(.0, .06, abs(fract(f*7.) - .5) - .38 + .05*v);
    vec3 hot = mix(vec3(1.,.35,.12), vec3(1.,.12,.24), red);
    vec3 cool = mix(vec3(.37,.9,1.), vec3(1.,.6,.12), red);
    vec3 col = vec3(.027,.031,.039);
    col += hot * pow(f, 3.2) * .55;
    col += cool * pow(length(q), 6.) * .05;
    col += mix(cool, hot, f) * (1.-lines) * (.06 + .14*smoothstep(.6,0.,length(uv-mp)) + .08*v);
    col *= 1. - .55*length(uv*vec2(.7,1.));    gl_FragColor = vec4(col, 1.);
  }`;
  const sh = (type, src) => { const x = g.createShader(type); g.shaderSource(x, src); g.compileShader(x); if (!g.getShaderParameter(x, g.COMPILE_STATUS)) console.warn(g.getShaderInfoLog(x)); return x; };
  const pr = g.createProgram();
  g.attachShader(pr, sh(g.VERTEX_SHADER, vs)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, fs));
  g.linkProgram(pr); g.useProgram(pr);
  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), g.STATIC_DRAW);
  const loc = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
  const U = n => g.getUniformLocation(pr, n);
  const ur = U('r'), ut = U('t'), um = U('m'), us = U('s'), uv = U('v'), ured = U('red');
  const DPR = Math.min(devicePixelRatio, 1.5) * .6; // render under-res; the blur is part of the look
  const resize = () => { c.width = innerWidth * DPR; c.height = innerHeight * DPR; g.viewport(0, 0, c.width, c.height); };
  resize(); addEventListener('resize', resize);
  let redMix = 0, visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) requestAnimationFrame(loop); });
  const t0 = performance.now();
  function loop(now) {
    pointer.x += (pointer.tx - pointer.x) * .05; pointer.y += (pointer.ty - pointer.y) * .05;
    redMix += ((document.body.classList.contains('redline') ? 1 : 0) - redMix) * .05;
    g.uniform2f(ur, c.width, c.height);
    g.uniform1f(ut, reduced ? 10 : (now - t0) / 1000);
    g.uniform2f(um, pointer.x, 1 - pointer.y);
    g.uniform1f(us, scrollY); g.uniform1f(uv, Math.min(scrollVel, 1)); g.uniform1f(ured, redMix);
    g.drawArrays(g.TRIANGLES, 0, 3);
    if (visible && !reduced) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* =========================================================
   Cursor
   ========================================================= */
const cur = $('#cursor');
let cx = innerWidth / 2, cy = innerHeight / 2, kx = cx, ky = cy;
addEventListener('pointermove', e => {
  cx = e.clientX; cy = e.clientY;
  pointer.tx = cx / innerWidth; pointer.ty = cy / innerHeight;
});
if (finePointer) {
  (function follow() { kx += (cx - kx) * .22; ky += (cy - ky) * .22; cur.style.transform = `translate(${kx}px,${ky}px)`; requestAnimationFrame(follow); })();
  document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a, button, .contact-big')));
}

let lastScroll = scrollY;
addEventListener('scroll', () => { scrollVel = Math.min(1, scrollVel + Math.abs(scrollY - lastScroll) / 600); lastScroll = scrollY; }, { passive: true });
(function decay() { scrollVel *= .94; requestAnimationFrame(decay); })();

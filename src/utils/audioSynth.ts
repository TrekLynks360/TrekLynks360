// Procedural Web Audio API for immersive Himalayan mountain wind & chime
class AlpineAudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private chimeTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.isPlaying = true;

      // 1. Pink/Brown noise generator for gentle mountain wind
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Filter for deep mountain wind resonance
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(3.5, this.ctx.currentTime);

      // Low frequency oscillator (LFO) to modulate wind gusts
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // slow swell
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      lfo.start();

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.15, this.ctx.currentTime + 2);

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.noiseNode.start();

      // Gentle prayer chime every ~15 seconds
      this.playChime();
      this.chimeTimer = window.setInterval(() => {
        if (this.isPlaying && Math.random() > 0.4) {
          this.playChime();
        }
      }, 14000);
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playChime() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      // Tibetan singing bowl harmonic ~528Hz or 432Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);

      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.04, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 4.6);
    } catch {
      // ignore
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.noiseNode?.disconnect();
        } catch {
          // ignore
        }
      }, 1100);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const alpineAudio = new AlpineAudioSynth();

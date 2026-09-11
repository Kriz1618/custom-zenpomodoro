/**
 * Web Audio API synthesizer for serene chime tones & ambient soundscapes.
 * Completely offline, reliable, and smooth.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientNodes: Map<string, { gainNode: GainNode; stopFn: () => void }> = new Map();

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play timer completion chime
   */
  playChime(type: 'zenBell' | 'softChime' | 'singingBowl' = 'zenBell', volume: number = 0.7) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.min(Math.max(volume, 0), 1), now);
      masterGain.connect(ctx.destination);

      if (type === 'zenBell') {
        // Tibetan / Zen Bell harmonic sound
        const freqs = [440, 880, 1320, 1760];
        const gains = [0.6, 0.3, 0.15, 0.05];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(gains[idx], now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 3.5);
        });
      } else if (type === 'singingBowl') {
        // Warm resonant bowl chime
        const baseFreq = 261.63; // C4
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.002, now + 4);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 4.5);
      } else {
        // Soft major triad chime (C5, E5, G5)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.12;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 2.5);
        });
      }
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }

  /**
   * Play uplifting task accomplishment chime
   */
  playSuccessSound(volume: number = 0.5) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.5, now);
      masterGain.connect(ctx.destination);

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch (e) {
      console.warn('Success sound failed:', e);
    }
  }

  /**
   * Toggle or update synthesized ambient track (Rain, Ocean, Breeze, Fire, Cafe)
   */
  setAmbientTrack(id: string, isPlaying: boolean, volume: number) {
    try {
      const ctx = this.getContext();

      // If track is already playing, update gain or stop if not playing
      if (this.ambientNodes.has(id)) {
        const node = this.ambientNodes.get(id)!;
        if (!isPlaying || volume <= 0) {
          node.stopFn();
          this.ambientNodes.delete(id);
        } else {
          node.gainNode.gain.setTargetAtTime(volume * 0.3, ctx.currentTime, 0.1);
        }
        return;
      }

      if (!isPlaying || volume <= 0) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
      masterGain.connect(ctx.destination);

      let stopFn = () => {};

      if (id === 'rain') {
        // Pink noise generator for gentle rain
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();

        stopFn = () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (e) {}
        };
      } else if (id === 'waves') {
        // Modulated noise for ocean waves
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        // LFO for wave swelling
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.12; // wave every ~8s

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 350;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(masterGain);

        noise.start();
        lfo.start();

        stopFn = () => {
          try {
            noise.stop();
            lfo.stop();
            noise.disconnect();
          } catch (e) {}
        };
      } else if (id === 'breeze') {
        // Filtered soft white noise with subtle LFO
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.05;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 2;

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();

        stopFn = () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (e) {}
        };
      } else if (id === 'fire') {
        // Cozy fire crackle (brownian rumble + random crackle pulses)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          // Random crackle pop
          const crackle = Math.random() > 0.997 ? (Math.random() * 0.4) : 0;
          data[i] = lastOut * 0.5 + crackle;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();

        stopFn = () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (e) {}
        };
      } else if (id === 'cafe') {
        // Cafe ambient low hum
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.04;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();

        stopFn = () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (e) {}
        };
      }

      this.ambientNodes.set(id, { gainNode: masterGain, stopFn });
    } catch (e) {
      console.warn('Ambient sound setup failed:', e);
    }
  }

  stopAllAmbient() {
    this.ambientNodes.forEach((node) => node.stopFn());
    this.ambientNodes.clear();
  }
}

export const audioSynth = new AudioSynthesizer();

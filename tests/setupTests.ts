import '@testing-library/jest-dom';

// Mock Web Audio API for Vitest environment if not defined in jsdom
if (typeof window !== 'undefined' && !window.AudioContext) {
  class MockAudioContext {
    state = 'suspended';
    createGain() {
      return {
        gain: { value: 1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        disconnect: () => {},
      };
    }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { value: 440, setValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {},
      };
    }
    createBufferSource() {
      return {
        buffer: null,
        loop: false,
        connect: () => {},
        start: () => {},
        stop: () => {},
      };
    }
    createBiquadFilter() {
      return {
        type: 'lowpass',
        frequency: { value: 1000 },
        Q: { value: 1 },
        connect: () => {},
      };
    }
    createBuffer() {
      return {
        getChannelData: () => new Float32Array(100),
      };
    }
    resume() {
      this.state = 'running';
      return Promise.resolve();
    }
    suspend() {
      this.state = 'suspended';
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
  }

  // @ts-ignore
  window.AudioContext = MockAudioContext;
  // @ts-ignore
  window.webkitAudioContext = MockAudioContext;
}

// Mock Notification API
if (typeof window !== 'undefined' && !window.Notification) {
  // @ts-ignore
  window.Notification = {
    permission: 'default',
    requestPermission: () => Promise.resolve('granted'),
  };
}

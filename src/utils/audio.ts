// Procedural ambient sound synthesis using Web Audio API

export type AmbientSoundType = 'rain' | 'alpha' | 'stream';

let audioCtx: AudioContext | null = null;
let ambientGain: GainNode | null = null;
let ambientSources: (AudioNode | AudioBufferSourceNode | OscillatorNode)[] = [];
let isPlayingAmbient = false;
let currentSoundType: AmbientSoundType = 'rain';

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playChimeSuccess(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Gentle melodic arpeggio (C5 - E5 - G5 - C6)
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 1.3);
    });
  } catch {
    // Graceful fallback if audio context blocked
  }
}

export function playGentlePop(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // ignore
  }
}

export function setAmbientVolume(volume: number): void {
  if (ambientGain && audioCtx) {
    try {
      const clamped = Math.max(0, Math.min(1, volume));
      ambientGain.gain.linearRampToValueAtTime(clamped, audioCtx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }
}

function stopCurrentAmbient(): void {
  if (ambientGain && audioCtx) {
    try {
      ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }
  setTimeout(() => {
    ambientSources.forEach(src => {
      try {
        if ('stop' in src && typeof src.stop === 'function') {
          src.stop();
        }
        src.disconnect();
      } catch {
        // ignore
      }
    });
    ambientSources = [];
    isPlayingAmbient = false;
  }, 400);
}

export function toggleLofiRainAmbient(enable: boolean, volume = 0.25, soundType: AmbientSoundType = 'rain'): boolean {
  try {
    const ctx = getAudioContext();

    if (!enable) {
      stopCurrentAmbient();
      return false;
    }

    if (isPlayingAmbient && currentSoundType === soundType) {
      setAmbientVolume(volume);
      return true;
    }

    // Stop previous if changing sound type
    if (isPlayingAmbient) {
      stopCurrentAmbient();
    }

    currentSoundType = soundType;

    if (soundType === 'alpha') {
      // Binaural alpha waves + warm drone (432Hz ambient chord)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(216, ctx.currentTime); // A3 base (432Hz subharmonic)

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(226, ctx.currentTime); // 10Hz Alpha beat (226 - 216)

      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(144, ctx.currentTime); // Sub-bass warm pad

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.05, ctx.currentTime);

      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

      osc1.connect(subGain);
      osc2.connect(subGain);
      osc3.connect(subGain);
      subGain.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      ambientSources = [osc1, osc2, osc3, subGain, ambientGain];
      isPlayingAmbient = true;
      return true;
    }

    // Create pink noise for gentle rain or stream
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
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
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter frequency according to sound type
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(soundType === 'stream' ? 1400 : 750, ctx.currentTime);

    // Warm chord drone in F major (gentle study background)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(174.61, ctx.currentTime); // F3

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(261.63, ctx.currentTime); // C4

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.025, ctx.currentTime);

    osc1.connect(droneGain);
    osc2.connect(droneGain);

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

    whiteNoise.connect(filter);
    filter.connect(ambientGain);
    droneGain.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    whiteNoise.start();
    osc1.start();
    osc2.start();

    ambientSources = [whiteNoise, osc1, osc2, filter, droneGain, ambientGain];
    isPlayingAmbient = true;
    return true;
  } catch {
    return false;
  }
}

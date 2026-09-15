import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAmbientSound } from '../../src/hooks/useAmbientSound';
import { AmbientTrack } from '../../src/types/pomodoro';

import { audioSynth } from '../../src/utils/audioSynth';

vi.mock('../../src/utils/audioSynth', () => ({
  audioSynth: {
    setAmbientTrack: vi.fn(),
    stopAllAmbient: vi.fn(),
  },
}));

describe('when useAmbientSound is initialized', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with 5 tracks, all not playing', () => {
    const { result } = renderHook(() => useAmbientSound());

    expect(result.current.tracks).toHaveLength(5);
    result.current.tracks.forEach((track: AmbientTrack) => {
      expect(track.isPlaying).toBe(false);
    });
  });

  it('should initialize masterMute as false', () => {
    const { result } = renderHook(() => useAmbientSound());

    expect(result.current.masterMute).toBe(false);
  });

  it('should initialize activeTracksCount as 0', () => {
    const { result } = renderHook(() => useAmbientSound());

    expect(result.current.activeTracksCount).toBe(0);
  });
});

describe('when toggleTrack is called', () => {
  it('should toggle a track from false to true', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleTrack('rain');
    });

    expect(result.current.tracks.find((t) => t.id === 'rain')?.isPlaying).toBe(true);
  });

  it('should toggle a track back to false', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleTrack('rain');
    });
    act(() => {
      result.current.toggleTrack('rain');
    });

    expect(result.current.tracks.find((t) => t.id === 'rain')?.isPlaying).toBe(false);
  });

  it('should not affect other tracks', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleTrack('rain');
    });

    expect(result.current.tracks.find((t) => t.id === 'waves')?.isPlaying).toBe(false);
    expect(result.current.tracks.find((t) => t.id === 'breeze')?.isPlaying).toBe(false);
  });
});

describe('when updateTrackVolume is called', () => {
  it('should update the volume of the specified track', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.updateTrackVolume('rain', 0.8);
    });

    expect(result.current.tracks.find((t) => t.id === 'rain')?.volume).toBe(0.8);
  });

  it('should not affect other tracks', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.updateTrackVolume('rain', 0.8);
    });

    expect(result.current.tracks.find((t) => t.id === 'waves')?.volume).toBe(0.5);
    expect(result.current.tracks.find((t) => t.id === 'breeze')?.volume).toBe(0.4);
  });
});

describe('when toggleMasterMute is called', () => {
  it('should toggle masterMute from false to true', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleMasterMute();
    });

    expect(result.current.masterMute).toBe(true);
  });

  it('should toggle masterMute back to false', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleMasterMute();
    });
    act(() => {
      result.current.toggleMasterMute();
    });

    expect(result.current.masterMute).toBe(false);
  });
});

describe('when stopAll is called', () => {
  it('should stop all tracks', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleTrack('rain');
    });
    act(() => {
      result.current.toggleTrack('waves');
    });

    act(() => {
      result.current.stopAll();
    });

    result.current.tracks.forEach((track) => {
      expect(track.isPlaying).toBe(false);
    });
  });

  it('should call audioSynth.stopAllAmbient', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.stopAll();
    });

    expect(audioSynth.stopAllAmbient).toHaveBeenCalled();
  });
});

describe('activeTracksCount', () => {
  it('should be 0 when no tracks are playing', () => {
    const { result } = renderHook(() => useAmbientSound());

    expect(result.current.activeTracksCount).toBe(0);
  });

  it('should count only playing tracks', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleTrack('rain');
    });
    act(() => {
      result.current.toggleTrack('waves');
    });

    expect(result.current.activeTracksCount).toBe(2);
  });

  it('should not count playing tracks when masterMute is true', () => {
    const { result } = renderHook(() => useAmbientSound());

    act(() => {
      result.current.toggleTrack('rain');
    });
    act(() => {
      result.current.toggleTrack('waves');
    });
    act(() => {
      result.current.toggleMasterMute();
    });

    expect(result.current.activeTracksCount).toBe(0);
  });
});
import { useState, useCallback, useEffect } from 'react';
import { AmbientTrack } from '../types/pomodoro';
import { audioSynth } from '../utils/audioSynth';

const INITIAL_TRACKS: AmbientTrack[] = [
  { id: 'rain', name: 'Gentle Rain', iconName: 'CloudRain', volume: 0.5, isPlaying: false },
  { id: 'waves', name: 'Ocean Waves', iconName: 'Waves', volume: 0.5, isPlaying: false },
  { id: 'breeze', name: 'Forest Breeze', iconName: 'Trees', volume: 0.4, isPlaying: false },
  { id: 'fire', name: 'Cozy Fire', iconName: 'Flame', volume: 0.5, isPlaying: false },
  { id: 'cafe', name: 'Coffee Shop', iconName: 'Coffee', volume: 0.4, isPlaying: false },
];

export function useAmbientSound() {
  const [tracks, setTracks] = useState<AmbientTrack[]>(INITIAL_TRACKS);
  const [masterMute, setMasterMute] = useState<boolean>(false);

  // Sync ambient sound synthesizer when track state changes
  useEffect(() => {
    tracks.forEach((track) => {
      const effectiveVolume = masterMute ? 0 : track.volume;
      audioSynth.setAmbientTrack(track.id, track.isPlaying && !masterMute, effectiveVolume);
    });
  }, [tracks, masterMute]);

  const toggleTrack = useCallback((id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPlaying: !t.isPlaying } : t))
    );
  }, []);

  const updateTrackVolume = useCallback((id: string, volume: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, volume } : t))
    );
  }, []);

  const toggleMasterMute = useCallback(() => {
    setMasterMute((prev) => !prev);
  }, []);

  const stopAll = useCallback(() => {
    setTracks((prev) => prev.map((t) => ({ ...t, isPlaying: false })));
    audioSynth.stopAllAmbient();
  }, []);

  const activeTracksCount = tracks.filter((t) => t.isPlaying && !masterMute).length;

  return {
    tracks,
    masterMute,
    activeTracksCount,
    toggleTrack,
    updateTrackVolume,
    toggleMasterMute,
    stopAll,
  };
}

import React, { useRef, useEffect } from "react";

const AudioPlayer = ({ audioFile, onAudioEnd, onTimeUpdate, audioRef }) => {
  useEffect(() => {
    const loadAudio = async () => {
      if (audioFile && audioRef.current) {
        const blob = new Blob([audioFile], { type: audioFile.type });
        audioRef.current.src = URL.createObjectURL(blob);
        audioRef.current.play();
      }
    };

    loadAudio();
  }, [audioFile, audioRef]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      onTimeUpdate(audioRef.current.currentTime);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", onAudioEnd);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioRef.current.removeEventListener("ended", onAudioEnd);
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioRef, onAudioEnd, onTimeUpdate]);

  return <audio ref={audioRef} controls />;
};

export default AudioPlayer;

import React, { useRef, useEffect } from "react";

const AudioPlayer = ({ audioFile, onAudioEnd, onTimeUpdate }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const loadAudio = async () => {
      if (audioFile) {
        const blob = new Blob([audioFile], { type: audioFile.type });
        audioRef.current.src = URL.createObjectURL(blob);
        audioRef.current.play();
      }
    };

    loadAudio();
  }, [audioFile]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", onAudioEnd);
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          onTimeUpdate(audioRef.current.currentTime);
        }
      });

      return () => {
        audioRef.current.removeEventListener("ended", onAudioEnd);
        audioRef.current.removeEventListener("timeupdate", () => {
          if (audioRef.current) {
            onTimeUpdate(audioRef.current.currentTime);
          }
        });
      };
    }
  }, [audioFile, onAudioEnd, onTimeUpdate]);

  return <audio ref={audioRef} controls />;
};

export default AudioPlayer;

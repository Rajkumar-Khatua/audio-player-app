import { useEffect, useRef, useState } from "react";
import FileUploader from "./components/FileUploader/FileUploader";
import Playlist from "./components/Playlist/Playlist";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    // Retrieve last played audio from browser storage on component mount
    const storedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];

    // Retrieve audio content for each playlist item
    const retrievedPlaylist = storedPlaylist.map((item) => {
      const fileKey = `file_${storedPlaylist.indexOf(item)}`;
      const storedFileContent = localStorage.getItem(fileKey);

      // Reconstruct Blob
      if (storedFileContent) {
        const blob = base64StringToBlob(storedFileContent);
        return { ...item, file: new File([blob], item.name) };
      } else {
        return item;
      }
    });

    setPlaylist(retrievedPlaylist);

    const storedLastPlayed =
      JSON.parse(localStorage.getItem("lastPlayed")) || null;

    if (storedLastPlayed) {
      setCurrentAudioIndex(storedLastPlayed.index);
      setLastPlayed(storedLastPlayed);
    }
  }, []);

  // Helper function to convert base64 string to Blob
  const base64StringToBlob = (base64String) => {
    const parts = base64String.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const byteCharacters = atob(parts[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  useEffect(() => {
    // Load audio file on playlist change
    setAudioFile(playlist[currentAudioIndex]?.file);
  }, [playlist, currentAudioIndex]);

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);

    const newPlaylist = [
      ...playlist,
      ...fileArray.map((file) => ({ name: file.name, file })),
    ];

    setPlaylist(newPlaylist);
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));

    // Store files directly in local storage
    fileArray.forEach((file, index) => {
      const fileKey = `file_${newPlaylist.length - fileArray.length + index}`;
      const reader = new FileReader();
      reader.onload = (event) => {
        localStorage.setItem(fileKey, event.target.result);
      };
      reader.readAsDataURL(file);
    });

    // Auto-play the newly added file
    setCurrentAudioIndex(newPlaylist.length - 1);
  };

  const handlePlaylistItemClick = (index) => {
    setCurrentAudioIndex(index);
  };

  const handleAudioEnd = () => {
    // Auto-play next audio on playback completion
    setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handleTimeUpdate = (currentTime) => {
    // Update last played position in browser storage
    setLastPlayed((prevLastPlayed) => ({
      index: currentAudioIndex,
      position: Math.floor(currentTime),
    }));
    localStorage.setItem("lastPlayed", JSON.stringify(lastPlayed));
  };

  useEffect(() => {
    const loadAudio = async () => {
      if (audioFile && audioRef.current) {
        const blob = new Blob([audioFile], { type: audioFile.type });
        audioRef.current.src = URL.createObjectURL(blob);

        // Check if there's a stored last played position
        const storedLastPlayed =
          JSON.parse(localStorage.getItem("lastPlayed")) || null;

        if (storedLastPlayed && storedLastPlayed.index === currentAudioIndex) {
          audioRef.current.currentTime = storedLastPlayed.position;
        }

        audioRef.current.play();
      }
    };

    loadAudio();
  }, [audioFile, currentAudioIndex]);

  const handleDelete = () => {
    const newPlaylist = [...playlist];
    newPlaylist.splice(currentAudioIndex, 1);
    setPlaylist(newPlaylist);
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));
  };

  const handleDeleteAll = () => {
    localStorage.clear();
    setPlaylist([]);
  };

  const onPlay = (index) => {
    setCurrentAudioIndex(index);
  };

  return (
    <div>
      <FileUploader onFileUpload={handleFileUpload} />
      <Playlist
        playlist={playlist}
        onPlaylistItemClick={handlePlaylistItemClick}
        onDelete={handleDelete}
        onAllDelete={handleDeleteAll}
        onPlay={onPlay}
      />
      <AudioPlayer
        audioFile={audioFile}
        onAudioEnd={handleAudioEnd}
        onTimeUpdate={handleTimeUpdate}
        audioRef={audioRef}
      />
    </div>
  );
};

export default App;

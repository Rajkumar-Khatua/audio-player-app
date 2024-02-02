import "./App.css";
import { useEffect, useRef, useState } from "react";
import FileUploader from "./components/FileUploader/FileUploader";
import Playlist from "./components/Playlist/Playlist";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";

// App component is the main component that holds the state of the playlist, the current audio index, the last played position, the audio file, and the playing state.
// The App component also contains the logic to handle file uploads, playlist item clicks, audio playback completion, and time updates.
// The App component uses the FileUploader, Playlist, and AudioPlayer components to allow users to upload audio files, display the playlist, and play audio files.
// The App component is a class component that uses the useState and useEffect hooks to manage the state and lifecycle of the component.
// The App component is the main component that holds the state of the playlist, the current audio index, the last played position, the audio file, and the playing state.
// The App component also contains the logic to handle file uploads, playlist item clicks, audio playback completion, and time updates.



const App = () => {
  // State to store the playlist of audio files and set the playlist of audio files 
  const [playlist, setPlaylist] = useState([]);
  // State to store the current audio index and set the current audio index 
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  // State to store the last played position and set the last played position 
  const [lastPlayed, setLastPlayed] = useState(null);
  // State to store the audio file and set the audio file 
  const [audioFile, setAudioFile] = useState(null);
  // State to store the playing state and set the playing state
  const [isPlaying, setIsPlaying] = useState(false);
  // Ref to store the audio element reference 
  const audioRef = useRef(null);

  useEffect(() => {
    // Retrieve last played audio from browser storage on component mount
    const storedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];

    // Retrieve audio content for each playlist item

    const retrievedPlaylist = storedPlaylist.map((item) => {
      // Retrieve file content from local storage by key and index 
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
    // Set the playlist state with the retrieved playlist 
    setPlaylist(retrievedPlaylist);
    // Retrieve last played audio from browser storage on component mount 
    const storedLastPlayed =
      JSON.parse(localStorage.getItem("lastPlayed")) || null;
    // Set the current audio index and last played position if available 
    if (storedLastPlayed) {
      setCurrentAudioIndex(storedLastPlayed.index);
      setLastPlayed(storedLastPlayed);
    }
  }, []);

  // Helper function to convert base64 string to Blob
  const base64StringToBlob = (base64String) => {
    // Split the base64 string in data and contentType 
    const parts = base64String.split(";base64,");
    // Create a byte array from the base64 string 
    const contentType = parts[0].split(":")[1];
    // Create a Blob from the byte array and the content type 
    const byteCharacters = atob(parts[1]);
    // Create an array buffer from the byte characters 
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      // Create a Uint8Array from the byte numbers 
      const byteArray = new Uint8Array(byteNumbers);
      // Push the Uint8Array to the byte arrays 
      byteArrays.push(byteArray);
    }
    // Return the Blob 
    return new Blob(byteArrays, { type: contentType });
  };

  // Update audio file on playlist change 
  useEffect(() => {
    // Load audio file on playlist change
    setAudioFile(playlist[currentAudioIndex]?.file);
    // Update last played position in browser storage 
  }, [playlist, currentAudioIndex]);

  // Update last played position in browser storage on audio end 
  const handleFileUpload = (files) => {
    // Convert files to array and add to playlist state 
    const fileArray = Array.from(files);

    // Add files to playlist state and local storage 
    const newPlaylist = [
      // Add new files to the beginning of the playlist 
      ...playlist,
      // Add new files to the end of the playlist 
      ...fileArray.map((file) => ({ name: file.name, file })),
    ];

    // Update playlist state and local storage 
    setPlaylist(newPlaylist);
    // Store playlist in local storage 
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));

    // Store files directly in local storage
    fileArray.forEach((file, index) => {
      // Create a key for each file in local storage 
      const fileKey = `file_${newPlaylist.length - fileArray.length + index}`;
      // Read file content as data URL and store in local storage 
      const reader = new FileReader();
      // Store file content in local storage 
      reader.onload = (event) => {
        localStorage.setItem(fileKey, event.target.result);
      };
      // Read file content as data URL 
      reader.readAsDataURL(file);
    });

    // Auto-play the newly added file
    setCurrentAudioIndex(newPlaylist.length - 1);
    setIsPlaying(true);
  };

  // Handle playlist item click 
  const handlePlaylistItemClick = (index) => {
    // Set the current audio index and play the audio 
    setCurrentAudioIndex(index);
    // Play the audio 
    setIsPlaying(true);
  };

  // Handle audio playback completion 
  const handleAudioEnd = () => {
    // Auto-play next audio on playback completion
    setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  // Handle time update
  const handleTimeUpdate = (currentTime) => {
    // Update last played position in browser storage
    const updatedLastPlayed = {
      // Store the current audio index and last played position 
      index: currentAudioIndex,
      // Store the current time in seconds 
      position: Math.floor(currentTime),
    };
    // Set the last played position state and store in local storage 
    setLastPlayed(updatedLastPlayed);
    // Store last played position in local storage 
    localStorage.setItem("lastPlayed", JSON.stringify(updatedLastPlayed));
  };

  // Load audio on playlist change 
  useEffect(() => {
    // Load audio on playlist change 
    const loadAudio = async () => {
      // Check if there's an audio file and audio element 
      if (audioFile && audioRef.current) {
        // Create a Blob from the audio file 
        const blob = new Blob([audioFile], { type: audioFile.type });
        // Create a URL for the Blob and set it as the audio element source 
        audioRef.current.src = URL.createObjectURL(blob);
        // Check if there's a stored last played position
        // Retrieve last played audio from browser storage on component mount
        const storedLastPlayed =
          JSON.parse(localStorage.getItem("lastPlayed")) || null;

          // Set the current audio index and last played position if available 
        if (storedLastPlayed && storedLastPlayed.index === currentAudioIndex) {
          audioRef.current.currentTime = storedLastPlayed.position;
        }
        // Play the audio 
        audioRef.current.play();
        setIsPlaying(true);
      }
    };
    // Load audio on playlist change 
    loadAudio();
    // Update last played position in browser storage 
  }, [audioFile, currentAudioIndex]);

  // Handle delete playlist item 
  const handleDelete = () => {
    // Remove the current audio from the playlist 
    const newPlaylist = [...playlist];
    newPlaylist.splice(currentAudioIndex, 1);
    setPlaylist(newPlaylist);
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));
    setIsPlaying(false);
  };

  // Handle isPlaying change 
  const handleIsPlayingChange = (playing) => {
    setIsPlaying(playing);
  };

  // Handle delete all playlist items 
  const handleDeleteAll = () => {
    localStorage.clear();
    setPlaylist([]);
    setIsPlaying(false);
  };
  
  // Handle play audio 
  const onPlay = (index) => {
    setCurrentAudioIndex(index);
    setIsPlaying(true);
  };
  return (
    <div className="container mx-auto p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">My Audio Player App</h1>
      {/* FileUploader component */}
      <FileUploader onFileUpload={handleFileUpload} />

      {/* Main Content */}
      <div className="mt-8 flex flex-col lg:flex-row">
        {/* Playlist component */}
        <div className="w-full lg:w-2/3 pr-0 lg:pr-4">
          <Playlist
            playlist={playlist}
            onPlaylistItemClick={handlePlaylistItemClick}
            onDelete={handleDelete}
            onAllDelete={handleDeleteAll}
            isPlaying={isPlaying}
            currentAudioIndex={currentAudioIndex}
            onPlay={onPlay}
          />
        </div>

        {/* AudioPlayer component */}
        <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
          <AudioPlayer
            audioFile={audioFile}
            onAudioEnd={handleAudioEnd}
            onTimeUpdate={handleTimeUpdate}
            audioRef={audioRef}
            currentAudioName={playlist[currentAudioIndex]?.name}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

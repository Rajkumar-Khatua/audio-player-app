# Audio Player Using React and Build in Audio HTML Tag with Browser API

## Overview

The Audio Player App is a React-based web application that allows users to upload and play audio files effortlessly. It provides a seamless way to manage a playlist, offering features such as uploading new audio files, deleting specific files, and playing audio with the standard HTML audio player.

## Table of Contents

- [Audio Player App](#audio-player-app)
  - [File Structure](#file-structure)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Approach](#approach)
    - [Audio File Storage: Blob and URL.createObjectURL](#audio-file-storage-blob-and-urlcreateobjecturl)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Hosted Link/ Live Preview](#hosted-link)

## File Structure

The file structure of the Audio Player App is as follows:

    ```bash

src/
|-- components/
| |-- FileUploader/
| | |-- FileUploader.jsx
| |-- Playlist/
| | |-- Playlist.jsx
| |-- AudioPlayer/
| | |-- AudioPlayer.jsx
|-- App.css
|-- App.jsx

```

## Features

1. **File Upload**
   - Users can upload audio files (e.g., mp3).
   - Utilizes the FileUploader component to handle file uploads.

2. **Audio Storage**
   - Stores audio files using built-in Browser APIs.
   - Uses localStorage to store the playlist and individual audio files.

3. **Playlist and Now Playing View**
   - Displays a dynamic playlist in the Playlist component.
   - Shows a sleek now playing view in the AudioPlayer component.

4. **Playback Control**
   - Users can easily play any file from the playlist.
   - Playback seamlessly continues to the next file upon completion.
   - Utilizes standard HTML audio player controls for intuitive playback.

5. **Persistent State**
   - Saves the last playing audio file and its position in localStorage.
   - Upon page reload, the app loads the last playing audio file and continues playback from the last position.

6. **Standard HTML Audio Player**
   - Incorporates the standard built-in HTML audio player.
   - Avoids third-party players for simplicity, ensuring a lightweight and native experience.

7. **Responsive Design**
   - Utilizes Tailwind CSS for a responsive and mobile-friendly design.
   - Ensures a consistent and enjoyable user experience across various devices.
```

## Technologies

- React
- Tailwind CSS
- HTML
- JavaScript
- Browser APIs
- localStorage

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Rajkumar-Khatua/audio-player-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd audio-player-app
   ```

3. Install the dependencies:

   ```bash
    npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open the browser and visit `http://localhost:5173/` to view the app.

## Approach

The Audio Player App is built using React and standard HTML audio player controls. It uses the FileUploader component to handle file uploads and the Playlist component to display the playlist. The AudioPlayer component provides a sleek now playing view and seamless playback control.

The app stores audio files using built-in Browser APIs and utilizes localStorage to store the playlist and individual audio files. It also saves the last playing audio file and its position in localStorage, ensuring a persistent state across page reloads.

The app is designed to be responsive and mobile-friendly, ensuring a consistent and enjoyable user experience across various devices.

## Audio File Storage: Blob and URL.createObjectURL

### Blob

In this project, the Blob (Binary Large Object) is employed as a data structure to represent audio files. Blobs are binary data containers, allowing for the storage of audio file content in a format compatible with the HTML audio element.

The `base64StringToBlob` helper function is used to convert base64-encoded strings retrieved from `localStorage` back into Blob objects. This process ensures that the audio file data can be reconstructed accurately for playback.

```javascript
const base64StringToBlob = (base64String) => {
  // Implementation details of converting base64 to Blob
  // ...
  return new Blob(byteArrays, { type: contentType });
};
```

### URL.createObjectURL and RevokeObjectURL

The `URL.createObjectURL` method is used to create a URL for the Blob object, allowing the audio file to be played using the HTML audio player. This method generates a unique URL for the Blob, which can be used as the audio source.

```javascript
const audioBlob = base64StringToBlob(base64String);
const audioUrl = URL.createObjectURL(audioBlob);
```

## Usage

### 1. File Uploading

To add audio files to the playlist, follow these steps:

- Click on the "File Uploader" section.
- Use the "Upload File" button to select and upload MP3 files.
- Supported format: `.mp3`

### 2. Playlist Management

- The uploaded files will be displayed in the "Playlist" section.
- Click on a file in the playlist to play it.
- The currently playing audio is highlighted in the playlist.

### 3. Playback Controls

- Utilize the standard HTML audio player controls to play, pause, adjust volume, and seek through the audio.

### 4. Playback Progress

- The now playing view displays whether the audio is playing or paused.
- The project automatically proceeds to the next audio file upon completion.

### 5. Persistence

- The playlist and last played audio information persist even if the page is reloaded.

### 6. Deleting Items

- Remove a specific audio file from the playlist by clicking the "Delete" button next to it.
- Delete all files in the playlist using the "Delete All" button.

### 7. Styling

- The user interface is styled using Tailwind CSS, providing a clean and responsive design.

### 8. Continuous Playback

- The project ensures continuous playback, automatically moving to the next audio file upon completion.

### 9. Audio Position

- The project remembers the last played position of an audio file, allowing users to resume playback from the same position after a page reload.

### 10. Compatibility

- The project uses the standard built-in HTML audio player, ensuring compatibility across various web browsers without relying on third-party players.

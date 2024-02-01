import React from "react";

const Playlist = ({
  playlist,
  onPlaylistItemClick,
  onDelete,
  onAllDelete,
  onPlay,
}) => {
  return (
    <ul>
      {playlist.map((item, index) => (
        <li key={index} onClick={() => onPlaylistItemClick(index)}>
          {item.name}
          <button onClick={() => onPlay(index)}>Play</button>
          <button onClick={() => onDelete(index)}>Delete</button>
        </li>
      ))}
      {playlist.length > 0 && (
        <li>
          <button onClick={() => onAllDelete()}>Delete All</button>
        </li>
      )}
    </ul>
  );
};

export default Playlist;

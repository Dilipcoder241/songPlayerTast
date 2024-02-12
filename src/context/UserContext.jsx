
import React, { createContext, useState, useRef } from "react";
import { toast } from 'react-toastify';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [musFiles, setmusFiles] = useState([]);
  const [audiourl, setaudiourl] = useState("");
  const songbtn = useRef(null);
  const addMusic = useRef(null);
  const videoRef = useRef(null);
  const [currentSongName, setCurrentSongName] = useState("");
  const [nextSongNo, setnextSongNo] = useState(0);
  const songAdded = () => toast.success("Song Added Successfully" , {position: "top-center"});
  const songDeleted = () => toast.success("Song Deleted Successfully" , {position: "top-center"});
  const UploadError = () => toast.error("Please Upload a mp3 file", {position: "top-center"});



  const submitfile = (event) => {
    const file = event.target.files[0];
    if(file.name.split('.').pop() !== "mp3"){ UploadError(); return }

    var reader = new FileReader();
    reader.onload = function (event) {
      var base64String = event.target.result;
      setmusFiles([...musFiles, { name: file.name, source: base64String }]);
      addSong(file.name, base64String);
    };

    reader.readAsDataURL(file);

  };

  const changemus = (url, name, currentSong) => {
    setCurrentSongName(name);
    localStorage.setItem("LastSongName", name);
    setnextSongNo(currentSong);
    setaudiourl(url);
    if (songbtn.current.paused) {
      songbtn.current.play();
      videoRef.current.play();
    }
    else {
      songbtn.current.pause();
      videoRef.current.pause();
    }
  }

  function addSong(name, source) {
    var request = indexedDB.open('MySongDatabase', 1);
    var db;

    request.onerror = function (event) {
      console.log("Database error: " + event.target.errorCode);
    };
    request.onupgradeneeded = function (event) {
      db = event.target.result;
      var objectStore = db.createObjectStore("songs", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("source", "source", { unique: false });

    };

    request.onsuccess = function (event) {
      db = event.target.result;

      var transaction = db.transaction(["songs"], "readwrite");
      var objectStore = transaction.objectStore("songs");
      var song = {
        name: name,
        source: source
      };
      var request = objectStore.add(song);

      request.onsuccess = function (event) {
        songAdded();
      };

      request.onerror = function (event) {
        console.log("Error adding song: " + event.target.errorCode);
      };
    };



  }

  function retrieveSongs() {

    try {
      const request = indexedDB.open('MySongDatabase', 1);

      request.onerror = function (event) {
        console.error('Database error: ' + event.target.errorCode);
      };

      request.onupgradeneeded = function (event) {
        db = event.target.result;
        var objectStore = db.createObjectStore("songs", { keyPath: "id", autoIncrement: true });
        console.log(objectStore);
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("source", "source", { unique: false });

      };

      request.onsuccess = function (event) {
        const db = event.target.result;

        const transaction = db.transaction(['songs'], 'readonly');

        const objectStore = transaction.objectStore('songs');

        const cursor = objectStore.openCursor();
        const songsData = [];
        cursor.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            songsData.push(cursor.value);
            cursor.continue();
          } else {
            setmusFiles(songsData);
          }
        };
      }
    } catch (error) {
      console.error('Error retrieving data from IndexedDB:', error);
    }
  };

  const DeleteSong = (source) => {
    if(audiourl == source){
      setaudiourl('');
      setCurrentSongName('');
      videoRef.current.pause();
    }
    setmusFiles(musFiles.filter((song) => song.source != source));
    var request = indexedDB.open('MySongDatabase', 1);
    var db;

    request.onupgradeneeded = function (event) {
      db = event.target.result;
      var objectStore = db.createObjectStore("songs", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("source", "source", { unique: false });

    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['songs'], "readwrite");
      const objectStore = transaction.objectStore('songs');

      const index = objectStore.index('source');
      const getRequest = index.getKey(source);

      getRequest.onsuccess = function (event) {
        const songId = event.target.result;
        if (songId !== undefined) {
          const deleteRequest = objectStore.delete(songId);
          deleteRequest.onsuccess = function (event) {
            songDeleted();
          };
          deleteRequest.onerror = function (event) {
            console.error('Error deleting song:', event.target.error);
          };
        } else {
          console.log('Song with source ' + source + ' not found');
        }
      };

    };

    request.onerror = function (event) {
      console.log('Error opening database: ' + event.target.errorCode);
    };
  }

  function setTolastPlay() {
    let index = musFiles.findIndex(file => file.name === localStorage.getItem("LastSongName"));
    setaudiourl(musFiles[index]?.source);
    if(index>=0){
      songbtn.current.currentTime = localStorage.getItem("lastTime");
      songbtn.current.play();
      setCurrentSongName(musFiles[index]?.name)
    }
  }

  const playnextSong = () => {
    if(musFiles.length > nextSongNo+1){
      setaudiourl(musFiles[nextSongNo+1]?.source);
      setnextSongNo(nextSongNo+1);
      localStorage.setItem("LastSongName", musFiles[nextSongNo+1].name);
    }
  }

  const updateTimeSong = () => {
    localStorage.setItem('lastTime', Math.floor(songbtn.current.currentTime));
  }



  return (
    <UserContext.Provider value={{ submitfile, musFiles, setmusFiles, changemus, audiourl, setaudiourl, addSong, retrieveSongs, setTolastPlay, playnextSong, updateTimeSong, songbtn, addMusic, videoRef, currentSongName, setCurrentSongName, nextSongNo, setnextSongNo , DeleteSong }}>
      {children}
    </UserContext.Provider>
  )
}


export { UserContextProvider, UserContext };

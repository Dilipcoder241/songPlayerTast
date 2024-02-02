import { useContext, useEffect, useRef } from "react";
import Playlist from "./components/Playlist";
import Playing from "./components/Playing";
import Navbar from "./components/Navbar";
import { UserContext } from "./context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";


function App() {
  const {videoRef, submitfile , musFiles  ,audiourl , retrieveSongs , setTolastPlay ,playnextSong , updateTimeSong ,  songbtn , addMusic} = useContext(UserContext);

  useEffect(() => {
    songbtn.current.play();
  }, [audiourl])

  useEffect(() => {
    retrieveSongs();
  }, [])

  useEffect(() => {
    setTolastPlay();
  }, [musFiles])


  return (
    <div className="h-screen w-screen relative bg-[#161A30] text-[#F0ECE5]">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} transition={{ duration: 2 }} className="bg h-full w-full absolute bg-[url('/stress.jpg')] bg-no-repeat bg-cover blur-[3px] opacity-15"></motion.div>
      <div className="main">
        <Navbar />
        <ToastContainer/>
        <div className="flex relative z-10 items-center justify-center mt-5 flex-col md:flex-row">
          <input ref={addMusic} type="file" onChange={submitfile} className="hidden"/>
          <Playing />
          <Playlist/>
        </div>
        <audio ref={songbtn} src={audiourl} onTimeUpdate={updateTimeSong} onEnded={playnextSong} onPause={() => { videoRef.current.pause() }} onPlay={() => { videoRef.current.play() }} controls className="fixed bottom-0 w-full opacity-60"></audio>
      </div>
    </div>

  )
}

export default App

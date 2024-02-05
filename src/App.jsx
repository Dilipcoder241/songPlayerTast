import { useContext, useEffect, useRef, useState } from "react";
import Playlist from "./components/Playlist";
import Playing from "./components/Playing";
import Navbar from "./components/Navbar";
import { UserContext } from "./context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";


function App() {
  const { videoRef, submitfile, musFiles, audiourl, retrieveSongs, setTolastPlay, playnextSong, updateTimeSong, songbtn, addMusic } = useContext(UserContext);
  const [mouseposition, setmouseposition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    songbtn.current.play();
  }, [audiourl])

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      setmouseposition({ x: e.clientX, y: e.clientY });
    })

    retrieveSongs();
  }, [])

  useEffect(() => {
    setTolastPlay();
  }, [musFiles])

  const variants = {
    default: {
      x: mouseposition.x - 104,
      y: mouseposition.y - 104
    }
  }

  

  return (
    <div className="h-screen w-screen relative bg-[#161A30] text-[#F0ECE5] overflow-hidden">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} transition={{ duration: 2 }} className="bg h-full w-full absolute bg-[url('/stress.jpg')] bg-no-repeat bg-cover blur-[3px] opacity-15"></motion.div>
      <div className="main">
        <motion.div variants={variants} animate="default" className='md:block hidden pointer-events-none h-52 w-52 blur-xl absolute bg-[#2d1b628f] rounded-full'></motion.div>
        <Navbar />
        <ToastContainer />
        <div className="flex relative z-10 items-center justify-center mt-5 flex-col md:flex-row">
          <input ref={addMusic} type="file" onChange={submitfile} className="hidden" />
          <Playing />
          <Playlist />
        </div>
        <audio ref={songbtn} src={audiourl} onTimeUpdate={updateTimeSong} onEnded={playnextSong} onPause={() => { videoRef.current.pause() }} onPlay={() => { videoRef.current.play() }} controls className="fixed z-20 bottom-0 w-full opacity-60"></audio>
      </div>
    </div>

  )
}

export default App

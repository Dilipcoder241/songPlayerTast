import React, { useContext } from 'react';
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { UserContext } from '../context/UserContext';
import { motion } from "framer-motion";


function Playlist() {

  const {musFiles , changemus , addMusic } = useContext(UserContext);
  return (
    <div className="md:h-[75vh] md:w-1/3 h-[50vh] w-3/4 relative rounded-lg m-3 border-2 border-[#31304D] text-[#B6BBC4] ">
    <h1 className='text-center capitalize text-lg '>playlist</h1>
    
    <div className='songs overflow-y-scroll md:h-5/6 h-3/4 overflow-hidden mt-10'>
    {musFiles.map((mus , index)=>{
      return <button key={index} onClick={()=>{changemus(mus.source , mus.name , index)}} className="hover:bg-[#464194] hover:border-[#818181] border-y-2 text-left w-full py-2 my-4 px-4 border-[#31304D] flex items-center justify-between">{mus.name.split('.')[0]}</button>
    })}
    </div>

    <motion.div initial={{ opacity: 0 , scale:0 , rotate:150}} whileInView={{ opacity: 1 , scale:1 , rotate:360}} transition={{ duration: 2 }} className="btn absolute right-3 md:-top-7 -top-6 cursor-pointer hover:bg-[#131228] bg-[#161A30] p-4 border-2 border-[#31304D] rounded-full hover:border-[#787878]">
    <PiMusicNotesPlusFill onClick={() => { addMusic.current.click() }} className="text-2xl"/>
    </motion.div>
    
</div>
  )
}

export default Playlist
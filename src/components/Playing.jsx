import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'

function Playing() {
 
  const {videoRef , currentSongName } = useContext(UserContext)

  return (
    <div className='w-2/3 md:h-[75vh] h-[25vh] rounded-lg m-3 border-2 border-[#31304D] relative overflow-hidden'>
      <h1 className='text-center capitalize'>now playing</h1> 
      <div className='flex items-center gap-10 md:mt-10 mt-3 flex-col'>
      {currentSongName && <marquee className='border-2 border-[#31304D] w-fit py-3 px-5 text-center rounded-3xl hover:border-[#ffff]'>Now Playing {currentSongName.split('.')[0]}</marquee>}
      </div>
      <div className='absolute -bottom-[9.5vw] md:-bottom-[9.5vw] left-[50%] -translate-x-[50%]'>
        <video ref={videoRef} muted loop src="/wave.webm" className='w-[80vw] mix-blend-lighten blur-sm rounded-3xl'></video>
      </div>
    </div>
  )
}

export default Playing
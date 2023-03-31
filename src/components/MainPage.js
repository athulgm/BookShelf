import React from 'react'
import CurrentRead from './CurrentRead';
import './MainPage.css';
import ReadHistory from './ReadHistory';

function MainPage() {
  return (

    <div className='Mp-container'>

     <div className="profile">

      <div className='p-left'>
               <CurrentRead/>
      </div>
      <div className='p-right'>
              <ReadHistory />
      </div>
     </div>
    </div>
  )
}

export default MainPage
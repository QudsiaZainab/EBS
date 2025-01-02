import React, { useContext } from 'react'
import './ForYou.css';
import { StoreContext } from '../../StoreContext/StoreContext';

const ForYou = () => {
  const {setShowLogin} = useContext(StoreContext);
  return (
    <div id="for-you-comp">
      <div className='events' id="for-you">
        Please  <button onClick={()=>{setShowLogin(true)}}>Login</button> to personalize your events.
      </div>
    </div>

  )
}

export default ForYou

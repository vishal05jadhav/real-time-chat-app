import React, { useState } from 'react'
import { useAuth } from '../utils/AuthContax'
import {LogOut} from 'react-feather'

function Header() {
    const {user , handleUserLogout} = useAuth()
  return (
    <div id='header--wrapper'>
        {user ? (
            <>
              welcome :   {user.name}
               <LogOut onClick={handleUserLogout} className='header--link'/>
            </>
        ):(
            <button>login</button>
        )}
    </div>
  )
}

export default Header
import React from 'react'
import './styless.css'

const Header = ({ effect }) => {

  return (
    <div id='containerHeader'>
      <div className={effect === true ? 'animatedDiv' : 'circleDiv'}></div>
      <a href='/'><h1>Conversor de Moeda - Dólar/Real</h1></a>
      <div className={effect === true ? 'animatedDiv' : 'circleDiv'}></div>
    </div>
  )
}

export default Header
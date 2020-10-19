import React from 'react'
import './styless.css'
import Header from '../Header'

const Result = (props) => {
  const quantidade = props.location.pathname.split('=')
  const cotacao = quantidade[1].split('&')

  return (
    <>
      <Header />
      <div id='containerResult'>
        <h1><strong> $ {parseFloat(quantidade[2]).toFixed(2)}</strong> dólares na cotacação de <strong>$ {parseFloat((cotacao[0])).toFixed(2)}</strong> é igual a: <strong>R$ {(quantidade[2] * cotacao[0]).toFixed(2)}</strong> </h1>
      </div>
    </>
  )
}

export default Result
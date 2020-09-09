import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styless.css'
import { Link } from 'react-router-dom'

const Main = () => {
  const [state, setState] = useState({
    cotacao: '',
    quantidade: ''
  })

  const coletar = (evt) => {
    const valores = evt.target.value
    const key = evt.target.name
    setState(old => ({
      ...old,
      [key]: valores
    }))
  }

  const getToday = () => {
    const today = new Date()
    const hoje = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear()
    return hoje
  }

  const getYesterday = () => {
    const yesterday = new Date()
    const ontem = (yesterday.getMonth() + 1) + '-' + (yesterday.getDate() - 1) + '-' + yesterday.getFullYear()
    return ontem
  }

  useEffect(() => {
    async function Run() {
      const datas = getToday()
      const api = await axios.create({ baseURL: `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${datas}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao` })
      const res = await api.get('')


      const datas2 = getYesterday()
      const api2 = await axios.create({ baseURL: `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${datas2}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao` })
      const res2 = await api2.get('')

      if (res.data.value[0] !== undefined) {
        setState(old => ({
          ...old,
          cotacao: res.data.value[0].cotacaoVenda
        }))
      } else if (res2.data.value[0] !== undefined) {
        setState(old => ({
          ...old,
          cotacao: res2.data.value[0].cotacaoVenda
        }))
      } else {
        setState(old => ({
          ...old,
          cotacao: ''
        }))
      }

    }

    Run()
  }, [])

  return (
    <div id='containerMain'>
      <form action={`/result`}>
        <label>Cotação dólar:</label>
        <input required name='cotacao' type='number' placeholder='cotação do dólar' onChange={coletar} value={state.cotacao}></input>
        <span>{state.errorCot}</span>
        <label>Quantidade de dólar:</label>
        <input required name='quantidade' type='number' placeholder='quantidade de dólar(es)' onChange={coletar} value={state.quantidade}></input>
        <button type='submit'>Calcular</button>
      </form>
    </div>
  )
}

export default Main
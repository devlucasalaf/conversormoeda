import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styless.css'
import { useForm } from 'react-hook-form'
import Header from '../Header'

const Main = () => {
  const [state, setState] = useState({
    cotacao: '',
    quantidade: ''
  })

  const [effect, setEffect] = useState(false)

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
          cotacao: parseFloat(res.data.value[0].cotacaoVenda).toFixed(2)
        }))
      } else if (res2.data.value[0] !== undefined) {
        setState(old => ({
          ...old,
          cotacao: parseFloat(res2.data.value[0].cotacaoVenda).toFixed(2)
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

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = values => {
    setEffect(true)
    setTimeout(() => {
      window.location.href = `http://localhost:3000/result/cotacao=${state.cotacao}&quantidade=${state.quantidade}`
    }, 3000)
  }


  return (
    <div>
      <Header effect={effect} />
      <div id='containerMain'>
        <form onSubmit={handleSubmit(onSubmit)} action={`/result`}>
          <label>Cotação dólar:</label>
          <input ref={register({
            required: "Este valor é de preenchimento obrigatório.",
            pattern: {
              message: "Este valor é de preenchimento obrigatório."
            }
          })} id='cotacao' name='cotacao' placeholder='R$ 0,00' type='number' onChange={coletar} value={state.cotacao}>
          </input>
          <br />
          <span className='errorMessage'>{errors.cotacao && errors.cotacao.message}</span>
          <label>Quantidade de dólar:</label>
          <input ref={register({
            required: "Este valor é de preenchimento obrigatório.",
            pattern: {
              message: "Este valor é de preenchimento obrigatório."
            }
          })} id='quantidade' name='quantidade' type='number' placeholder='quantidade de dólar(es)' onChange={coletar} value={state.quantidade}></input>
          <br />
          <span className='errorMessage'>{errors.quantidade && errors.quantidade.message}</span>
          <button type='submit'>Calcular</button>
        </form>
      </div>
    </div>
  )
}

export default Main
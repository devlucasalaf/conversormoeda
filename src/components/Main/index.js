import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styless.css'
import { useForm } from 'react-hook-form'
import Header from '../Header'

const Main = () => {
  const [state, setState] = useState({
    cotacao: '',
    quantidade: '',
    dataCotacacao: ''
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

  const getData = (decrement) => {
    const date = new Date()
    const dateFormated = (date.getMonth() + 1) + '-' + (date.getDate() - decrement) + '-' + date.getFullYear()
    return dateFormated
  }

  useEffect(() => {
    let dayDecrement = 0
    async function Run(dayDecrement) {
      let data = getData(dayDecrement)
      let api = await axios.create({ baseURL: `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao` })
      let res = await api.get('')

      if (res.data.value[0] !== undefined) {
        setState(old => ({
          ...old,
          cotacao: parseFloat(res.data.value[0].cotacaoVenda).toFixed(2),
          dataCotacacao: data
        }))
      } else {
        while (res.data.value[0] === undefined) {
          dayDecrement++
          data = getData(dayDecrement)
          api = await axios.create({ baseURL: `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao` })
          res = await api.get('')

          if (res.data.value[0] !== undefined) {
            setState(old => ({
              ...old,
              cotacao: parseFloat(res.data.value[0].cotacaoVenda).toFixed(2),
              dataCotacacao: data
            }))
          } else {
            setState(old => ({
              ...old,
              cotacao: ''
            }))
          }
        }
      }
    }
    console.log(state.cotacao)
    Run(dayDecrement)
  }, [])

  const { handleSubmit, register, errors } = useForm();
  const onSubmit = values => {
    setEffect(true)
    setTimeout(() => {
      window.location.href = `https://conversormoeda.devlucasalaf.vercel.app/result/cotacao=${state.cotacao}&quantidade=${state.quantidade}`
    }, 3000)
  }



  return (
    <div>
      <Header effect={effect} />
      <div id='containerMain'>
        <form onSubmit={handleSubmit(onSubmit)} action={`/result`}>
          <p style={{ color: 'white' }}>Data da Cotação: {state.dataCotacacao === '' ? 'carregando...' : state.dataCotacacao}</p>
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
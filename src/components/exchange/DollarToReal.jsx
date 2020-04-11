import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
import CurrencyInput from 'react-currency-input';
import './DollarToReal.css'
import { numberFormat } from '../../util/numberFormat';


const headerProps = {
    icon: 'usd',
    title: 'Conversor',
    subtitle: 'Converter DÓLAR para REAL'
}


const initialState = {
    exchange: { montante: 0, taxa: 0, formaPagto: 'D' },
    cotacaoDia: 0,
    totais: { usdComImposto: 0, brlComImposto: 0, brlSemImposto: 0 }
}

export default class DollarToReal extends Component {

    state = { ...initialState }

    componentWillMount() {
        // Chamando API para trazer cotação dólar atualizada 30 seg 
        axios(`${process.env.REACT_APP_BASE_URL}/json/all/USD`).then(resp => {
            this.setState({ cotacaoDia: resp.data.USD.ask })
        })
    }


    clear() {
        this.setState({ exchange: initialState.exchange, totais:  initialState.totais  })
    }

    calcular() {
        //chama novamente API para atualizar a cotação do dia 
        this.componentWillMount()
        // Cópia do objeto para realizar cálculos 
        const totais = { ...this.state.totais }
        // Verificação de preenchimento de montante
        if (this.state.exchange.montante) { 

        // Replace na vírgula para realizar os calculos
        let montante = this.state.exchange.montante.replace(',','')
        // IOF * 100 pronto para cálculo de % 
        const IOF = this.state.exchange.formaPagto == 'D' ? '0.011' : '0.064'
        // Cálculo em Dólar com Taxa do Estado 
        totais.usdComImposto = ((parseFloat(montante) * (parseFloat(this.state.exchange.taxa) / 100)) + (parseFloat(montante)))
        // Cálculo em Real sem imposto 
        totais.brlSemImposto = (parseFloat(this.state.cotacaoDia) * parseFloat(montante))
        // Cálculo em Real com imposto IOF 
        totais.brlComImposto= (parseFloat(totais.brlSemImposto * IOF) + parseFloat(totais.brlSemImposto))
        // Setando objeto calculado  
        this.setState({ totais })
    } else {alert("Digite o valor em Dólar")}
        
    }
    // Atualização do estado dos objetos com os valores preenchidos dinamicamente
    updateField(event, maskedvalue, floatvalue) {
        const exchange = { ...this.state.exchange }
        // Retirada dos simbólos para atribuição dos objetos 
        exchange[event.target.name] = event.target.value.replace('$', '').replace('%', '')
        this.setState({ exchange })
    }
    renderForm() {
        return (
            <div className="form">
                <div className="row col-md-12 ">
                    <h3> Cotação do Dia:  <span class="badge badge-success"> R$ {numberFormat(this.state.cotacaoDia, 'pt-br')}
                    </span></h3>
                </div>
                <div className="row">

                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Digite o valor em Dólar: </label>
                            <div className="externa">
                                <CurrencyInput className="form-control" prefix="$"
                                    placeholder="Digite o valor em Dólar..."
                                    value={this.state.exchange.montante}
                                    onChangeEvent={e => this.updateField(e)}
                                    decimalSeparator="." name="montante" required />
                            </div>

                        </div>

                    </div>

                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Taxa do estado: </label>

                            <CurrencyInput placeholder="Digite a taxa do estado..."
                                className="form-control"
                                prefix="%"
                                value={this.state.exchange.taxa}
                                onChangeEvent={e => this.updateField(e)}
                                decimalSeparator=","
                                name="taxa" required />

                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label> Forma de pagamento </label>
                            <div className="form-check ml-4 ">
                                <input className="form-check-input checkbox-1x" type="radio" name="formaPagto" checked={this.state.exchange.formaPagto == 'D' ? true : false} value="D" onChange={e => this.updateField(e)} />
                                <label className="form-check-label" for="labelDinheiro">
                                    Dinheiro
                                </label>
                                <input className="form-check-input ml-1 checkbox-1x" type="radio" name="formaPagto" value="C" onChange={e => this.updateField(e)} />
                                <label className="form-check-labe ml-4 " for="labelCartao">
                                    Cartão
                                </label>
                            </div>
                        </div>


                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label> IOF </label>
                            <h2>
                                {this.state.exchange.formaPagto == 'D' ? '1.1%' : '6,4%'}
                            </h2>

                            {this.state.formaPagto}
                        </div>
                    </div>

                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.calcular(e)}>
                            Cacular
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
                <hr />
                <ul>
                    <li>
                        <h4> IOF  <span class="badge badge-danger"> {this.state.exchange.formaPagto == 'D' ? '1.1%' : '6,4%'} </span></h4>
                    </li>
                    <li>
                        <h4> Total em dólar sem imposto <span class="badge badge-secondary"> $ {this.state.exchange.montante} </span></h4>
                    </li>
                    <li>
                        <h4> Total em dólar com imposto <span class="badge badge-secondary"> $   {numberFormat(this.state.totais.usdComImposto.toFixed(2),'en-us')}</span></h4>
                    </li>
                    <li>
                        <h4>Total em real sem imposto <span class="badge badge-secondary"> R$ {numberFormat(this.state.totais.brlSemImposto.toFixed(2),'pt-br')}</span></h4>
                    </li>
                    <li>
                        <h4>  Total em real com imposto <span class="badge badge-secondary"> R$ {numberFormat(this.state.totais.brlComImposto.toFixed(2),'pt-br')} </span></h4>
                    </li>
                </ul>
            </div>

        )
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        )
    }
}
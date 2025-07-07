from flask import Flask, jsonify
import yfinance as yf
from datetime import datetime

app = Flask(__name__)

@app.route('/api/dividendos/<ticker>')
def get_dividendos(ticker):
    ticker_formatado = ticker + ".SA"
    acao = yf.Ticker(ticker_formatado)
    dividendos = acao.dividends

    dados = []
    for data, valor in dividendos.tail(5).items():
        mes_ano = data.strftime("%b/%y")
        probabilidade = 80 + (hash(mes_ano) % 15)  # Simula probabilidade entre 80–95%

        dados.append({
            "mes": mes_ano,
            "valor": round(valor, 2),
            "probabilidade": min(probabilidade, 100)
        })

    return jsonify(dados)

if __name__ == '__main__':
    app.run(debug=True)

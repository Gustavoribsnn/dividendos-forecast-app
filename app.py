from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/dividendos/<ticker>')
def get_dividendos(ticker):
    ticker_formatado = ticker + ".SA"
    acao = yf.Ticker(ticker_formatado)
    dividendos = acao.dividends

    dados = []
    for data, valor in dividendos.tail(5).items():
        mes_ano = data.strftime("%b/%y")
        probabilidade = 80 + (hash(mes_ano) % 15)
        dados.append({
            "mes": mes_ano,
            "valor": round(valor, 2),
            "probabilidade": min(probabilidade, 100)
        })

    return jsonify(dados)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)

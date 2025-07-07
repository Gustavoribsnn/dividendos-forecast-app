import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DividendForecast() {
  const [nextUpdate, setNextUpdate] = useState(50);
  const [dividendData, setDividendData] = useState([]);

  const fetchDividendData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dividendos/VALE3");
      const data = await res.json();
      setDividendData(data);
    } catch (err) {
      console.error("Erro ao buscar dividendos:", err);
    }
  };

  useEffect(() => {
    fetchDividendData();
    const interval = setInterval(() => {
      fetchDividendData();
      setNextUpdate(50);
    }, 50 * 60 * 1000);

    const countdown = setInterval(() => {
      setNextUpdate((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Previsão de Proventos - VALE3</h1>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Atualização automática em: {nextUpdate} min
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Mês</th>
                <th>Valor Estimado (R$)</th>
                <th>Probabilidade (%)</th>
              </tr>
            </thead>
            <tbody>
              {dividendData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/30">
                  <td className="py-2">{item.mes}</td>
                  <td>{item.valor.toFixed(2)}</td>
                  <td>
                    <Progress value={item.probabilidade} className="w-32" />
                    <span className="text-xs ml-2">{item.probabilidade}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Tendência de Dividendos</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dividendData}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          Detalhes da Previsão <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

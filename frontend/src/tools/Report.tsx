import React, { useEffect, useState } from "react";
import { getStandProduct, getStockAlert } from "../services/report.service";
import { getStandList } from "../services/product.service";

// @ts-ignore
import CanvasJSReact from "@canvasjs/react-charts";
//var CanvasJSReact = require('@canvasjs/react-charts');

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Report: React.FC = () => {
  const [standId, setStandId] = useState<number>(1);
  const [standList, setStandList] = useState<any[]>([]);
  const [standProduct, setStandProduct] = useState<any[]>([]);
  const [stockAlert, setStokAlert] = useState<any[]>([]);

  useEffect(() => {
    if (standList.length === 0) {
      const fetchStandList = async () => {
        try {
          const response = await getStandList();
          setStandList(response.data.standList);
        } catch (error) {
          console.error("Erro ao obter lista de barracas:", error);
        }
      };

      fetchStandList();

      const fetchStok = async () => {
        try {
          const response = await getStockAlert();
          setStokAlert(response.data);
        } catch (error) {
          console.error("Erro ao obter barraca", error);
        }
      };

      fetchStok();

      console.log("stockAlert", stockAlert);
    }
  });

  useEffect(() => {
    const fetchStandProduct = async () => {
      try {
        const response = await getStandProduct(standId);
        setStandProduct(response.data);
      } catch (error) {
        console.error("Erro ao obter produtos da barraca", error);
      }
    };
    fetchStandProduct();
  }, [standId]);

  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", //"light1", "dark1", "dark2"
    title: {
      text: "",
    },
    data: [
      {
        type: "column",
        dataPoints: standProduct,
      },
    ],
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col card">
            <label className="card-header">
              Produtos retirados por barraca
            </label>
            <div className="px-5 py-2">
              <select
                className="form-control col-6"
                onChange={(e) => {
                  setStandId(parseInt(e.target.value));
                }}
              >
                {standList.map((stand) => (
                  <option key={stand.id} value={stand.id}>
                    {stand.name}
                  </option>
                ))}
              </select>
            </div>
            <CanvasJSChart options={options} className="" />
          </div>
          <div className="col card mx-2">
            <label className="card-header">Produtos com estoque baixo</label>
            <div className="px-5 py-2">
              <table className="table table-striped">
                <thead>
                  <tr className="table-active">
                    <th scope="col">Produto</th>
                    <th scope="col">Estoque</th>
                  </tr>
                </thead>
                <tbody>
                  {stockAlert.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className=""></div>
        </div>
      </div>
    </>
  );
};

export default Report;

import React, { useEffect, useRef, useState } from "react";
import {
  getEntry,
  getStandProduct,
  getStockAlert,
} from "../services/report.service";
import { getStandList } from "../services/product.service";

// @ts-ignore
import CanvasJSReact from "@canvasjs/react-charts";
//var CanvasJSReact = require('@canvasjs/react-charts');

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Report: React.FC = () => {
  const [standId, setStandId] = useState<number>(9);
  const [standList, setStandList] = useState<any[]>([]);
  const [standProduct, setStandProduct] = useState<any[]>([]);
  const [stockAlert, setStokAlert] = useState<any[]>([]);
  const [reportName, setReportName] = useState<string>("");
  const [productEntry, setProductEntry] = useState<any[]>([]);
  const [productOut, setProductOut] = useState<any[]>([]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      //window.location.reload(); // Recarregar a página para restaurar o conteúdo original
    }
  };

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

      const fetchProductEntry = async () => {
        try {
          const response = await getEntry("1", "IN");
          setProductEntry(response.data);
        } catch (error) {
          console.error("Erro ao obter entrada de produtos", error);
        }
      };

      const fetchProductOut = async () => {
        try {
          const response = await getEntry("1", "OUT");
          setProductOut(response.data);
        } catch (error) {
          console.error("Erro ao obter entrada de produtos", error);
        }
      };

      fetchProductEntry();
      fetchProductOut();
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
        type: "bar",
        dataPoints: standProduct,
      },
    ],
  };

  return (
    <>
      <div className="container-fluid">
        <h3>Selecione o relatório desejado</h3>
        <div className="">
          <button
            className="btn btn-primary mx-2"
            onClick={() => setReportName("standProduct")}
          >
            Produtos retirados por barraca
          </button>
          <button
            className="btn btn-primary mx-2"
            onClick={() => setReportName("stockAlert")}
          >
            Produtos com estoque baixo
          </button>
          <button
            className="btn btn-primary mx-2"
            onClick={() => setReportName("productEntry")}
          >
            Entrada e Saída de produtos
          </button>
        </div>
      </div>
      {reportName === "standProduct" && (
        <>
          <div>
            <div className="col card">
              <label className="card-header">
                Produtos retirados por barraca
              </label>
              <div className="px-5 py-2">
                <label className="form-label">Selecione umaa barraca</label>
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
              <div ref={printRef} className="my-4">
                <h5>Produtos retirados por barraca</h5>
                <table className="table table-striped my-4">
                  <thead>
                    <tr className="table-active">
                      <th scope="col">Produto</th>
                      <th scope="col">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standProduct.map((product, index) => (
                      <tr key={index}>
                        <td>{product.label}</td>
                        <td>{product.y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="my-8">
                <CanvasJSChart options={options} className="" />
              </div>
              <div className="d-grid gap-2 col-2 my-4">
                <button onClick={handlePrint} className="btn btn-secondary">Imprimir</button>
              </div>
              
            </div>
          </div>
        </>
      )}
      {reportName === "stockAlert" && (
        <>
          <div className="col card mx-2">
            <div ref={printRef}>
              <label className="card-header">Produtos com estoque baixo</label>
              <div className="px-5 py-2">
                <table className="table table-striped">
                  <thead>
                    <tr className="table-active">
                      <th scope="col">Produto</th>
                      <th scope="col" className="text-center">Estoque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockAlert.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td className="text-center">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-grid gap-2 col-2 mb-4">
              <button onClick={handlePrint} className="btn btn-secondary ">
                Imprimir
              </button>
            </div>
          </div>
        </>
      )}
      {reportName === "productEntry" && (
        <>
          <div className="col card mx-2">
            <div ref={printRef}>
              <div>
                <label className="card-header">Entrada de produtos</label>
                <div className="px-5 py-2">
                  <table className="table table-striped">
                    <thead>
                      <tr className="table-active">
                        <th scope="col">Produto</th>
                        <th scope="col" className="text-center">Quantidade</th>
                        <th scope="col" className="text-center">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productEntry.map((product, index) => (
                        <tr key={index}>
                          <td>{product.label}</td>
                          <td className="text-center">{product.value}</td>
                          <td className="text-center">{product.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <label className="card-header">Saída de produtos</label>
                  <div className="px-5 py-2">
                    <table className="table table-striped">
                      <thead>
                        <tr className="table-active">
                          <th scope="col">Produto</th>
                          <th scope="col" className="text-center">Quantidade</th>
                          <th scope="col" className="text-center">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productOut.map((product, index) => (
                          <tr key={index}>
                            <td>{product.label}</td>
                            <td className="text-center">{product.value}</td>
                            <td className="text-center">{product.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-grid gap-2 col-2 mb-4">
              <button onClick={handlePrint} className="btn btn-secondary ">
                Imprimir
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Report;

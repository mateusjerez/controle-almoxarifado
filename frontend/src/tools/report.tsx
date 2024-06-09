import React, { useEffect, useRef, useState } from "react";
import {
  getMovement,
  getStandProduct,
  getStockAlert,
  getTransactionProduct,
} from "../services/report.service";
import { getProductList, getStandList } from "../services/product.service";

// @ts-ignore
import CanvasJSReact from "@canvasjs/react-charts";
//var CanvasJSReact = require('@canvasjs/react-charts');

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Report: React.FC = () => {
  const [productId, setProductId] = useState<number>(1);
  const [standId, setStandId] = useState<number>(9);
  const [standList, setStandList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [standProduct, setStandProduct] = useState<any[]>([]);
  const [stockAlert, setStokAlert] = useState<any[]>([]);
  const [reportName, setReportName] = useState<string>("");
  const [productEntry, setProductEntry] = useState<any[]>([]);
  const [productOut, setProductOut] = useState<any[]>([]);
  const [transactionProduct, setTransactionProduct] = useState<any[]>([]);

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
    const fetchTransactionProduct = async () => {
      try {
        const response = await getTransactionProduct(productId);
        setTransactionProduct(response.data);
      } catch (error) {
        console.error("Erro ao obter produtos da barraca", error);
      }
    };
    fetchTransactionProduct();
  }, [productId]);

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
    }

    if (productList.length < 1) {
      const fecthProductList = async () => {
        try {
          const response = await getProductList();
          setProductList(response.data.productList);

          console.log("Produtos response: ", response.data);
          console.log("Produtos: ", productList);
        } catch (error) {
          console.error("Erro ao obter produtos", error);
        }
      };
      fecthProductList();
    }

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
        const response = await getMovement("1", "IN");
        setProductEntry(response.data);
      } catch (error) {
        console.error("Erro ao obter entrada de produtos", error);
      }
    };

    const fetchProductOut = async () => {
      try {
        const response = await getMovement("1", "OUT");
        setProductOut(response.data);
      } catch (error) {
        console.error("Erro ao obter entrada de produtos", error);
      }
    };

    fetchProductEntry();
    fetchProductOut();
  }, [productList, standList]);

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
      <div className="d-flex justify-between card">
        <h3>Selecione o relatório desejado</h3>
        <div className="my-4">
        <button
            style={{ width: "350px", height: "40px"}}
            className="btn btn-primary m-2"
            onClick={() => setReportName("standProduct")}
          >
            Produtos retirados por barraca
          </button>
          <button
            style={{ width: "350px", height: "40px"}}
            className="btn btn-primary m-2"
            onClick={() => setReportName("stockAlert")}
          >
            Produtos com estoque baixo
          </button>
          <button
            style={{ width: "350px", height: "40px"}}
            className="btn btn-primary m-2"
            onClick={() => setReportName("productEntry")}
          >
            Entrada de produtos
          </button>
          <button
            style={{ width: "350px", height: "40px"}}
            className="btn btn-primary m-2"
            onClick={() => setReportName("productOut")}
          >
            Saída de produtos
          </button>

          <button
            style={{ width: "350px", height: "40px"}}
            className="btn btn-primary m-2"
            onClick={() => setReportName("transactionProduct")}
          >
            Movimento por produto
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
                <button onClick={handlePrint} className="btn btn-secondary">
                  Imprimir
                </button>
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
                      <th scope="col" className="text-center">
                        Estoque
                      </th>
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
                        <th scope="col" className="text-center">
                          Quantidade
                        </th>
                        <th scope="col" className="text-center">
                          Data
                        </th>
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
      {reportName === "productOut" && (
        <>
          <div className="col card mx-2">
            <div ref={printRef}>
              <div>
                <label className="card-header">Saída de produtos</label>
                <div className="px-5 py-2">
                  <table className="table table-striped">
                    <thead>
                      <tr className="table-active">
                        <th scope="col">Produto</th>
                        <th scope="col" className="text-center">
                          Quantidade
                        </th>
                        <th scope="col" className="text-center">
                          Data
                        </th>
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
            <div className="d-grid gap-2 col-2 mb-4">
              <button onClick={handlePrint} className="btn btn-secondary ">
                Imprimir
              </button>
            </div>
          </div>
        </>
      )}
      {reportName === "transactionProduct" && (
        <>
          <div>
            <div className="col card">
              <h3 className="card-header">Movimento por produto</h3>
              <div className="px-5 py-2">
                <label className="form-label">Selecione um produto</label>
                <select
                  className="form-control col-6"
                  onChange={(e) => {
                    setProductId(parseInt(e.target.value));
                  }}
                >
                  {productList.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div ref={printRef} className="my-4">
                <table className="table table-striped my-4">
                  <thead>
                    <tr className="table-active">
                      <th scope="col">Data</th>
                      <th scope="col" className="text-center">
                        Tipo
                      </th>
                      <th scope="col" className="text-center">
                        Quantidade
                      </th>
                      <th scope="col" className="text-center">
                        Origem (Entrada) / Destino (Saída)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionProduct.map((product, index) => (
                      <tr
                        key={index}
                        className={
                          product.type === "IN" ? "text-primary" : "text-danger"
                        }
                      >
                        <td>{product.date}</td>
                        <td className="text-center">
                          {product.type === "IN" ? <>Entrada</> : <>Saída</>}
                        </td>
                        <td className="text-center">{product.quantity}</td>
                        <td className="text-center">{product.stand}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-grid gap-2 col-2 my-4">
                <button onClick={handlePrint} className="btn btn-secondary">
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Report;

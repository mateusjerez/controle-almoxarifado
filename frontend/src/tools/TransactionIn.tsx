import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { transactionin } from "../services/product.service";

import * as AuthService from "../services/auth.service";

import { getModeratorBoard } from "../services/user.service";
import EventBus from "../common/EventBus";
import ITransaction from "../types/transaction.type";

import { getList } from "../services/product.service";

const ProductIn: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [successful, setSuccessful] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [producList, setProductList] = useState<any[]>([]);

  const initialValues:ITransaction = {
        product: "",
        stand: "",
        quantity: 0,
        user: ""
      };

  const validationSchema = Yup.object().shape({
    product: Yup.string().required("Preenchimento obrigatório!"),
    quantity: Yup.string().required("Preenchimento obrigatório!"),
  });

  const handleTransaction = (formValue:ITransaction) => {
    const user = AuthService.getCurrentUser();
    const { product, quantity } = formValue;   

    setMessage("");
    setLoading(true);

    transactionin(product, quantity, user.username).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
    }

    getModeratorBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );

    const fetchProductList = async () => {
      try {
        const response = await getList();
        setProductList(response.data.productList);
      } catch (error) {
        console.error("Erro ao obter lista de produtos:", error);
      }
    };

    fetchProductList();
  }, []);
  return (
    <div className="card card-container">
      <header className="">
        {showModeratorBoard ? (
          <div>
            <h3>Entrada de Produto</h3>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleTransaction}
              >
                <Form>
                  {!successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="product">Selecione o Produto</label>
                        <Field
                          name="product"
                          as="select"
                          className="form-control">
                            {producList.map((product: any, index: number) => (
                              <option value={product.productname}>{product.productname}</option>
                            ))}
                          </Field>
                        <ErrorMessage
                          name="product"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="quantity">Quantidade</label>
                        <Field
                          name="quantity"
                          type="number"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="quantity"
                          component="div"
                          className="alert alert-danger"
                        />
                      </div>

                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={loading}
                        >
                          <span>Cadastrar</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {message && (
                    <div className="form-group">
                      <div
                        className={
                          successful
                            ? "alert alert-success"
                            : "alert alert-danger"
                        }
                        role="alert"
                      >
                        {message}
                      </div>
                    </div>
                  )}
                </Form>
              </Formik>
            </div>
          </div> //-------------------------------//
        ) : (
          <h3>{content}</h3>
        )}
      </header>
    </div>
  );
};

export default ProductIn;

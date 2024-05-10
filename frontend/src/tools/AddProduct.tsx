import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { addproduct } from "../services/product.service";
import IProduct from "../types/product.type";

import * as AuthService from "../services/auth.service";

import { getModeratorBoard} from "../services/user.service";
import EventBus from "../common/EventBus";

const AddProduct: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [successful, setSuccessful] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  
  const initialValues: IProduct = {
    name: "",
    stands: [],
    unit: "",
  } 

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Preenchimento obrigatório!"),
    unit: Yup.string().required("Preenchimento obrigatório!"),
  });

  const handleProduct = (formValue: IProduct) => {
    const { name, stands, unit } = formValue;

    setMessage("");
    setLoading(true);

    addproduct(name, stands, unit).then(
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
  }, []);
  return (
    <div className="card card-container">
      <header className="">
        {showModeratorBoard ? 
        <div>
            <h3>Cadastro de Produto</h3>

            <div>
                <Formik 
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleProduct}
                    >
                    <Form>
                        {!successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="name">Nome do Produto</label>
                                    <Field name="name" type="text" className="form-control" />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stands">Barracas</label>
                                    <label>
                                    <Field name="stands" type="checkbox" value="barraca1" className="" /> Barraca 1
                                    </label>

                                    <label>
                                    <Field name="stands" type="checkbox" value="barraca2" className="" /> Barraca 2
                                    </label>

                                    <label>
                                    <Field name="stands" type="checkbox" value="barraca3" className="" /> Barraca 3
                                    </label>

                                    <ErrorMessage
                                        name="stands"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="unit">Medida</label>
                                    <Field name="unit" type="text" className="form-control" />
                                    <ErrorMessage
                                        name="unit"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                        <span>Cadastrar</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {message && (
                            <div className="form-group">
                                <div
                                className={
                                    successful ? "alert alert-success" : "alert alert-danger"
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
:
        <h3>{content}</h3>}
      </header>
    </div>
  );
};

export default AddProduct;
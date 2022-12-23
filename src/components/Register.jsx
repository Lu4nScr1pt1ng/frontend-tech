import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import axios from "axios";

const schema = yup
  .object({
    select: yup.string().required(),
    nome: yup
      .string()
      .required("Campo obrigatório")
      .max(100, "Maximo de 100 caracateres"),
    cnpj: yup
      .string()
      .matches(/^\d+$/, "Só pode conter números")
      .required("Campo obrigatório")
      .max(14, "Tem que conter 14 caracteres")
      .min(14, "Tem que conter 14 caracteres"),
  })
  .required();

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      console.log(data);
      axios
        .post("https://localhost:7114" + "/v1/fornecedor", {
          nome: data.nome,
          cnpj: data.cnpj,
          especialidade: data.select,
        })
        .then((res) => {
          setMessage("CNPJ cadastrado com sucesso!");
        })
        .catch((res) => {
          setMessage(`${res.response.data.message}`);
        });
      reset();
    } catch (e) {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-center mt-4 h2">Preencha o formulário para cadastrar um novo CNPJ</h1>
      <div className="container d-flex justify-content-center mt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <pre>{message ? message : ""}</pre>
          <div className="row">
            <div className="col">
              <input
                {...register("nome")}
                type="text"
                className="form-control"
                placeholder="Nome"
                aria-label="Nome"
              />
              {errors.nome && (
                <p className="text-danger fs-6">{errors.nome.message}</p>
              )}
            </div>
            <div class="col">
              <input
                {...register("cnpj")}
                type="text"
                className="form-control"
                placeholder="CNPJ"
                aria-label="CNPJ"
              />
              {errors.cnpj && (
                <p className="text-danger fs-6">{errors.cnpj.message}</p>
              )}
            </div>
          </div>
          <select
            {...register("select")}
            className="form-select mt-4"
            aria-label="Selecione uma especialidade"
          >
            <option value="Comércio">Comércio</option>
            <option value="Serviço">Serviço</option>
            <option value="Indústria">Indústria</option>
          </select>

          <div className="mt-4 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Cadastrar CNPJ
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const fetchFornecedores = () =>
    axios
      .get("https://localhost:7114" + "/v1/fornecedor")
      .then((response) => response.data);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["Fornecedores"],
    queryFn: fetchFornecedores,
  });

  if (isLoading) {
    return <div className="text-center">Carregando...</div>;
  }

  if (isError) {
    return (
      <div className="text-center">Ocorreu um erro ao buscar lista de urls</div>
    );
  }

  function deletar(id) {
    axios
      .delete("https://localhost:7114" + "/v1/fornecedor/" + id)
      .then((res) => {
        refetch();
      });
  }

  return (
    <div className="overflow-auto">
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">NOME</th>
            <th scope="col">CNPJ</th>
            <th scope="col">ESPECIALIDADE</th>
            <th scope="col">EDITAR</th>
            <th scope="col">DELETAR</th>
          </tr>
        </thead>
        <tbody>
          {data[0] ? (
            ""
          ) : (
            <div className="text-center">
              Você não tem um fornecedor criado ainda
            </div>
          )}
          {data.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <th>{fornecedor.id}</th>
              <th>{fornecedor.nome}</th>
              <th>{fornecedor.cnpj}</th>
              <th>{fornecedor.especialidade}</th>
              <th>
                <Link to={"/editar/" + fornecedor.id + "/" + fornecedor.cnpj}>
                  <button type="button" className="btn btn-primary">
                    Editar
                  </button>
                </Link>
              </th>
              <th>
                <button
                  onClick={() => deletar(fornecedor.id)}
                  type="button"
                  className="btn btn-danger"
                >
                  Deletar
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, Spin, Image, notification } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { api } from "../../services/api";

const { Meta } = Card;

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProducts(5);
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setError("Falha ao carregar produtos");
        notification.error({
          message: "Erro ao carregar produtos",
          description: "Não foi possível carregar os produtos da API.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const abrirNotificacao = () => {
    notification.error({
      message: "Erro ao visualizar",
      description: "Não foi possível carregar os detalhes do produto.",
      placement: "topRight",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-7xl">
      {produtos.map((produto) => (
        <Card
          key={produto.id}
          hoverable
          cover={
            <Image
              src={produto.image}
              alt={produto.title}
              preview={true}
              className="h-48 object-contain p-4"
              placeholder={
                <div className="flex justify-center items-center h-48">
                  <Spin size="small" />
                </div>
              }
            />
          }
          actions={[
            <EyeFilled key={`eye-${produto.id}`} onClick={abrirNotificacao} />,
          ]}
        >
          <Meta title={produto.title} description={`$${produto.price}`} />
        </Card>
      ))}
    </div>
  );
}

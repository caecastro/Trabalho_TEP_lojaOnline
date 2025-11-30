import { useState, useEffect } from "react";
import { Image, Spin, notification, Card } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { api } from "../../services/api.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

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

  const abrirNotificacao = (produto) => {
    notification.error({
      message: "Erro ao visualizar",
      description: `Não foi possível carregar os detalhes do produto ${produto.title}.`,
      placement: "topRight",
    });
  };

  // Função para encurtar o título
  const encurtarTitulo = (titulo) => {
    if (titulo.length > 30) {
      return titulo.substring(0, 30) + "...";
    }
    return titulo;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Spin size="large" />
          <p
            className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Carregando produtos...
          </p>
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
    <div className="flex justify-center gap-6 flex-wrap">
      {produtos.map((produto) => (
        <Card
          key={produto.id}
          className={`w-64 h-80 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } flex flex-col transition-transform hover:scale-105`}
          styles={{
            body: {
              padding: "20px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            },
          }}
          cover={
            <div className="flex justify-center p-6 bg-white">
              <Image
                src={produto.image}
                alt={produto.title}
                width={120}
                height={120}
                style={{ objectFit: "contain" }}
                preview={{
                  // CORREÇÃO: usar toolbarRender em vez de mask
                  toolbarRender: () => (
                    <div className="ant-image-preview-operations">
                      <EyeFilled
                        onClick={() => abrirNotificacao(produto)}
                        style={{
                          color: "#fff",
                          fontSize: "16px",
                          cursor: "pointer",
                          padding: "8px",
                        }}
                      />
                    </div>
                  ),
                }}
              />
            </div>
          }
        >
          <div className="flex flex-col flex-1 justify-between">
            <div>
              <h3
                className={`font-semibold text-base mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } line-clamp-3 leading-tight`}
              >
                {encurtarTitulo(produto.title)}
              </h3>
            </div>

            <div className="mt-auto">
              <div
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-right`}
              >
                ${produto.price}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Image, Spin, notification, Card } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useProducts } from "../../hooks/useProducts.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function Produtos() {
  const { apiProducts, loading, loadApiProducts } = useProducts();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadApiProducts(5); // Carregar apenas 5 produtos para a homepage
  }, []);

  const abrirNotificacao = (produto) => {
    notification.error({
      message: "Erro ao visualizar produto",
      description: `Não foi possível carregar os detalhes de "${produto.title}".`,
      placement: "topRight",
      duration: 3,
    });
  };

  // Função para encurtar o título
  const encurtarTitulo = (titulo) => {
    if (titulo.length > 30) {
      return titulo.substring(0, 30) + "...";
    }
    return titulo;
  };

  // Fallback image para erro de carregamento
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3EImagem Indisponível%3C/text%3E%3C/svg%3E";

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

  return (
    <div className="flex justify-center gap-6 flex-wrap">
      {apiProducts.map((produto) => (
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
                fallback={fallbackImage}
                preview={{
                  mask: (
                    <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
                      <EyeFilled
                        style={{
                          fontSize: "24px",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  ),
                  onVisibleChange: (visible) => {
                    if (visible) {
                      abrirNotificacao(produto);
                      return false; // Impede a abertura do preview
                    }
                  },
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

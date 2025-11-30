import { useState, useEffect } from "react";
import { Image, Spin, notification, Card } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useProducts } from "../../hooks/useProducts";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Componente para exibição dos produtos em destaque (Top 5)
 * Cards responsivos com preview de imagem e informações básicas
 */
export default function Produtos() {
  const { apiProducts, loading, loadApiProducts } = useProducts();
  const { isDarkMode } = useTheme();

  // Carrega produtos da API ao montar componente
  useEffect(() => {
    loadApiProducts(5);
  }, []);

  // Notificação de erro ao tentar visualizar imagem
  const abrirNotificacao = (produto) => {
    notification.error({
      message: "Erro ao visualizar produto",
      description: `Não foi possível carregar os detalhes de "${produto.title}".`,
      placement: "topRight",
      duration: 3,
    });
  };

  // Utilitários para truncar textos longos
  const encurtarTitulo = (titulo) =>
    titulo.length > 35 ? titulo.substring(0, 35) + "..." : titulo;
  const encurtarDescricao = (descricao) =>
    descricao.length > 80 ? descricao.substring(0, 80) + "..." : descricao;

  // Imagem de fallback para produtos sem imagem
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3EImagem Indisponível%3C/text%3E%3C/svg%3E";

  // Estado de carregamento
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
          className={`w-64 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } flex flex-col transition-all hover:shadow-lg`}
          styles={{
            body: {
              padding: "16px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            },
          }}
          cover={
            <div className="flex justify-center p-4 bg-white h-48">
              <Image
                src={produto.image}
                alt={produto.title}
                width={120}
                height={120}
                style={{ objectFit: "contain", maxHeight: "120px" }}
                fallback={fallbackImage}
                preview={{
                  mask: (
                    <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-40">
                      <EyeFilled
                        style={{
                          fontSize: "20px",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  ),
                  onVisibleChange: (visible) => {
                    if (visible) {
                      abrirNotificacao(produto);
                      return false;
                    }
                  },
                }}
              />
            </div>
          }
        >
          {/* Conteúdo do card do produto */}
          <div className="flex flex-col flex-1 justify-between">
            <div>
              <h3
                className={`font-semibold text-sm mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } line-clamp-2 leading-tight`}
                style={{ minHeight: "40px" }}
              >
                {encurtarTitulo(produto.title)}
              </h3>
              <p
                className={`text-xs mb-3 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } line-clamp-2`}
                style={{ minHeight: "32px" }}
              >
                {encurtarDescricao(produto.description)}
              </p>
            </div>

            {/* Preço alinhado à direita */}
            <div className="mt-auto">
              <div
                className={`text-lg font-bold ${
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

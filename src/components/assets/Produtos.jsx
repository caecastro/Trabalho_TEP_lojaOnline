import { useState, useEffect } from "react";
import { Image, Spin, notification, Card, Button } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useProducts } from "../../hooks/useProducts";
import { useTheme } from "../../contexts/ThemeContext";

export default function Produtos() {
  const { apiProducts, loading, loadApiProducts } = useProducts();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadApiProducts(5);
  }, []);

  const abrirNotificacao = (produto) => {
    notification.error({
      message: "Erro ao visualizar produto",
      description: `Não foi possível carregar os detalhes de "${produto.title}".`,
      placement: "topRight",
      duration: 3,
    });
  };

  const encurtarTitulo = (titulo) =>
    titulo.length > 35 ? titulo.substring(0, 35) + "..." : titulo;
  const encurtarDescricao = (descricao) =>
    descricao.length > 90 ? descricao.substring(0, 90) + "..." : descricao;

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
    <div className="w-full">
      {/* Grid ajustada para layout consistente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 px-0">
        {apiProducts.map((produto) => (
          <Card
            key={produto.id}
            className={`w-full h-full ${
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
              <div className="flex justify-center items-center p-3 bg-white h-52 min-h-[208px]">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={produto.image}
                    alt={produto.title}
                    style={{
                      objectFit: "contain",
                      maxHeight: "140px",
                      maxWidth: "140px",
                      width: "auto",
                      height: "auto",
                      display: "block",
                      margin: "0 auto",
                    }}
                    fallback={fallbackImage}
                  />
                </div>
              </div>
            }
          >
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
                  } line-clamp-3`}
                  style={{ minHeight: "48px", lineHeight: "1.4" }}
                >
                  {encurtarDescricao(produto.description)}
                </p>
              </div>

              <div className="mt-auto">
                <div
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } text-center mb-3`}
                >
                  ${produto.price}
                </div>

                {/* Botão com ícone EyeFilled posicionado abaixo do produto */}
                <div className="flex justify-center">
                  <Button
                    type="text"
                    icon={<EyeFilled />}
                    onClick={() => abrirNotificacao(produto)}
                    className={`flex items-center justify-center ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

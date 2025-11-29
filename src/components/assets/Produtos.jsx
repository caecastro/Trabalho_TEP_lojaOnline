import React, { useState, useEffect, useMemo } from "react";
import { Card, Spin, Image, notification } from "antd";
import { EyeFilled } from "@ant-design/icons";

const { Meta } = Card;

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products?limit=5");
        const data = await res.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const produtosMemo = useMemo(() => produtos, [produtos]);

  const abrirNotificacao = () => {
    notification.error({
      message: "Erro ao visualizar",
      description: "Não foi possível carregar os detalhes do produto.",
      placement: "topRight",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-7xl">
      {produtosMemo.map((produto) => (
        <Card
          key={produto.id}
          hoverable
          cover={
            <Image
              src={produto.image}
              alt={produto.title}
              preview={true}
              className="h-48 object-contain p-4"
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

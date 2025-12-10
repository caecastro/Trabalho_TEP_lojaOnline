import { useEffect } from "react";
import { Card, Image, Typography, Divider, theme, Button } from "antd";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

export default function Produtos() {
  const { apiProducts, loading, loadApiProducts } = useProducts();
  const { token } = useToken();
  const { addItem } = useCart();

  useEffect(() => {
    loadApiProducts(5);
  }, []);

  const handleBuy = (product) => {
    addItem(product);
  };

  if (loading) {
    return null;
  }

  // Dados específicos da imagem
  const imageProducts = [
    {
      ...(apiProducts[0] || {}),
      title: "Fjellaven - Foklack No.1 Badig...",
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      price: "99.99",
    },
    {
      ...(apiProducts[1] || {}),
      title: "Mens Casual Premium Skin Fit T...",
      description:
        "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
      price: "69.99",
    },
    {
      ...(apiProducts[2] || {}),
      title: "Mens Cotton Adult",
      description:
        "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
      price: "59.99",
    },
    {
      ...(apiProducts[3] || {}),
      title: "Mens Casual Skin Fit",
      description:
        "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
      price: "79.99",
    },
    {
      ...(apiProducts[4] || {}),
      title: "Jahn Hardy Women's Legends N...",
      description:
        "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
      price: "89.99",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap", // NÃO QUEBRA LINHA
        gap: "16px",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        overflowX: "auto", // Permite scroll horizontal se necessário
        paddingBottom: "10px",
      }}
    >
      {imageProducts.map((product, index) => (
        <Card
          key={product.id || index}
          hoverable
          style={{
            flex: "0 0 calc(20% - 16px)", // Cada card ocupa 20% do espaço (100%/5)
            minWidth: "220px", // Largura mínima
            maxWidth: "240px", // Largura máxima
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          cover={
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "150px", // Reduzido para caber melhor
              }}
            >
              <Image
                src={product.image}
                alt={product.title}
                style={{
                  maxHeight: "120px",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
                preview={false}
              />
            </div>
          }
        >
          <div style={{ flex: 1 }}>
            <Text
              strong
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "13px",
                lineHeight: "1.3",
                height: "36px",
                overflow: "hidden",
              }}
            >
              {product.title}
            </Text>

            <Paragraph
              type="secondary"
              style={{
                fontSize: "11px",
                margin: 0,
                lineHeight: "1.3",
                height: "45px",
                overflow: "hidden",
                marginBottom: "8px",
              }}
            >
              {product.description}
            </Paragraph>

            <Divider style={{ margin: "4px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              <Title
                level={4}
                style={{
                  color: token.colorPrimary,
                  margin: 0,
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                ${product.price}
              </Title>
              <Button
                type="primary"
                onClick={() => handleBuy(product)}
                size="small"
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  fontSize: "12px",
                  padding: "4px 12px",
                  height: "32px",
                }}
              >
                Buy
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

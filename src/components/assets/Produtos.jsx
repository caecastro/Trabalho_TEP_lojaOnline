import { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Image,
  Typography,
  Rate,
  Divider,
  theme,
  Button,
} from "antd";
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
    // Você pode adicionar uma notificação aqui se quiser
    // notification.success({
    //   message: "Produto adicionado ao carrinho",
    //   description: `${product.title} foi adicionado ao carrinho.`,
    // });
  };

  if (loading) {
    return null;
  }

  return (
    <Row gutter={[token.marginLG, token.marginLG]} justify="center">
      {apiProducts.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.id}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <div
                style={{
                  padding: token.paddingMD,
                  backgroundColor: token.colorBgLayout,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  style={{
                    maxHeight: 160,
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  preview={{
                    mask: null,
                  }}
                />
              </div>
            }
          >
            <Card.Meta
              title={
                <Text strong ellipsis={{ rows: 2 }}>
                  {product.title}
                </Text>
              }
              description={
                <>
                  <div style={{ marginBottom: token.marginXS }}>
                    <Rate
                      disabled
                      defaultValue={product.rating?.rate || 4}
                      size="small"
                    />
                    <Text
                      type="secondary"
                      style={{ marginLeft: token.marginXS }}
                    >
                      ({product.rating?.count || 0})
                    </Text>
                  </div>
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 3 }}
                    style={{ fontSize: token.fontSizeSM, margin: 0 }}
                  >
                    {product.description}
                  </Paragraph>
                  <Divider style={{ margin: `${token.marginXS}px 0` }} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Title
                      level={4}
                      style={{
                        color: token.colorPrimary,
                        margin: 0,
                      }}
                    >
                      US$ {product.price}
                    </Title>
                    <Button type="primary" onClick={() => handleBuy(product)}>
                      Buy
                    </Button>
                  </div>
                </>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

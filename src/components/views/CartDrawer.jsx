// src/components/views/CartDrawer.jsx
import {
  Drawer,
  List,
  Button,
  Typography,
  Space,
  Image,
  InputNumber,
  notification,
  Divider,
  Badge,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../../contexts/CartContext.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const { Title, Text } = Typography;

export default function CartDrawer({ visible, onClose }) {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCart();
  const { isDarkMode } = useTheme();

  const handleCheckout = () => {
    notification.success({
      message: "Compra finalizada com sucesso!",
      description: `Obrigado pela sua compra! Total: $${getTotalPrice().toFixed(
        2
      )}`,
    });
    clearCart();
    onClose();
  };

  const handleClearCart = () => {
    clearCart();
    notification.info({
      message: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho.",
    });
  };

  return (
    <Drawer
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Carrinho de Compras</span>
          {items.length > 0 && (
            <Badge
              count={items.length}
              style={{ backgroundColor: "#1890ff" }}
            />
          )}
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      className={isDarkMode ? "dark-drawer" : ""}
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <ShoppingCartOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <Text type="secondary">Seu carrinho está vazio</Text>
          <Button type="primary" onClick={onClose} style={{ marginTop: 16 }}>
            Continuar Comprando
          </Button>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
            <List
              dataSource={items}
              renderItem={(item) => (
                <List.Item
                  key={item.id} // ✅ key única para cada item
                  actions={[
                    <Button
                      key={`delete-${item.id}`} // ✅ key única para o botão
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeItem(item.id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={50}
                        height={50}
                        style={{ objectFit: "contain" }}
                        preview={false}
                      />
                    }
                    title={
                      <Text
                        ellipsis={{ tooltip: item.title }}
                        style={{ fontSize: "12px" }}
                      >
                        {item.title}
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text strong>${item.price}</Text>
                        <Space>
                          <Text>Qtd:</Text>
                          <InputNumber
                            min={1}
                            max={10}
                            value={item.quantity}
                            onChange={(value) => updateQuantity(item.id, value)}
                            size="small"
                            style={{ width: 60 }}
                          />
                        </Space>
                        <Text type="secondary">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>

          <div style={{ padding: "16px", borderTop: "1px solid #d9d9d9" }}>
            <Divider />
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                Total: ${getTotalPrice().toFixed(2)}
              </Title>
            </div>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" block onClick={handleCheckout}>
                Finalizar Compra
              </Button>
              <Button danger block onClick={handleClearCart}>
                Limpar Carrinho
              </Button>
            </Space>
          </div>
        </>
      )}
    </Drawer>
  );
}

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
  Empty,
  Flex,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../../hooks/useCart.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const { Title, Text } = Typography;

export default function CartDrawer({ visible, onClose }) {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCart();
  const { isDarkMode } = useTheme();

  const handleCheckout = () => {
    if (items.length === 0) {
      notification.warning({
        message: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar.",
      });
      return;
    }

    const order = {
      id: `order-${Date.now()}`,
      items: [...items],
      total: getTotalPrice(),
      date: new Date().toISOString(),
      status: "completed",
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));

    notification.success({
      message: "Compra finalizada com sucesso!",
      description: (
        <div>
          <p>Obrigado pela sua compra!</p>
          <p>
            <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
          </p>
          <p>Número do pedido: #{order.id}</p>
          <p>Os detalhes do pedido foram salvos.</p>
        </div>
      ),
      duration: 6,
    });

    clearCart();
    onClose();
  };

  const handleClearCart = () => {
    if (items.length === 0) return;

    clearCart();
    notification.info({
      message: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho.",
    });
  };

  const handleQuantityChange = (productId, value) => {
    if (value === null || value < 1) {
      removeItem(productId);
      notification.info({
        message: "Item removido",
        description: "Produto removido do carrinho.",
      });
    } else {
      updateQuantity(productId, value);
    }
  };

  const getTotalItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Drawer
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Carrinho de Compras</span>
          {items.length > 0 && (
            <Badge
              count={getTotalItemsCount()}
              style={{ backgroundColor: "#1890ff" }}
            />
          )}
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
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
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Seu carrinho está vazio"
          />
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
                  key={item.id}
                  actions={[
                    <Button
                      key={`delete-${item.id}`}
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeItem(item.id)}
                      size="small"
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
                        style={{
                          objectFit: "contain",
                          borderRadius: "6px",
                        }}
                        preview={false}
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%23999'%3EImagem Indisponível%3C/text%3E%3C/svg%3E"
                      />
                    }
                    title={
                      <Text
                        ellipsis={{ tooltip: item.title }}
                        style={{ fontSize: "12px", lineHeight: "1.3" }}
                      >
                        {item.title}
                      </Text>
                    }
                    description={
                      <Space
                        direction="vertical"
                        size={0}
                        style={{ width: "100%" }}
                      >
                        <Text strong>${item.price.toFixed(2)}</Text>
                        <Flex align="center" gap="small">
                          <Text type="secondary">Qtd:</Text>
                          <InputNumber
                            min={1}
                            max={99}
                            value={item.quantity}
                            onChange={(value) =>
                              handleQuantityChange(item.id, value)
                            }
                            size="small"
                            style={{ width: 60 }}
                          />
                        </Flex>
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

          <div
            style={{
              padding: "16px",
              borderTop: `1px solid ${isDarkMode ? "#434343" : "#d9d9d9"}`,
              background: isDarkMode ? "#1f1f1f" : "#ffffff",
            }}
          >
            <Divider />
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                Total: ${getTotalPrice().toFixed(2)}
              </Title>
              <Text type="secondary">
                {getTotalItemsCount()}{" "}
                {getTotalItemsCount() === 1 ? "item" : "itens"}
              </Text>
            </div>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Button
                type="primary"
                block
                onClick={handleCheckout}
                size="large"
              >
                Finalizar Compra
              </Button>
              <Button
                danger
                block
                onClick={handleClearCart}
                disabled={items.length === 0}
              >
                Limpar Carrinho
              </Button>
            </Space>
          </div>
        </>
      )}
    </Drawer>
  );
}

import React from "react";
import {
  Image,
  Button,
  Typography,
  Rate,
  Flex,
  Popconfirm,
  message,
} from "antd";
import PropTypes from "prop-types";
import { useCart } from "../../hooks/useCart.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function ProductGridItem({
  product,
  onBuy,
  onEdit,
  onDelete,
  showActions = false,
}) {
  const { addItem } = useCart();
  const { isDarkMode } = useTheme();

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EImagem Indisponível%3C/text%3E%3C/svg%3E";

  const handleBuy = () => {
    addItem(product);
    message.success(`${product.title} adicionado ao carrinho!`);
    if (onBuy) {
      onBuy(product);
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(product);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(product);
  };

  const shortenText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <Flex
      vertical
      style={{
        height: "100%",
        padding: "16px",
        border: `1px solid ${isDarkMode ? "#434343" : "#e8e8e8"}`,
        borderRadius: "8px",
        backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
      className="hover:shadow-lg"
    >
      {/* Imagem do Produto - Topo */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <Image
          src={product.image}
          alt={product.title}
          width={120}
          height={120}
          style={{
            objectFit: "contain",
            borderRadius: "6px",
          }}
          fallback={fallbackImage}
          preview={true}
        />
      </div>

      {/* Conteúdo do Produto */}
      <Flex vertical style={{ flex: 1 }} gap="small">
        {/* Título do Produto */}
        <Text
          strong
          style={{
            fontSize: "14px",
            color: isDarkMode ? "#ffffff" : "#262626",
            lineHeight: "1.3",
            minHeight: "36px",
            display: "block",
          }}
        >
          {shortenText(product.title, 50)}
        </Text>

        {/* Rating */}
        <Flex gap="small" align="center">
          <Rate
            disabled
            value={product.rating?.rate || 4}
            style={{ fontSize: "12px" }}
          />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            ({product.rating?.count || Math.floor(Math.random() * 500) + 100})
          </Text>
        </Flex>

        {/* Descrição */}
        <Paragraph
          type="secondary"
          style={{
            fontSize: "12px",
            lineHeight: "1.4",
            color: isDarkMode ? "#8c8c8c" : "#595959",
            margin: 0,
            flex: 1,
            minHeight: "40px",
          }}
          ellipsis={{ rows: 2 }}
        >
          {shortenText(product.description, 80)}
        </Paragraph>

        {/* Preço e Botões de Ação */}
        <Flex
          justify="space-between"
          align="center"
          style={{ marginTop: "auto" }}
        >
          <Text
            strong
            style={{
              fontSize: "18px",
              color: isDarkMode ? "#ffffff" : "#1890ff",
            }}
          >
            ${product.price}
          </Text>

          <Flex gap="small" align="center">
            <Button
              type="primary"
              size="small"
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                fontWeight: "500",
              }}
              onClick={handleBuy}
            >
              Buy
            </Button>

            {/* Ações de Editar/Excluir */}
            {showActions && (
              <Flex gap="x-small">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  size="small"
                  style={{ color: "#1890ff" }}
                />
                <Popconfirm
                  title="Delete Product"
                  description="Are you sure you want to delete this product?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                  okType="danger"
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    style={{ color: "#ff4d4f" }}
                  />
                </Popconfirm>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

ProductGridItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number,
      count: PropTypes.number,
    }),
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onBuy: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
};

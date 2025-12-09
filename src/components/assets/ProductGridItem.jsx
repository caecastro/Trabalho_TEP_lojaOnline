import React from "react";
import {
  Image,
  Button,
  Typography,
  Rate,
  Flex,
  Popconfirm,
  message,
  Grid,
  Tag,
} from "antd";
import PropTypes from "prop-types";
import { useCart } from "../../hooks/useCart";
import { useTheme } from "../../contexts/ThemeContext";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function ProductGridItem({
  product,
  onBuy,
  onEdit,
  onDelete,
  showActions = false,
  compact = false,
}) {
  const { addItem } = useCart();
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EImagem Indisponível%3C/text%3E%3C/svg%3E";

  const handleBuy = () => {
    addItem(product);
    message.success(`${product.title} adicionado ao carrinho!`);
    if (onBuy) onBuy(product);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(product);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(product);
  };

  const shortenText = (text, maxLength) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const isCompact = compact || screens.xs;
  const isLocalProduct = product.isLocal;
  const isEditedApiProduct = product.isEditedApiProduct;

  return (
    <Flex
      vertical
      style={{
        height: "100%",
        padding: isCompact ? "12px" : "16px",
        border: `1px solid ${isDarkMode ? "#434343" : "#e8e8e8"}`,
        borderRadius: "8px",
        backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        position: "relative",
      }}
      className="hover:shadow-lg"
    >
      {/* Tags identificadoras */}
      {isLocalProduct && !isEditedApiProduct && (
        <Tag
          color="green"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 1,
            fontSize: "10px",
            padding: "0 4px",
          }}
        >
          Local
        </Tag>
      )}

      {isEditedApiProduct && (
        <Tag
          color="orange"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 1,
            fontSize: "10px",
            padding: "0 4px",
          }}
        >
          Editado
        </Tag>
      )}

      <div
        style={{
          textAlign: "center",
          marginBottom: isCompact ? "8px" : "12px",
        }}
      >
        <Image
          src={product.image}
          alt={product.title}
          width={isCompact ? 80 : 120}
          height={isCompact ? 80 : 120}
          style={{ objectFit: "contain", borderRadius: "6px" }}
          fallback={fallbackImage}
          preview={true}
        />
      </div>

      <Flex vertical style={{ flex: 1 }} gap={isCompact ? "x-small" : "small"}>
        <Text
          strong
          style={{
            fontSize: isCompact ? "12px" : "14px",
            color: isDarkMode ? "#ffffff" : "#262626",
            lineHeight: "1.3",
            minHeight: isCompact ? "32px" : "36px",
            display: "block",
          }}
        >
          {shortenText(product.title, isCompact ? 40 : 50)}
        </Text>

        {!isCompact && (
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
        )}

        {!isCompact && (
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
        )}

        <Flex
          justify="space-between"
          align="center"
          style={{ marginTop: "auto" }}
          wrap="wrap"
          gap="small"
        >
          <Text
            strong
            style={{
              fontSize: isCompact ? "16px" : "18px",
              color: isDarkMode ? "#ffffff" : "#1890ff",
            }}
          >
            ${product.price}
          </Text>

          <Flex gap="small" align="center" wrap="wrap">
            <Button
              type="primary"
              size={isCompact ? "small" : "middle"}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                fontWeight: "500",
              }}
              onClick={handleBuy}
            >
              Buy
            </Button>

            {/* Ações disponíveis para todos os produtos quando logado */}
            {showActions && (
              <Flex gap="x-small">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  size={isCompact ? "small" : "middle"}
                  style={{ color: "#1890ff" }}
                  title="Edit Product"
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
                    size={isCompact ? "small" : "middle"}
                    style={{ color: "#ff4d4f" }}
                    title="Delete Product"
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
    isLocal: PropTypes.bool,
    isEditedApiProduct: PropTypes.bool,
    originalApiId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onBuy: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
  compact: PropTypes.bool,
};

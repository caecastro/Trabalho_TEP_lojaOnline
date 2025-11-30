// src/components/assets/ProductCard.jsx
import {
  Image,
  Button,
  Typography,
  Rate,
  Card,
  notification,
  Popconfirm,
} from "antd";
import PropTypes from "prop-types";
import { useTheme } from "../../contexts/ThemeContext.jsx"; // ✅ caminho corrigido
import { useCart } from "../../contexts/CartContext.jsx";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function ProductCard({
  product,
  onBuy,
  onEdit,
  onDelete,
  showActions = false,
}) {
  const { isDarkMode } = useTheme();
  const { addItem } = useCart();

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EImagem Indisponível%3C/text%3E%3C/svg%3E";

  const handleBuy = () => {
    addItem(product);
    notification.success({
      message: "Produto adicionado ao carrinho",
      description: `${product.title} foi adicionado ao carrinho.`,
    });

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

  return (
    <Card
      className={`h-full ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}
      cover={
        <div className="flex justify-center p-4">
          <Image
            src={product.image}
            alt={product.title}
            width={160}
            height={160}
            style={{ objectFit: "contain" }}
            fallback={fallbackImage}
            preview={true}
            className="p-2"
          />
        </div>
      }
      actions={
        showActions
          ? [
              <Button
                key={`edit-${product.id}`} // ✅ key única
                type="link"
                icon={<EditOutlined />}
                onClick={handleEdit}
                className="text-blue-500"
              >
                Edit
              </Button>,
              <Popconfirm
                key={`delete-${product.id}`} // ✅ key única
                title="Delete Product"
                description="Are you sure you want to delete this product?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                okType="danger"
              >
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  className="text-red-500"
                >
                  Delete
                </Button>
              </Popconfirm>,
            ]
          : []
      }
    >
      <div className="flex flex-col h-full">
        <Text
          strong
          className={`text-lg block mb-2 line-clamp-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {product.title}
        </Text>

        <div className="flex items-center gap-2 mb-2">
          <Rate
            disabled
            defaultValue={product.rating?.rate || 4}
            className="text-sm"
          />
          <Text
            type="secondary"
            className={`text-sm ${isDarkMode ? "text-gray-400" : ""}`}
          >
            ({product.rating?.count || Math.floor(Math.random() * 500) + 100})
          </Text>
        </div>

        <Paragraph
          type="secondary"
          className={`text-sm mb-4 line-clamp-3 flex-1 ${
            isDarkMode ? "text-gray-400" : ""
          }`}
          ellipsis={{ rows: 3 }}
        >
          {product.description}
        </Paragraph>

        <div className="flex justify-between items-center mt-auto">
          <Text
            strong
            className={`text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            US$ {product.price}
          </Text>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 border-0"
            onClick={handleBuy}
          >
            Buy
          </Button>
        </div>
      </div>
    </Card>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ✅ aceita string ou número
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

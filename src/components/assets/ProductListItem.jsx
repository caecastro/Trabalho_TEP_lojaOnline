import { Image, Button, Typography, Rate, Flex, Divider } from "antd";
import PropTypes from "prop-types";

const { Text, Title } = Typography;

export default function ProductListItem({ product, onBuy }) {
  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EImagem Indisponível%3C/text%3E%3C/svg%3E";

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover-shadow transition-all duration-300 hover:border-blue-300">
      <Flex gap="middle" align="start">
        {/* Imagem do produto */}
        <div className="flex-shrink-0">
          <Image
            src={product.image}
            alt={product.title}
            width={120}
            height={120}
            style={{
              objectFit: "contain",
              borderRadius: "8px",
            }}
            fallback={fallbackImage}
            preview={true}
            placeholder={
              <div className="flex justify-center items-center w-32 h-32 bg-gray-100 rounded">
                <span className="text-gray-400">Carregando...</span>
              </div>
            }
          />
        </div>

        {/* Detalhes do produto */}
        <Flex vertical style={{ flex: 1 }} gap="small">
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            {product.title}
          </Title>

          <Flex gap="small" align="center">
            <Rate
              disabled
              defaultValue={product.rating?.rate || 4}
              style={{ fontSize: "14px" }}
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              ({product.rating?.count || Math.floor(Math.random() * 500) + 100})
            </Text>
          </Flex>

          <Text
            type="secondary"
            style={{
              fontSize: "14px",
              lineHeight: "1.4",
              color: "#595959",
            }}
            className="line-clamp-2"
          >
            {product.description}
          </Text>

          <Divider style={{ margin: "12px 0" }} />

          <Flex justify="space-between" align="center">
            <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
              ${product.price}
            </Text>
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                fontWeight: "500",
              }}
              onClick={() => onBuy?.(product)}
            >
              Buy
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}

ProductListItem.propTypes = {
  product: PropTypes.shape({
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
};

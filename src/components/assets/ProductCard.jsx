import { Image, Button, Typography, Rate } from "antd";
import PropTypes from "prop-types";

const { Text } = Typography;

export default function ProductCard({ product, onBuy }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Imagem do produto */}
      <div className="flex justify-center mb-4">
        <Image
          src={product.image}
          alt={product.title}
          width={120}
          height={120}
          className="object-contain rounded"
          preview={true}
        />
      </div>

      {/* Detalhes do produto */}
      <div className="flex-1 flex flex-col">
        <Text strong className="text-lg block mb-2 line-clamp-2">
          {product.title}
        </Text>

        <div className="flex items-center gap-2 mb-2">
          <Rate
            disabled
            defaultValue={product.rating?.rate || 4}
            className="text-sm"
          />
          <Text type="secondary" className="text-sm">
            ({product.rating?.count || Math.floor(Math.random() * 500) + 100})
          </Text>
        </div>

        <Text
          type="secondary"
          className="text-sm block mb-4 line-clamp-3 flex-1"
        >
          {product.description}
        </Text>

        <div className="flex justify-between items-center mt-auto">
          <Text strong className="text-base">
            US$ {product.price}
          </Text>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 border-0"
            onClick={() => onBuy?.(product)}
          >
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
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

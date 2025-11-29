import { useState, useMemo } from "react";
import {
  Typography,
  Divider,
  Spin,
  Button,
  notification,
  Input,
  Flex,
} from "antd";
import { useUser } from "../hooks/useUser";
import { useProducts } from "../hooks/useProducts";
import Controller from "../components/views/Controller";
import ProductListItem from "../components/assets/ProductListItem";
import AddProductModal from "../components/views/AddProductModal";

const { Title, Text } = Typography;
const { Search } = Input;

export default function Products() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useUser();
  const { products, loading, addProduct } = useProducts();

  // Filtrar produtos baseado no search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setModalVisible(false);
    } catch (error) {
      console.error("Erro no handleAddProduct:", error);
    }
  };

  const handleBuy = (product) => {
    notification.success({
      message: "Produto adicionado ao carrinho",
      description: `${product.title} foi adicionado ao carrinho.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Controller />
        <div className="flex-1 flex justify-center items-center">
          <Spin size="large" />
          <span className="ml-4 text-gray-600">Carregando produtos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Controller />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Cabeçalho com usuário logado */}
        <Flex
          justify="space-between"
          align="start"
          className="mb-8"
          wrap="wrap"
          gap="middle"
        >
          <Title level={1} style={{ margin: 0, color: "#262626" }}>
            List of Products
          </Title>

          {user && (
            <Flex gap="middle" align="center" wrap="wrap">
              <Flex vertical align="flex-end">
                <Text strong style={{ color: "#262626", fontSize: "16px" }}>
                  {user.name}
                </Text>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {user.email}
                </Text>
              </Flex>
              <Flex gap="small">
                <Button
                  type="primary"
                  onClick={() => setModalVisible(true)}
                  style={{
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                  }}
                >
                  Add Product
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>

        <Divider />

        {/* Campo de busca */}
        <div className="mb-6">
          <Search
            placeholder="Buscar produtos pelo nome..."
            allowClear
            size="large"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Lista de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onBuy={handleBuy}
            />
          ))}
        </div>

        {/* Mensagem quando não há produtos */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Text type="secondary" style={{ fontSize: "16px" }}>
              {searchTerm
                ? "Nenhum produto encontrado para sua busca."
                : "Nenhum produto encontrado."}
            </Text>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <footer className="w-full text-center py-6 border-t border-gray-300 text-gray-600 mt-12">
        IFSC ©2025 Created by Lidiane Visintin
      </footer>

      {/* Modal para adicionar produto */}
      <AddProductModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}

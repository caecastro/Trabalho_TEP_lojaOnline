import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Divider,
  Spin,
  Button,
  notification,
  Input,
  Flex,
  Row,
  Col,
  Grid,
  Tag,
} from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import Controller from "../components/views/Controller";
import ProductGridItem from "../components/assets/ProductGridItem";
import AddProductModal from "../components/views/AddProductModal";
import EditProductModal from "../components/views/EditProductModal";
import { useTheme } from "../contexts/ThemeContext";

const { Title, Text } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

export default function Products() {
  // Estados para modais e busca
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks customizados
  const { user } = useAuth();
  const {
    products,
    loading,
    addProduct,
    editProduct,
    deleteProduct,
    loadApiProducts,
  } = useProducts();
  const { addItem } = useCart();
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();

  // Carrega produtos da API ao montar componente
  useEffect(() => {
    loadApiProducts(20);
  }, []);

  // Filtra produtos baseado no termo de busca
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Manipuladores de produtos
  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setModalVisible(false);
      notification.success({
        message: "Produto cadastrado com sucesso!",
        description: "O produto foi salvo com sucesso.",
      });
    } catch (error) {
      notification.error({
        message: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
      });
    }
  };

  const handleEditProduct = async (productId, productData) => {
    try {
      await editProduct(productId, productData);
      setEditModalVisible(false);
      setEditingProduct(null);
      notification.success({
        message: "Produto atualizado com sucesso!",
        description: "O produto foi atualizado com sucesso.",
      });
    } catch (error) {
      notification.error({
        message: "Erro ao atualizar produto",
        description: "Não foi possível atualizar o produto.",
      });
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      await deleteProduct(product.id);
      notification.success({
        message: "Produto excluído com sucesso!",
        description: "O produto foi removido com sucesso.",
      });
    } catch (error) {
      notification.error({
        message: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto.",
      });
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const handleBuy = (product) => {
    addItem(product);
    notification.success({
      message: "Produto adicionado ao carrinho",
      description: `${product.title} foi adicionado ao carrinho.`,
    });
  };

  // Estatísticas de produtos
  const productStats = {
    api: products.filter((p) => !p.isLocal).length,
    local: products.filter((p) => p.isLocal).length,
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Controller />
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="text-center">
            <Spin size="large" />
            <span
              className={`block mt-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Carregando produtos...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <Controller />

      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Cabeçalho com título e ações */}
        <Flex
          vertical={!screens.sm}
          gap="small"
          justify="space-between"
          align={screens.sm ? "center" : "start"}
          className="mb-6 sm:mb-8"
        >
          <Flex vertical gap="small">
            <Title
              level={screens.xs ? 2 : 1}
              className={`m-0 text-center sm:text-left ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              List of Products
            </Title>
            <div className="flex gap-2 justify-center sm:justify-start">
              <Tag color="blue">API: {productStats.api}</Tag>
              <Tag color="green">Local: {productStats.local}</Tag>
            </div>
          </Flex>

          {/* Seção do usuário e botão de ação */}
          {user && (
            <Flex
              vertical={!screens.xs}
              gap="small"
              align={screens.xs ? "stretch" : "center"}
              className="w-full sm:w-auto"
            >
              <Flex
                vertical
                align={screens.xs ? "center" : "flex-end"}
                className={screens.xs ? "text-center" : ""}
              >
                <Text
                  strong
                  className={`${isDarkMode ? "text-white" : "text-gray-900"} ${
                    screens.xs ? "text-base" : ""
                  }`}
                >
                  {user.name}
                </Text>
                <Text
                  type="secondary"
                  className={isDarkMode ? "text-gray-400" : ""}
                >
                  {user.email}
                </Text>
              </Flex>
              <Button
                type="primary"
                onClick={() => setModalVisible(true)}
                className="w-full sm:w-auto"
                size={screens.xs ? "middle" : "large"}
              >
                Add Product
              </Button>
            </Flex>
          )}
        </Flex>

        <Divider className={isDarkMode ? "bg-gray-700" : ""} />

        {/* Barra de busca */}
        <div className="mb-6 flex justify-center sm:justify-start">
          <Search
            placeholder="Buscar produtos pelo nome..."
            allowClear
            size={screens.xs ? "middle" : "large"}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: screens.xs ? "100%" : "400px", maxWidth: "100%" }}
            className={isDarkMode ? "dark-search" : ""}
          />
        </div>

        {/* Grid de produtos responsivo */}
        <Row
          gutter={[screens.xs ? 12 : 16, screens.xs ? 12 : 24]}
          justify={screens.xs ? "center" : "start"}
        >
          {filteredProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6} xxl={4}>
              <ProductGridItem
                product={product}
                onBuy={handleBuy}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
                showActions={!!user}
                compact={screens.xs}
              />
            </Col>
          ))}
        </Row>

        {/* Estado vazio */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <Text
              type="secondary"
              className={`${
                isDarkMode ? "text-gray-400" : ""
              } text-base sm:text-lg`}
            >
              {searchTerm
                ? "Nenhum produto encontrado para sua busca."
                : "Nenhum produto encontrado."}
            </Text>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className={`w-full text-center py-4 sm:py-6 border-t text-sm sm:text-base ${
          isDarkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-600"
        }`}
      >
        IFSC ©2025 Created by Lidiane Visintin
      </footer>

      {/* Modais */}
      <AddProductModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onAddProduct={handleAddProduct}
      />
      <EditProductModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingProduct(null);
        }}
        onEditProduct={handleEditProduct}
        product={editingProduct}
      />
    </div>
  );
}

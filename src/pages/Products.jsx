// src/pages/Products.jsx
import { useState, useMemo } from "react";
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
  Popconfirm,
} from "antd";
import { useAuth } from "../contexts/AuthContext.jsx"; // ✅ corrigido
import { useProducts } from "../hooks/useProducts.js";
import Controller from "../components/views/Controller.jsx";
import ProductCard from "../components/assets/ProductCard.jsx";
import AddProductModal from "../components/views/AddProductModal.jsx";
import EditProductModal from "../components/views/EditProductModal.jsx"; // NOVO
import { useTheme } from "../contexts/ThemeContext.jsx"; // ✅ corrigido

const { Title, Text } = Typography;
const { Search } = Input;

export default function Products() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const { products, loading, addProduct, editProduct, deleteProduct } =
    useProducts();
  const { isDarkMode } = useTheme();

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
      notification.success({
        message: "Produto cadastrado com sucesso!",
        description: "O produto foi salvo com sucesso.",
      });
    } catch (error) {
      console.error("Erro no handleAddProduct:", error);
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
      console.error("Erro ao editar produto:", error);
      notification.error({
        message: "Erro ao atualizar produto",
        description: "Não foi possível atualizar o produto.",
      });
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      if (product.id.startsWith("local-")) {
        await deleteProduct(product.id);
        notification.success({
          message: "Produto excluído com sucesso!",
          description: "O produto foi removido com sucesso.",
        });
      } else {
        notification.warning({
          message: "Não é possível excluir",
          description: "Só é possível excluir produtos cadastrados localmente.",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      notification.error({
        message: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto.",
      });
    }
  };

  const openEditModal = (product) => {
    if (product.id.startsWith("local-")) {
      setEditingProduct(product);
      setEditModalVisible(true);
    } else {
      notification.warning({
        message: "Não é possível editar",
        description: "Só é possível editar produtos cadastrados localmente.",
      });
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
      <div
        className={`min-h-screen flex flex-col ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Controller />
        <div className="flex-1 flex justify-center items-center">
          <Spin size="large" />
          <span
            className={`ml-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Carregando produtos...
          </span>
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

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Flex
          justify="space-between"
          align="start"
          className="mb-8"
          wrap="wrap"
          gap="middle"
        >
          <Title
            level={1}
            className={`m-0 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            List of Products
          </Title>

          {user && (
            <Flex gap="middle" align="center" wrap="wrap">
              <Flex vertical align="flex-end">
                <Text
                  strong
                  className={isDarkMode ? "text-white" : "text-gray-900"}
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
              <Flex gap="small">
                <Button
                  type="primary"
                  onClick={() => setModalVisible(true)}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                >
                  Add Product
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>

        <Divider className={isDarkMode ? "bg-gray-700" : ""} />

        <div className="mb-6">
          <Search
            placeholder="Buscar produtos pelo nome..."
            allowClear
            size="large"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "400px" }}
            className={
              isDarkMode
                ? "[&_.ant-input]:bg-gray-700 [&_.ant-input]:border-gray-600 [&_.ant-input]:text-white [&_.ant-input]::placeholder-gray-400"
                : ""
            }
          />
        </div>

        <Row gutter={[24, 24]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} key={product.id}>
              <ProductCard
                product={product}
                onBuy={handleBuy}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
                showActions={user && product.id.startsWith("local-")}
              />
            </Col>
          ))}
        </Row>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Text
              type="secondary"
              className={isDarkMode ? "text-gray-400" : ""}
            >
              {searchTerm
                ? "Nenhum produto encontrado para sua busca."
                : "Nenhum produto encontrado."}
            </Text>
          </div>
        )}
      </div>

      <footer
        className={`w-full text-center py-6 border-t ${
          isDarkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-600"
        }`}
      >
        IFSC ©2025 Created by Lidiane Visintin
      </footer>

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

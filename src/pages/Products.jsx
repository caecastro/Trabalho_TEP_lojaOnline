import { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Typography,
  Spin,
  Button,
  notification,
  Input,
  Row,
  Col,
  Space,
  Divider,
  theme,
  Grid,
  Card,
  Badge,
} from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import Controller from "../components/views/Controller";
import AddProductModal from "../components/views/AddProductModal";
import EditProductModal from "../components/views/EditProductModal";
import ProductGridItem from "../components/assets/ProductGridItem";
import ProductManagementPanel from "../components/views/ProductManagementPanel";

const { Title, Text } = Typography;
const { Search } = Input;
const { Content, Footer } = Layout;
const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function Products() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  const screens = useBreakpoint();
  const { token } = useToken();

  useEffect(() => {
    const loadData = async () => {
      await loadApiProducts(20);
    };

    loadData();

    // Adiciona listener para atualizar quando produtos forem restaurados
    const handleProductsUpdated = () => {
      loadApiProducts(20);
    };

    window.addEventListener("productsUpdated", handleProductsUpdated);

    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, []);

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
      await deleteProduct(product);
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

  const productStats = {
    api: products.filter((p) => !p.isLocal && !p.isEditedApiProduct).length,
    local: products.filter((p) => p.isLocal && !p.isEditedApiProduct).length,
    editedApi: products.filter((p) => p.isEditedApiProduct).length,
  };

  if (loading && products.length === 0) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Controller />
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: token.paddingXXL,
          }}
        >
          <Spin size="large" />
          <Text style={{ marginLeft: token.marginMD }}>
            Carregando produtos...
          </Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Controller />

      <Content
        style={{
          padding: token.paddingLG,
          backgroundColor: token.colorBgContainer,
        }}
      >
        <div
          style={{
            marginBottom: token.marginLG,
            textAlign: "center",
          }}
        >
          <Title level={1} style={{ marginBottom: token.marginSM }}>
            List of Products
          </Title>

          <Space size="small" style={{ marginBottom: token.marginMD }}>
            <Badge
              count={productStats.api}
              style={{ backgroundColor: "#1890ff" }}
            >
              <Card size="small" style={{ width: 80 }}>
                <Text strong>API</Text>
              </Card>
            </Badge>
            <Badge
              count={productStats.local}
              style={{ backgroundColor: "#52c41a" }}
            >
              <Card size="small" style={{ width: 80 }}>
                <Text strong>Local</Text>
              </Card>
            </Badge>
            <Badge
              count={productStats.editedApi}
              style={{ backgroundColor: "#faad14" }}
            >
              <Card size="small" style={{ width: 80 }}>
                <Text strong>Editados</Text>
              </Card>
            </Badge>
          </Space>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: token.marginLG,
          }}
        >
          <Search
            placeholder="Buscar produtos pelo nome..."
            allowClear
            size="large"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", maxWidth: 400 }}
          />
        </div>

        {user && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: token.marginLG,
            }}
          >
            <ProductManagementPanel />
            <Button
              type="primary"
              size="large"
              onClick={() => setModalVisible(true)}
            >
              Add Product
            </Button>
          </div>
        )}

        <Row gutter={[token.marginLG, token.marginLG]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
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

        {filteredProducts.length === 0 && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: token.paddingXXL,
            }}
          >
            <Text type="secondary">
              {searchTerm
                ? "Nenhum produto encontrado para sua busca."
                : "Nenhum produto encontrado."}
            </Text>
          </div>
        )}
      </Content>

      <Footer
        style={{
          textAlign: "center",
          borderTop: `1px solid ${token.colorBorder}`,
          color: token.colorTextSecondary,
          padding: `${token.paddingLG}px 0`,
        }}
      >
        IFSC ©2025 Created by Lidiane Visintin
      </Footer>

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
    </Layout>
  );
}

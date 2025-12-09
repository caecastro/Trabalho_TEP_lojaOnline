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
  Card,
  Image,
  Rate,
  Tag,
  Space,
  Divider,
  theme,
  Grid,
} from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import Controller from "../components/views/Controller";
import AddProductModal from "../components/views/AddProductModal";
import EditProductModal from "../components/views/EditProductModal";

const { Title, Text, Paragraph } = Typography;
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
    loadApiProducts(20);
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
            <Tag color="blue">API: {productStats.api}</Tag>
            <Tag color="green">Local: {productStats.local}</Tag>
            <Tag color="orange">Editados: {productStats.editedApi}</Tag>
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
              justifyContent: "flex-end",
              marginBottom: token.marginLG,
            }}
          >
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
              <Card
                hoverable
                style={{ height: "100%" }}
                cover={
                  <div
                    style={{
                      padding: token.paddingMD,
                      backgroundColor: token.colorBgLayout,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      style={{
                        maxHeight: 160,
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <Text strong ellipsis={{ rows: 2 }}>
                      {product.title}
                    </Text>
                  }
                  description={
                    <>
                      <div style={{ marginBottom: token.marginXS }}>
                        <Rate
                          disabled
                          defaultValue={product.rating?.rate || 4}
                          size="small"
                        />
                        <Text
                          type="secondary"
                          style={{ marginLeft: token.marginXS }}
                        >
                          ({product.rating?.count || 0})
                        </Text>
                      </div>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 3 }}
                        style={{ fontSize: token.fontSizeSM, margin: 0 }}
                      >
                        {product.description}
                      </Paragraph>
                      <Divider style={{ margin: `${token.marginXS}px 0` }} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Title
                          level={4}
                          style={{
                            color: token.colorPrimary,
                            margin: 0,
                          }}
                        >
                          US$ {product.price}
                        </Title>
                        <Button
                          type="primary"
                          onClick={() => handleBuy(product)}
                        >
                          Buy
                        </Button>
                      </div>
                    </>
                  }
                />
              </Card>
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

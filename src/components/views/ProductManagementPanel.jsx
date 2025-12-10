import React, { useState } from "react";
import {
  Modal,
  Button,
  List,
  Typography,
  Space,
  Tag,
  Tooltip,
  notification,
  Card,
  Badge,
  Divider,
} from "antd";
import {
  RestOutlined,
  DeleteOutlined,
  EditOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useProducts } from "../../hooks/useProducts";

const { Title, Text } = Typography;

export default function ProductManagementPanel() {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    editedApiProducts,
    deletedApiProducts,
    restoreAllProducts,
    restoreProduct,
    loadApiProducts,
  } = useProducts();

  const handleRestoreAll = () => {
    restoreAllProducts();
    notification.success({
      message: "Produtos restaurados!",
      description: "Todos os produtos foram restaurados ao estado original.",
    });
    setModalVisible(false);
  };

  const handleRestoreProduct = (productId) => {
    restoreProduct(productId);
    notification.success({
      message: "Produto restaurado!",
      description: "O produto foi restaurado com sucesso.",
    });
  };

  return (
    <>
      <Tooltip title="Gerenciar produtos excluídos/editados">
        <Button
          type="dashed"
          icon={<RestOutlined />}
          onClick={() => setModalVisible(true)}
          style={{ marginLeft: 8 }}
        >
          Gerenciar Produtos
          {((editedApiProducts && Object.keys(editedApiProducts).length > 0) ||
            deletedApiProducts.length > 0) && (
            <Badge
              count={
                Object.keys(editedApiProducts).length +
                deletedApiProducts.length
              }
              style={{
                marginLeft: 8,
                backgroundColor: "#faad14",
              }}
            />
          )}
        </Button>
      </Tooltip>

      <Modal
        title={
          <Space>
            <RestOutlined />
            <span>Gerenciamento de Produtos</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Fechar
          </Button>,
          <Button
            key="restoreAll"
            type="primary"
            onClick={handleRestoreAll}
            disabled={
              Object.keys(editedApiProducts).length === 0 &&
              deletedApiProducts.length === 0
            }
          >
            Restaurar Todos
          </Button>,
        ]}
        width={700}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Gerencie produtos excluídos ou editados. Produtos excluídos não
            aparecem na lista e produtos editados substituem os originais.
          </Text>
        </div>

        <Divider />

        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {Object.keys(editedApiProducts).length > 0 && (
            <Card size="small" title="Produtos Editados">
              <List
                size="small"
                dataSource={Object.entries(editedApiProducts)}
                renderItem={([productId, productData]) => (
                  <List.Item
                    actions={[
                      <Button
                        key={`restore-original-btn-${productId}`}
                        type="link"
                        icon={<UndoOutlined />}
                        onClick={() => handleRestoreProduct(productId)}
                      >
                        Restaurar Original
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>
                            {productData.title || `Produto ${productId}`}
                          </Text>
                          <Tag color="orange" icon={<EditOutlined />}>
                            Editado
                          </Tag>
                        </Space>
                      }
                      description={
                        <Text type="secondary">
                          Editado em:{" "}
                          {new Date(productData.editedAt).toLocaleDateString()}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {deletedApiProducts.length > 0 && (
            <Card size="small" title="Produtos Excluídos">
              <List
                size="small"
                dataSource={deletedApiProducts}
                renderItem={(productId) => (
                  <List.Item
                    key={productId}
                    actions={[
                      <Button
                        key={`restore-btn-${productId}`}
                        type="link"
                        icon={<UndoOutlined />}
                        onClick={() => handleRestoreProduct(productId)}
                      >
                        Restaurar
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>Produto ID: {productId}</Text>
                          <Tag color="red" icon={<DeleteOutlined />}>
                            Excluído
                          </Tag>
                        </Space>
                      }
                      description="Este produto foi removido da lista"
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {Object.keys(editedApiProducts).length === 0 &&
            deletedApiProducts.length === 0 && (
              <div style={{ textAlign: "center", padding: 24 }}>
                <Text type="secondary">
                  Nenhum produto editado ou excluído para gerenciar.
                </Text>
              </div>
            )}
        </Space>
      </Modal>
    </>
  );
}

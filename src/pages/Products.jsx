import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  notification,
  Typography,
  Divider,
  Spin,
  Image,
  Rate,
} from "antd";
import { getUser, api } from "../services/api.js";
import { localStore } from "../utils/localStorage.js";
import Controller from "../components/views/Controller.jsx";

const { Title, Text } = Typography;

export default function Products() {
  const [usuario, setUsuario] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Buscar usuário da API
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await getUser(1);
        setUsuario(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        notification.error({
          message: "Erro ao carregar usuário",
          description: "Não foi possível carregar os dados do usuário.",
        });
      }
    };
    fetchUsuario();
  }, []);

  // Buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts(9); // Busca 9 produtos para 3x3
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        notification.error({
          message: "Erro ao carregar produtos",
          description: "Não foi possível carregar os produtos da API.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const abrirModal = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const salvarProduto = (values) => {
    const novoProduto = {
      id: Date.now(),
      title: values.nome,
      price: parseFloat(values.preco),
      image: values.imagem,
      description: values.descricao,
    };

    const produtosExtra = localStore.get("produtosExtra") || [];
    const atualizados = [...produtosExtra, novoProduto];
    localStore.set("produtosExtra", JSON.stringify(atualizados));

    setModalVisible(false);
    notification.success({
      message: "Produto cadastrado",
      description: "O produto foi salvo com sucesso!",
    });
  };

  const deslogar = () => {
    setUsuario(null);
    notification.info({
      message: "Logout realizado",
      description: "Você saiu da conta.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Controller />
        <div className="flex-1 flex justify-center items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Controller />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <Title level={1} className="mb-0 text-2xl sm:text-3xl">
            List of Products
          </Title>

          {usuario && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="text-right order-2 sm:order-1">
                <Text strong className="text-base block">
                  {usuario.name}
                </Text>
                <Text type="secondary" className="text-sm block">
                  Sincere Digital Juz
                </Text>
              </div>
              <div className="flex gap-2 order-1 sm:order-2">
                <Button
                  type="primary"
                  onClick={abrirModal}
                  className="bg-blue-600 hover:bg-blue-700 border-0"
                >
                  Add Product
                </Button>
                <Button
                  onClick={deslogar}
                  className="border-gray-300 hover:border-gray-400"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* GRID 3x3 RESPONSIVO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col"
            >
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
                  <Rate disabled defaultValue={4} className="text-sm" />
                  <Text type="secondary" className="text-sm">
                    ({Math.floor(Math.random() * 500) + 100})
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
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="w-full text-center py-6 border-t border-gray-300 text-gray-600 mt-12">
        IPSC ©2023 Created by Lidiane Visintin
      </footer>

      <Modal
        title="Add New Product"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={salvarProduto}>
          <Form.Item
            label="Product Name"
            name="nome"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="preco"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="imagem"
            rules={[{ required: true, message: "Please enter image URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="descricao">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

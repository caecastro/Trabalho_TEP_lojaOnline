import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Tooltip,
  Space,
  Typography,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { getUser } from "../services/api";
import Controller from "../components/views/Controller";

const { Title, Text } = Typography;
const { Column } = Table;

// Função para capitalizar primeira letra
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Função para formatar data
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Gerar data aleatória até 5 anos no passado
const generateRandomDate = () => {
  const currentDate = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

  const randomTime =
    fiveYearsAgo.getTime() +
    Math.random() * (currentDate.getTime() - fiveYearsAgo.getTime());
  return new Date(randomTime);
};

// Gerar endereço aleatório
const generateRandomAddress = () => {
  const streets = [
    "Main St",
    "Oak Ave",
    "Pine Rd",
    "Maple Dr",
    "Cedar Ln",
    "Elm St",
    "Birch Way",
  ];
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
  ];
  const randomStreet = streets[Math.floor(Math.random() * streets.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomNumber = Math.floor(Math.random() * 1000) + 1;

  return `${randomNumber} ${randomStreet} - ${randomCity}`;
};

// Gerar telefone aleatório
const generateRandomPhone = () => {
  const part1 = Math.floor(Math.random() * 900) + 100;
  const part2 = Math.floor(Math.random() * 900) + 100;
  const part3 = Math.floor(Math.random() * 9000) + 1000;
  return `1-${part1}-${part2}-${part3}`;
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form] = Form.useForm();

  // Carregar clientes da API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Buscar múltiplos usuários da API
        const users = await Promise.all([
          getUser(1),
          getUser(2),
          getUser(3),
          getUser(4),
          getUser(5),
          getUser(6),
          getUser(7),
          getUser(8),
          getUser(9),
          getUser(10),
        ]);

        // Transformar dados da API com dados adicionais
        const clientsData = users.map((user) => ({
          key: user.id,
          name: user.name,
          email: user.email,
          createdAt: generateRandomDate(),
          address: generateRandomAddress(),
          phone: generateRandomPhone(),
          status: Math.random() > 0.5 ? "activated" : "deactivated",
          originalData: user,
        }));

        setClients(clientsData);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        notification.error({
          message: "Erro ao carregar clientes",
          description: "Não foi possível carregar os dados dos clientes.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Adicionar/Editar cliente
  const handleSaveClient = (values) => {
    const clientData = {
      key: editingClient ? editingClient.key : Date.now(),
      name: values.name,
      email: values.email,
      createdAt: editingClient ? editingClient.createdAt : generateRandomDate(),
      address: values.address,
      phone: values.phone,
      status: values.status,
    };

    if (editingClient) {
      // Editar cliente existente
      setClients((prev) =>
        prev.map((client) =>
          client.key === editingClient.key
            ? { ...client, ...clientData }
            : client
        )
      );
      notification.success({
        message: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso.",
      });
    } else {
      // Adicionar novo cliente
      setClients((prev) => [clientData, ...prev]);
      notification.success({
        message: "Cliente cadastrado",
        description: "O cliente foi adicionado com sucesso.",
      });
    }

    setModalVisible(false);
    setEditingClient(null);
    form.resetFields();
  };

  // Excluir cliente
  const handleDeleteClient = (client) => {
    Modal.confirm({
      title: "Confirmar exclusão",
      content: `Tem certeza que deseja excluir o cliente ${client.name}?`,
      okText: "Excluir",
      cancelText: "Cancelar",
      okType: "danger",
      onOk() {
        setClients((prev) => prev.filter((c) => c.key !== client.key));
        notification.success({
          message: "Cliente excluído",
          description: "O cliente foi removido com sucesso.",
        });
      },
    });
  };

  // Abrir modal para edição
  const handleEditClient = (client) => {
    setEditingClient(client);
    form.setFieldsValue({
      name: client.name,
      email: client.email,
      address: client.address,
      phone: client.phone,
      status: client.status,
    });
    setModalVisible(true);
  };

  // Fechar modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingClient(null);
    form.resetFields();
  };

  // Dados formatados para a tabela
  const tableData = useMemo(() => {
    return clients.map((client) => ({
      ...client,
      formattedName: capitalizeFirstLetter(client.name),
      formattedEmail: client.email.toLowerCase(),
      formattedDate: formatDate(client.createdAt),
      formattedAddress: client.address,
      formattedPhone: client.phone,
    }));
  }, [clients]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Controller />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Card>
          {/* Cabeçalho */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <Title level={2} style={{ margin: 0, color: "#262626" }}>
              List of Clients
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
              }}
            >
              Add Client
            </Button>
          </div>

          {/* Tabela de Clientes */}
          <Table
            dataSource={tableData}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 1000 }}
            size="middle"
          >
            <Column
              title="Name"
              dataIndex="formattedName"
              key="name"
              sorter={(a, b) => a.formattedName.localeCompare(b.formattedName)}
              sortDirections={["ascend", "descend"]}
              width={200}
            />

            <Column
              title="Email"
              dataIndex="formattedEmail"
              key="email"
              render={(email) => (
                <Space>
                  <MailOutlined style={{ color: "#1890ff" }} />
                  <Text>{email}</Text>
                </Space>
              )}
              width={200}
            />

            <Column
              title="Contact at"
              dataIndex="formattedDate"
              key="createdAt"
              sorter={(a, b) => new Date(a.createdAt) - new Date(b.createdAt)}
              sortDirections={["ascend", "descend"]}
              width={120}
            />

            <Column
              title="Address"
              dataIndex="formattedAddress"
              key="address"
              width={200}
            />

            <Column
              title="Phone"
              dataIndex="formattedPhone"
              key="phone"
              width={150}
            />

            <Column
              title="Status"
              dataIndex="status"
              key="status"
              sorter={(a, b) => a.status.localeCompare(b.status)}
              sortDirections={["ascend", "descend"]}
              render={(status) => (
                <Tag
                  color={status === "activated" ? "green" : "red"}
                  style={{
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontWeight: "500",
                  }}
                >
                  {status === "activated" ? "Activated" : "Deactivated"}
                </Tag>
              )}
              width={120}
            />

            <Column
              title="Action"
              key="action"
              fixed="right"
              render={(_, record) => (
                <Space size="small">
                  <Tooltip title="Edit client">
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEditClient(record)}
                      style={{ color: "#1890ff" }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete client">
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteClient(record)}
                      style={{ color: "#ff4d4f" }}
                    />
                  </Tooltip>
                </Space>
              )}
              width={100}
            />
          </Table>
        </Card>
      </div>

      <footer className="w-full text-center py-6 border-t border-gray-300 text-gray-600 mt-12">
        IFSC ©2025 Created by Lidiane Visintin
      </footer>

      {/* Modal para adicionar/editar cliente */}
      <Modal
        title={editingClient ? "Edit Client" : "Add New Client"}
        open={modalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingClient ? "Update" : "Save"}
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-blue-600 hover:bg-blue-700 border-0",
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveClient}
          requiredMark={false}
          className="mt-4"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter client name" }]}
          >
            <Input placeholder="Enter client name" size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" size="large" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input placeholder="Enter client address" size="large" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" size="large" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Input
              placeholder="Enter status (activated/deactivated)"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

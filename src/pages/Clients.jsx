import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Drawer,
  Select,
  Grid,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Controller from "../components/views/Controller";
import { useTheme } from "../contexts/ThemeContext";
import {
  addClient,
  updateClient,
  removeClient,
} from "../store/slices/clientSlice";

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

// Utilitários para formatação
const capitalizeFirstLetter = (string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function Clients() {
  const dispatch = useDispatch();
  const { list: clients, loading } = useSelector((state) => state.clients);
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();

  // Estados para modais e formulários
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [newClientModalVisible, setNewClientModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form] = Form.useForm();
  const [newClientForm] = Form.useForm();

  // Manipuladores de ações
  const handleAddClient = (values) => {
    const newClient = {
      id: Date.now().toString(),
      ...values,
    };

    dispatch(addClient(newClient));
    setNewClientModalVisible(false);
    newClientForm.resetFields();
    notification.success({
      message: "Cliente cadastrado com sucesso!",
      description: "O cliente foi salvo com sucesso.",
    });
  };

  const handleEditClient = (values) => {
    if (editingClient) {
      dispatch(updateClient({ id: editingClient.id, data: values }));
      setDrawerVisible(false);
      setEditingClient(null);
      form.resetFields();
      notification.success({
        message: "Cliente atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
    }
  };

  const handleDeleteClient = () => {
    if (clientToDelete) {
      dispatch(removeClient(clientToDelete.id));
      setDeleteModalVisible(false);
      setClientToDelete(null);
      notification.success({
        message: "Cliente excluído com sucesso!",
        description: "O cliente foi removido da lista.",
      });
    }
  };

  // Abrir modais/drawers
  const openEditDrawer = (client) => {
    setEditingClient(client);
    form.setFieldsValue(client);
    setDrawerVisible(true);
  };

  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setDeleteModalVisible(true);
  };

  const openNewClientModal = () => {
    setNewClientModalVisible(true);
  };

  // Fechar todos os modais e resetar forms
  const handleCancel = () => {
    setDrawerVisible(false);
    setNewClientModalVisible(false);
    setDeleteModalVisible(false);
    setEditingClient(null);
    setClientToDelete(null);
    form.resetFields();
    newClientForm.resetFields();
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      title: "Name",
      key: "name",
      sorter: (a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      render: (_, record) => (
        <div className="font-semibold text-sm sm:text-base">
          {capitalizeFirstLetter(record.firstName)}{" "}
          {capitalizeFirstLetter(record.lastName)}
        </div>
      ),
      fixed: screens.xs ? "left" : false,
      width: screens.xs ? 120 : "auto",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Space size="small">
          <MailOutlined
            style={{ color: "#1890ff", fontSize: screens.xs ? "12px" : "14px" }}
          />
          <Text className="text-xs sm:text-sm">
            {screens.xs ? email.split("@")[0] + "..." : email.toLowerCase()}
          </Text>
        </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "Created at",
      dataIndex: "contactAt",
      key: "contactAt",
      sorter: (a, b) => new Date(a.contactAt) - new Date(b.contactAt),
      render: (date) => (
        <Text className="text-xs sm:text-sm">{formatDate(date)}</Text>
      ),
      responsive: ["lg"],
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Text className="text-xs sm:text-sm" ellipsis={{ tooltip: address }}>
          {screens.xs && address?.length > 15
            ? address.substring(0, 15) + "..."
            : address}
        </Text>
      ),
      responsive: ["xl"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <Text className="text-xs sm:text-sm">{phone}</Text>,
      responsive: ["xl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <Tag
          color={status === "activated" ? "green" : "red"}
          style={{
            borderRadius: "12px",
            padding: screens.xs ? "1px 6px" : "2px 8px",
            fontWeight: "500",
            fontSize: screens.xs ? "10px" : "12px",
          }}
        >
          {screens.xs
            ? status === "activated"
              ? "ACT"
              : "DEACT"
            : status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: screens.xs ? "" : "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit client">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditDrawer(record)}
              style={{
                color: "#1890ff",
                fontSize: screens.xs ? "12px" : "14px",
              }}
              size={screens.xs ? "small" : "middle"}
            />
          </Tooltip>
          <Tooltip title="Delete client">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(record)}
              style={{
                color: "#ff4d4f",
                fontSize: screens.xs ? "12px" : "14px",
              }}
              size={screens.xs ? "small" : "middle"}
            />
          </Tooltip>
        </Space>
      ),
      fixed: screens.xs ? "right" : false,
      width: screens.xs ? 80 : "auto",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Controller />

      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          {/* Cabeçalho com título e botão de ação */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 sm:mb-6">
            <Title
              level={screens.xs ? 3 : 2}
              className={`m-0 text-center lg:text-left ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {screens.xs ? "Clients" : "A List of Clients"}
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openNewClientModal}
              className="w-full lg:w-auto"
              size={screens.xs ? "middle" : "large"}
            >
              {screens.xs ? "New" : "New Client"}
            </Button>
          </div>

          {/* Tabela de clientes */}
          <div className="overflow-x-auto">
            <Table
              dataSource={clients}
              columns={columns}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                size: screens.xs ? "small" : "default",
                showSizeChanger: !screens.xs,
                showQuickJumper: !screens.xs,
              }}
              scroll={{
                x: screens.xs ? 600 : 1200,
                y: screens.md ? 500 : undefined,
              }}
              size={screens.xs ? "small" : "middle"}
              className={isDarkMode ? "dark-table" : ""}
              sticky={screens.xs}
            />
          </div>
        </Card>
      </div>

      {/* Drawer para edição de cliente */}
      <Drawer
        title="Edit Client"
        placement="right"
        onClose={handleCancel}
        open={drawerVisible}
        width={screens.xs ? "100%" : 400}
        extra={
          screens.xs && (
            <Button type="text" onClick={handleCancel}>
              Close
            </Button>
          )
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditClient}
          className="px-3 sm:px-4"
          size={screens.xs ? "middle" : "large"}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="activated">Activated</Option>
              <Option value="deactivated">Deactivated</Option>
            </Select>
          </Form.Item>
          <div className={`flex gap-2 ${screens.xs ? "flex-col" : ""}`}>
            <Button type="primary" htmlType="submit" block={screens.xs}>
              Save Changes
            </Button>
            <Button onClick={handleCancel} block={screens.xs}>
              Cancel
            </Button>
          </div>
        </Form>
      </Drawer>

      {/* Modal para novo cliente */}
      <Modal
        title="New Client"
        open={newClientModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={screens.xs ? "95%" : 500}
      >
        <Form
          form={newClientForm}
          layout="vertical"
          onFinish={handleAddClient}
          size={screens.xs ? "middle" : "large"}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="activated">Activated</Option>
              <Option value="deactivated">Deactivated</Option>
            </Select>
          </Form.Item>
          <div className={`flex gap-2 ${screens.xs ? "flex-col" : ""}`}>
            <Button type="primary" htmlType="submit" block={screens.xs}>
              Save Client
            </Button>
            <Button onClick={handleCancel} block={screens.xs}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteClient}
        onCancel={handleCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okType="danger"
        width={screens.xs ? "90%" : 520}
      >
        <p>Are you sure you want to delete this client?</p>
        {clientToDelete && (
          <p className="font-semibold mt-2">
            {capitalizeFirstLetter(clientToDelete.firstName)}{" "}
            {capitalizeFirstLetter(clientToDelete.lastName)}
          </p>
        )}
        <p className="text-red-500">This action cannot be undone.</p>
      </Modal>

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
    </div>
  );
}

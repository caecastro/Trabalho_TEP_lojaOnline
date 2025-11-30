// src/pages/Clients.jsx
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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Controller from "../components/views/Controller.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import {
  setClients,
  addClient,
  updateClient,
  removeClient,
  setLoading,
} from "../store/slices/clientSlice.js"; // ✅ corrigido para singular

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const capitalizeFirstLetter = (string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function Clients() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.clients); // ✅ usa list do slice

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [newClientModalVisible, setNewClientModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form] = Form.useForm();
  const { isDarkMode } = useTheme();

  const mockClients = [
    {
      id: "1",
      firstName: "Leanne",
      lastName: "Graham",
      email: "Sincere@april.biz",
      contactAt: "2018-02-05",
      address: "New street, 2505 - Chicago",
      phone: "1-555-264-2033",
      status: "activated",
    },
  ];

  useEffect(() => {
    dispatch(setLoading(true));
    try {
      const savedClients = localStorage.getItem("clients");
      if (savedClients) {
        dispatch(setClients(JSON.parse(savedClients)));
      } else {
        dispatch(setClients(mockClients));
        localStorage.setItem("clients", JSON.stringify(mockClients));
      }
    } catch (error) {
      notification.error({
        message: "Erro ao carregar clientes",
        description: "Não foi possível carregar os dados dos clientes.",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(list));
  }, [list]);

  const handleAddClient = (values) => {
    const newClient = {
      id: Date.now().toString(),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      contactAt: new Date().toISOString().split("T")[0],
      address: values.address,
      phone: values.phone,
      status: values.status,
    };
    dispatch(addClient(newClient));
    setNewClientModalVisible(false);
    form.resetFields();
    notification.success({ message: "Cliente cadastrado" });
  };

  const handleEditClient = (values) => {
    const updatedClient = { ...editingClient, ...values };
    dispatch(updateClient({ id: updatedClient.id, data: updatedClient }));
    setDrawerVisible(false);
    setEditingClient(null);
    form.resetFields();
    notification.success({ message: "Cliente atualizado" });
  };

  const handleDeleteClient = () => {
    dispatch(removeClient(clientToDelete.id));
    setDeleteModalVisible(false);
    setClientToDelete(null);
    notification.success({ message: "Cliente excluído" });
  };

  const openEditDrawer = (client) => {
    setEditingClient(client);
    form.setFieldsValue(client);
    setDrawerVisible(true);
  };

  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setDrawerVisible(false);
    setNewClientModalVisible(false);
    setDeleteModalVisible(false);
    setEditingClient(null);
    setClientToDelete(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      render: (_, record) => (
        <div className="font-semibold">
          {capitalizeFirstLetter(record.firstName)}{" "}
          {capitalizeFirstLetter(record.lastName)}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: "#1890ff" }} />
          <Text>{email.toLowerCase()}</Text>
        </Space>
      ),
    },
    {
      title: "Created at",
      dataIndex: "contactAt",
      key: "contactAt",
      sorter: (a, b) => new Date(a.contactAt) - new Date(b.contactAt),
      render: (date) => formatDate(date),
    },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
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
            padding: "2px 8px",
            fontWeight: "500",
          }}
        >
          {status === "activated" ? "ACTIVATED" : "DEACTIVATED"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit client">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openEditDrawer(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete client">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(record)}
              style={{ color: "#ff4d4f" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Controller />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <Title
              level={2}
              className={isDarkMode ? "text-white" : "text-gray-900"}
            >
              A List of Clients
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewClientModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              New Client
            </Button>
          </div>
          <Table
            dataSource={list} // ✅ usa list do slice
            columns={columns}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>
      {/* Aqui você adiciona Drawer e Modals conforme já tinha implementado */}
    </div>
  );
}

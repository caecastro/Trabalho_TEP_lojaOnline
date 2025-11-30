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
} from "../store/slices/clientSlice.js";

const { Title, Text } = Typography;
const { Option } = Select;

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
  const { list: clients, loading } = useSelector((state) => state.clients);
  const { isDarkMode } = useTheme();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [newClientModalVisible, setNewClientModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [form] = Form.useForm();
  const [newClientForm] = Form.useForm();

  const handleAddClient = (values) => {
    const newClient = {
      id: Date.now().toString(),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      address: values.address,
      phone: values.phone,
      status: values.status,
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

  const handleCancel = () => {
    setDrawerVisible(false);
    setNewClientModalVisible(false);
    setDeleteModalVisible(false);
    setEditingClient(null);
    setClientToDelete(null);
    form.resetFields();
    newClientForm.resetFields();
  };

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
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
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
        <Card
          className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}
          styles={{
            body: {
              padding: "24px",
            },
          }}
        >
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
              onClick={openNewClientModal}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              New Client
            </Button>
          </div>
          <Table
            dataSource={clients}
            columns={columns}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
            className={isDarkMode ? "dark-table" : ""}
          />
        </Card>
      </div>

      {/* Drawer de Edição - CORRIGIDO */}
      <Drawer
        title="Edit Client"
        placement="right"
        onClose={handleCancel}
        open={drawerVisible}
        styles={{
          body: {
            padding: "20px 0",
          },
          wrapper: {
            width: "400px !important",
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditClient}
          className="px-4"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select size="large">
              <Option value="activated">Activated</Option>
              <Option value="deactivated">Deactivated</Option>
            </Select>
          </Form.Item>
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
            <Button onClick={handleCancel} block>
              Cancel
            </Button>
          </div>
        </Form>
      </Drawer>

      {/* Modal Novo Cliente */}
      <Modal
        title="New Client"
        open={newClientModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
        maskClosable={false}
        keyboard={false}
      >
        <Form form={newClientForm} layout="vertical" onFinish={handleAddClient}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select size="large">
              <Option value="activated">Activated</Option>
              <Option value="deactivated">Deactivated</Option>
            </Select>
          </Form.Item>
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit" block>
              Save Client
            </Button>
            <Button onClick={handleCancel} block>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal Confirmação Exclusão */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteClient}
        onCancel={handleCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okType="danger"
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

      <footer
        className={`w-full text-center py-6 border-t ${
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

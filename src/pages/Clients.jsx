import { useState, useEffect } from "react";
import { Table, Tag, Typography, Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Controller from "../components/views/Controller";
import { useTheme } from "../contexts/ThemeContext";

const { Title, Text } = Typography;

// Dados DIRETO no arquivo
const clientsData = [
  {
    id: "1",
    firstName: "Leanne",
    lastName: "Graham",
    email: "Sincere@april.biz",
    contactAt: "2023-10-15",
    address: "New street, 2505 - Chicago",
    phone: "1-555-264-2033",
    status: "activated",
  },
  {
    id: "2",
    firstName: "Ervin",
    lastName: "Howell",
    email: "Shanna@melissa.tv",
    contactAt: "2024-01-22",
    address: "Victor Plains, 869 - Wisokyburgh",
    phone: "010-692-6593 x09125",
    status: "deactivated",
  },
  {
    id: "3",
    firstName: "Clementine",
    lastName: "Bauch",
    email: "Nathan@yesenia.net",
    contactAt: "2024-02-10",
    address: "Douglas Extension, 847 - McKenziehaven",
    phone: "1-463-123-4447",
    status: "activated",
  },
];

export default function Clients() {
  const { isDarkMode } = useTheme();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Simula carregamento
    setTimeout(() => {
      setClients(clientsData);
    }, 300);
  }, []);

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Text strong>
          {record.firstName} {record.lastName}
        </Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created at",
      dataIndex: "contactAt",
      key: "contactAt",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
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
      render: (status) => (
        <Tag color={status === "activated" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
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

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <div className="flex justify-between items-center mb-6">
            <Title
              level={2}
              className={isDarkMode ? "text-white" : "text-gray-900"}
            >
              A List of Clients
            </Title>
            <Button type="primary" icon={<PlusOutlined />}>
              New Client
            </Button>
          </div>

          <Table
            dataSource={clients}
            columns={columns}
            loading={clients.length === 0}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
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
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Modal,
  List,
  Avatar,
  Button,
  Tag,
  Typography,
  Empty,
  Input,
} from "antd";
import { UserOutlined, SearchOutlined, LoginOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Search } = Input;

export default function ClientSelector({ visible, onClose, onSelectClient }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Dados dos clientes (substitua pela sua API quando tiver)
  const fetchClients = async () => {
    setLoading(true);
    // Simula chamada à API
    setTimeout(() => {
      const mockClients = [
        {
          id: "1",
          firstName: "Leanne",
          lastName: "Graham",
          email: "Sincere@april.biz",
          phone: "1-770-736-8031 x56442",
          status: "activated",
          role: "Admin",
        },
        {
          id: "2",
          firstName: "Ervin",
          lastName: "Howell",
          email: "Shanna@melissa.tv",
          phone: "010-692-6593 x09125",
          status: "activated",
          role: "Manager",
        },
        {
          id: "3",
          firstName: "Clementine",
          lastName: "Bauch",
          email: "Nathan@yesenia.net",
          phone: "1-463-123-4447",
          status: "deactivated",
          role: "User",
        },
      ];
      setClients(mockClients);
      setFilteredClients(mockClients);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (visible) {
      fetchClients();
    }
  }, [visible]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(
        (client) =>
          `${client.firstName} ${client.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const handleSelectClient = (client) => {
    onSelectClient({
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      role: client.role || "Client",
      isClient: true,
    });
    onClose();
  };

  const getAvatarColor = (id) => {
    const colors = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1"];
    return colors[id % colors.length];
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>Select Client to Login</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <div className="space-y-4">
        <Search
          placeholder="Search clients by name or email..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          size="large"
        />

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <Text type="secondary" className="mt-2 block">
              Loading clients...
            </Text>
          </div>
        ) : filteredClients.length === 0 ? (
          <Empty
            description={
              searchTerm
                ? "No clients found for your search"
                : "No clients available"
            }
          />
        ) : (
          <List
            dataSource={filteredClients}
            renderItem={(client) => (
              <List.Item
                className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition p-2"
                actions={[
                  <Button
                    key="login"
                    type="link"
                    icon={<LoginOutlined />}
                    onClick={() => handleSelectClient(client)}
                  >
                    Login
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size="large"
                      style={{
                        backgroundColor: getAvatarColor(client.id),
                      }}
                    >
                      {client.firstName.charAt(0)}
                      {client.lastName.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <Text strong>
                        {client.firstName} {client.lastName}
                      </Text>
                      <Tag
                        color={client.status === "activated" ? "green" : "red"}
                      >
                        {client.status}
                      </Tag>
                      {client.role && (
                        <Tag color={client.role === "Admin" ? "red" : "blue"}>
                          {client.role}
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <Text type="secondary" className="block">
                        {client.email}
                      </Text>
                      <Text type="secondary" className="block text-sm">
                        {client.phone}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}

        <div className="text-center text-sm text-gray-500">
          <Text type="secondary">
            Showing {filteredClients.length} of {clients.length} clients
          </Text>
        </div>
      </div>
    </Modal>
  );
}

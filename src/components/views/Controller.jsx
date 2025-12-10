import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  Switch,
  Badge,
  Space,
  Dropdown,
  Grid,
  Avatar,
  Typography,
  message,
  Image,
} from "antd";
import { useTheme } from "../../contexts/ThemeContext";
import { useCart } from "../../hooks/useCart";
import {
  BulbOutlined,
  BulbFilled,
  ShoppingCartOutlined,
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import CartDrawer from "./CartDrawer";
import ClientSelector from "./ClientSelector";

const { useBreakpoint } = Grid;
const { Text } = Typography;

export default function Controller() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const [cartVisible, setCartVisible] = useState(false);
  const [clientSelectorVisible, setClientSelectorVisible] = useState(false);
  const screens = useBreakpoint();

  const handleLogout = () => {
    logout();
    message.success("Logged out successfully!");
  };

  const openClientSelector = () => {
    setClientSelectorVisible(true);
  };

  const handleClientSelected = (clientData) => {
    login(clientData);
    message.success(`Logged in as ${clientData.name}`);
  };

  const getNavButtonStyle = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md transition text-sm sm:text-base ${
      isActive
        ? "bg-blue-600 text-white"
        : isDarkMode
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-200"
    }`;
  };

  const mobileMenuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,
      label: "Products",
      onClick: () => navigate("/products"),
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Clients",
      onClick: () => navigate("/clients"),
    },
    { type: "divider" },
    {
      key: "4",
      icon: isDarkMode ? <BulbFilled /> : <BulbOutlined />,
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      onClick: toggleTheme,
    },
    {
      key: "5",
      icon: <ShoppingCartOutlined />,
      label: `Cart (${getTotalItems()})`,
      onClick: () => setCartVisible(true),
    },
    { type: "divider" },
    ...(user
      ? [
          {
            key: "6",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
            danger: true,
          },
        ]
      : [
          {
            key: "6",
            icon: <UserOutlined />,
            label: "Login",
            onClick: openClientSelector,
          },
        ]),
  ];

  const userMenuItems = user
    ? [
        {
          key: "user-info",
          label: (
            <div className="px-2 py-1 border-b border-gray-200 dark:border-gray-700">
              <Text strong className="text-xs sm:text-sm block">
                {user.name || "Client"}
              </Text>
              <Text type="secondary" className="block text-xs">
                {user.email || "client@example.com"}
              </Text>
            </div>
          ),
          disabled: true,
        },
        { type: "divider" },
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "Profile",
          onClick: () => message.info("Profile feature coming soon!"),
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: handleLogout,
          danger: true,
        },
      ]
    : [
        {
          key: "login",
          icon: <UserOutlined />,
          label: "Login",
          onClick: openClientSelector,
        },
      ];

  const getAbbreviatedName = (name) => {
    if (!name) return "C";
    if (screens.xs)
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    if (screens.sm) {
      const names = name.split(" ");
      return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
    }
    return name[0];
  };

  const getUserAvatar = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "C";
  };

  return (
    <>
      <header
        className={`w-full border-b ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } sticky top-0 z-50`}
      >
        <div
          className={`max-w-7xl mx-auto ${
            screens.xs ? "px-2 py-2" : "px-3 sm:px-4 lg:px-6 py-3 sm:py-4"
          }`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <div
              className="flex items-center gap-1 sm:gap-2 cursor-pointer flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <Image
                src="/logo.png"
                alt="Shop Logo"
                width={screens.xs ? 32 : 40}
                height={screens.xs ? 32 : 40}
                preview={false}
                style={{
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3ELogo%3C/text%3E%3C/svg%3E"
              />

              <span
                className={`font-semibold ${
                  screens.xs ? "text-lg" : "text-xl sm:text-2xl"
                } ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {screens.xs ? "Shop" : "Online Shop"}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
              <Button
                type="text"
                icon={<HomeOutlined />}
                className={getNavButtonStyle("/")}
                onClick={() => navigate("/")}
              >
                Home
              </Button>
              <Button
                type="text"
                icon={<ShoppingOutlined />}
                className={getNavButtonStyle("/products")}
                onClick={() => navigate("/products")}
              >
                Products
              </Button>
              <Button
                type="text"
                icon={<UserOutlined />}
                className={getNavButtonStyle("/clients")}
                onClick={() => navigate("/clients")}
              >
                Clients
              </Button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<BulbFilled className="text-yellow-400" />}
                unCheckedChildren={<BulbOutlined />}
                size={screens.xs ? "small" : "default"}
              />

              <Badge
                count={getTotalItems()}
                size="small"
                offset={screens.xs ? [-2, 2] : [-5, 5]}
                showZero={false}
              >
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => setCartVisible(true)}
                  className={
                    isDarkMode
                      ? "text-white hover:text-gray-300"
                      : "text-gray-700 hover:text-gray-900"
                  }
                  size={screens.xs ? "small" : "middle"}
                >
                  {screens.lg && "Cart"}
                </Button>
              </Badge>

              {screens.lg && !user && (
                <Button
                  type="primary"
                  onClick={openClientSelector}
                  icon={<UserOutlined />}
                  size="middle"
                >
                  Login
                </Button>
              )}

              {screens.lg && user && (
                <Space size="small">
                  <Avatar
                    size="default"
                    style={{
                      backgroundColor: "#1890ff",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {getUserAvatar()}
                  </Avatar>
                  <div>
                    <Text
                      strong
                      className={`block text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {user.name || "Client"}
                    </Text>
                  </div>
                  <Button
                    type="text"
                    onClick={handleLogout}
                    size="middle"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </Button>
                </Space>
              )}

              {/* Menu mobile */}
              <div className="sm:hidden">
                <Dropdown
                  menu={{ items: mobileMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                  arrow
                >
                  <Button
                    type="text"
                    icon={<MenuOutlined />}
                    className={
                      isDarkMode
                        ? "text-white hover:text-gray-300"
                        : "text-gray-700 hover:text-gray-900"
                    }
                    size="small"
                  />
                </Dropdown>
              </div>

              {/* Menu desktop para telas médias */}
              {screens.sm && !screens.lg && (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                  arrow
                >
                  <Button type="text" size="small">
                    {user ? (
                      <Avatar
                        size="small"
                        style={{ backgroundColor: "#1890ff" }}
                      >
                        {getUserAvatar()}
                      </Avatar>
                    ) : (
                      <UserOutlined />
                    )}
                  </Button>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Componente ClientSelector */}
      <ClientSelector
        visible={clientSelectorVisible}
        onClose={() => setClientSelectorVisible(false)}
        onSelectClient={handleClientSelected}
      />

      <CartDrawer visible={cartVisible} onClose={() => setCartVisible(false)} />
    </>
  );
}

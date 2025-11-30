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
  UserSwitchOutlined,
} from "@ant-design/icons";
import CartDrawer from "./CartDrawer";

const { useBreakpoint } = Grid;
const { Text } = Typography;

/**
 * Componente de controle principal - header com navegação e ações
 * Responsivo com diferentes layouts para mobile, tablet e desktop
 */
export default function Controller() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const [cartVisible, setCartVisible] = useState(false);
  const screens = useBreakpoint();

  // Realiza logout e redireciona para home
  const handleLogout = () => {
    logout();
    message.success("Logout realizado com sucesso!");
    navigate("/");
  };

  // Estilo dinâmico para botões de navegação baseado na rota atual
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

  // Menu dropdown para dispositivos móveis
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
            icon: <UserSwitchOutlined />,
            label: "Login",
            onClick: () => navigate("/products"),
          },
        ]),
  ];

  // Menu do usuário para informações e ações
  const userMenuItems = user
    ? [
        {
          key: "user-info",
          label: (
            <div className="px-2 py-1 border-b border-gray-200 dark:border-gray-700">
              <Text strong className="text-xs sm:text-sm block">
                {user.name || "User"}
              </Text>
              <Text type="secondary" className="block text-xs">
                {user.email || "user@example.com"}
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
          icon: <UserSwitchOutlined />,
          label: "Login",
          onClick: () => navigate("/products"),
        },
      ];

  // Formata nome do usuário para diferentes tamanhos de tela
  const getAbbreviatedName = (name) => {
    if (!name) return "User";
    if (screens.xs)
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    if (screens.sm) {
      const names = name.split(" ");
      return names.length > 1 ? `${names[0]} ${names[1][0]}.` : names[0];
    }
    return name;
  };

  // Gera inicial para avatar baseado no nome
  const getUserAvatar = () => user?.name?.charAt(0).toUpperCase() || "U";

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
          {/* Linha principal do header */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo e nome da loja */}
            <div
              className="flex items-center gap-1 sm:gap-2 cursor-pointer flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                alt="Logo"
                className={screens.xs ? "w-6 h-6" : "w-7 h-7 sm:w-8 sm:h-8"}
              />
              <span
                className={`font-semibold ${
                  screens.xs ? "text-lg" : "text-xl sm:text-2xl"
                } ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {screens.xs ? "Shop" : "Online Shop"}
              </span>
            </div>

            {/* Navegação para desktop */}
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

            {/* Navegação para tablet (apenas ícones) */}
            <div className="hidden sm:flex md:hidden items-center gap-1 flex-1 justify-center">
              <Button
                type="text"
                icon={<HomeOutlined />}
                className={getNavButtonStyle("/")}
                onClick={() => navigate("/")}
              />
              <Button
                type="text"
                icon={<ShoppingOutlined />}
                className={getNavButtonStyle("/products")}
                onClick={() => navigate("/products")}
              />
              <Button
                type="text"
                icon={<UserOutlined />}
                className={getNavButtonStyle("/clients")}
                onClick={() => navigate("/clients")}
              />
            </div>

            {/* Área de controles à direita */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Toggle de tema claro/escuro */}
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<BulbFilled className="text-yellow-400" />}
                unCheckedChildren={<BulbOutlined />}
                size={screens.xs ? "small" : "default"}
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              />

              {/* Ícone do carrinho com badge de quantidade */}
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
                  title="Shopping Cart"
                >
                  {screens.lg && "Cart"}
                </Button>
              </Badge>

              {/* Informações do usuário para desktop */}
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
                      {getAbbreviatedName(user.name)}
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

              {/* Usuário logado em tablet */}
              {screens.sm && !screens.lg && user && (
                <Space size="small">
                  <Avatar
                    size="small"
                    style={{ backgroundColor: "#1890ff", fontSize: "12px" }}
                  >
                    {getUserAvatar()}
                  </Avatar>
                  <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    size="small"
                    title="Logout"
                  />
                </Space>
              )}

              {/* Usuário não logado em desktop/tablet */}
              {screens.sm && !user && (
                <Button
                  type="text"
                  size={screens.sm ? "small" : "middle"}
                  onClick={() => navigate("/products")}
                >
                  {screens.lg ? "Login" : <UserSwitchOutlined />}
                </Button>
              )}

              {/* Menu mobile principal */}
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

              {/* Menu do usuário para tablet */}
              {screens.sm && !screens.lg && (
                <div className="md:hidden">
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={["click"]}
                    arrow
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={!user ? <UserSwitchOutlined /> : null}
                    >
                      {user && (
                        <Avatar
                          size="small"
                          style={{ backgroundColor: "#1890ff" }}
                        >
                          {getUserAvatar()}
                        </Avatar>
                      )}
                    </Button>
                  </Dropdown>
                </div>
              )}

              {/* Menu do usuário para desktop compacto */}
              {screens.lg && user && (
                <div className="lg:hidden xl:block">
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={["click"]}
                    arrow
                  >
                    <Button type="text" size="middle">
                      <Avatar
                        size="small"
                        style={{
                          backgroundColor: "#1890ff",
                          marginRight: "8px",
                        }}
                      >
                        {getUserAvatar()}
                      </Avatar>
                      <span className="text-sm">Menu</span>
                    </Button>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>

          {/* Navegação secundária para tablet (labels abaixo) */}
          {screens.sm && !screens.md && (
            <div className="flex justify-center mt-2">
              <Space size="middle">
                <Button
                  type="text"
                  size="small"
                  className={`text-xs ${
                    location.pathname === "/"
                      ? "text-blue-600 font-semibold"
                      : isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
                <Button
                  type="text"
                  size="small"
                  className={`text-xs ${
                    location.pathname === "/products"
                      ? "text-blue-600 font-semibold"
                      : isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => navigate("/products")}
                >
                  Products
                </Button>
                <Button
                  type="text"
                  size="small"
                  className={`text-xs ${
                    location.pathname === "/clients"
                      ? "text-blue-600 font-semibold"
                      : isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => navigate("/clients")}
                >
                  Clients
                </Button>
              </Space>
            </div>
          )}
        </div>
      </header>

      {/* Drawer do carrinho de compras */}
      <CartDrawer visible={cartVisible} onClose={() => setCartVisible(false)} />
    </>
  );
}

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Button, Switch, Badge, Space } from "antd";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useCart } from "../../hooks/useCart.js";
import {
  BulbOutlined,
  BulbFilled,
  ShoppingCartOutlined,
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import CartDrawer from "./CartDrawer.jsx";

export default function Controller() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const [cartVisible, setCartVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavButtonStyle = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-blue-600 text-white"
        : isDarkMode
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-200"
    }`;
  };

  return (
    <>
      <header
        className={`w-full border-b ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center py-4 px-6 gap-4">
          {/* Logo e Navegação */}
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                alt="Logo"
                className="w-8 h-8"
              />
              <span
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Online Shop
              </span>
            </div>

            {/* Menu Mobile */}
            <div className="flex items-center gap-2 sm:hidden">
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<BulbFilled className="text-yellow-400" />}
                unCheckedChildren={<BulbOutlined />}
                size="small"
              />
              <Badge count={getTotalItems()} size="small">
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => setCartVisible(true)}
                  className={isDarkMode ? "text-white" : ""}
                />
              </Badge>
            </div>
          </div>

          {/* Navegação Principal */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
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

          {/* Controles Direita */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="hidden sm:flex items-center gap-4">
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<BulbFilled className="text-yellow-400" />}
                unCheckedChildren={<BulbOutlined />}
              />

              {user ? (
                <Space>
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Welcome, {user.name}
                  </span>
                  <Button type="text" onClick={handleLogout}>
                    Logout
                  </Button>
                </Space>
              ) : (
                <Button type="text">Login</Button>
              )}

              <Badge count={getTotalItems()} size="small">
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => setCartVisible(true)}
                  className={isDarkMode ? "text-white" : ""}
                >
                  Cart
                </Button>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer visible={cartVisible} onClose={() => setCartVisible(false)} />
    </>
  );
}

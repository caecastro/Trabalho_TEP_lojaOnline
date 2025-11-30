// src/components/views/Controller.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx"; // ✅ corrigido
import { Button, Switch, Badge } from "antd";
import { useTheme } from "../../contexts/ThemeContext.jsx"; // ✅ corrigido
import { useCart } from "../../contexts/CartContext.jsx"; // já estava certo
import {
  BulbOutlined,
  BulbFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import CartDrawer from "./CartDrawer.jsx"; // NOVO

export default function Controller() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalItems } = useCart(); // NOVO
  const [cartVisible, setCartVisible] = useState(false); // NOVO

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header
        className={`w-full border-b ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-blue-100 border-gray-300"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center py-4 px-6">
          <div className="flex items-center gap-6">
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
                  isDarkMode ? "text-white" : "text-blue-900"
                }`}
              >
                Online Shop
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className={`hover:text-blue-700 transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/products")}
                className={`hover:text-blue-700 transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => navigate("/clients")}
                className={`hover:text-blue-700 transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Clients
              </button>
            </div>
          </div>

          <div className="flex items-center w-full md:w-1/3 mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Pesquisar"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "border-gray-300"
              }`}
            />
          </div>

          <div className="flex items-center gap-4">
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<BulbFilled className="text-yellow-400" />}
              unCheckedChildren={<BulbOutlined />}
              className={isDarkMode ? "bg-gray-600" : ""}
            />

            {user ? (
              <>
                <span
                  className={isDarkMode ? "text-gray-300" : "text-gray-900"}
                >
                  Welcome, {user.name}
                </span>
                <Button
                  onClick={handleLogout}
                  className={`hover:text-blue-700 transition ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  Logout
                </Button>
              </>
            ) : (
              <button
                className={`hover:text-blue-700 transition ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Login
              </button>
            )}

            {/* NOVO: Botão do Carrinho */}
            <button
              className={`flex items-center gap-2 hover:text-blue-700 transition ${
                isDarkMode ? "text-gray-300" : "text-gray-900"
              }`}
              onClick={() => setCartVisible(true)}
            >
              <Badge
                count={getTotalItems()}
                size="small"
                style={{ backgroundColor: "#1890ff" }}
              >
                <ShoppingCartOutlined style={{ fontSize: "18px" }} />
              </Badge>
              <span>Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* NOVO: Drawer do Carrinho */}
      <CartDrawer visible={cartVisible} onClose={() => setCartVisible(false)} />
    </>
  );
}

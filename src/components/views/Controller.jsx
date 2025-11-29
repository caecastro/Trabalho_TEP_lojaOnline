import { useNavigate } from "react-router-dom";

export default function Controller() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-blue-100 border-b border-gray-300">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center py-4 px-6">
        {/* Logo e botões de navegação */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold text-blue-900">
              Online Shop
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-900 hover:text-blue-700 transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/products")}
              className="text-gray-900 hover:text-blue-700 transition"
            >
              Products
            </button>
            <button
              onClick={() => navigate("/clients")}
              className="text-gray-900 hover:text-blue-700 transition"
            >
              Clients
            </button>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="flex items-center w-full md:w-1/3 mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        {/* Botões */}
        <div className="flex items-center gap-4">
          <button className="text-gray-900 hover:text-blue-700 transition">
            Login
          </button>
          <button className="flex items-center gap-1 text-gray-900 hover:text-blue-700 transition">
            <span>Cart</span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/126/126083.png"
              className="w-5 h-5"
              alt="cart"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

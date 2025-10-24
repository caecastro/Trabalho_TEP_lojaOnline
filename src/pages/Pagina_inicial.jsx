import { useState, useEffect } from "react";

const PaginaInicial = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products?limit=5"
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-blue-500 text-white">
      {/* Header */}
      <header className="px-10 py-5">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold m-0">Welcome to the Shop</h1>
          <nav className="flex gap-8">
            <span className="cursor-pointer">Logout</span>
            <span className="cursor-pointer">Categories</span>
            <span className="cursor-pointer">Wishlist</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-10">
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            TOP 5 PRODUCTS
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-52">
              <div>Carregando...</div>
            </div>
          ) : (
            <table className="w-full max-w-4xl mx-auto bg-blue-400 rounded-lg">
              <thead>
                <tr className="border-b border-blue-300">
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Rating</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-blue-300 hover:bg-blue-600"
                  >
                    <td className="p-4">{product.title}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">{product.rating?.rate} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="px-10 py-8 mt-12">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <p className="m-0">©2023 Online Shop Company</p>
          <div className="flex gap-6">
            <span className="cursor-pointer">Home</span>
            <span className="cursor-pointer">Products</span>
            <span className="cursor-pointer">About</span>
            <span className="cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaginaInicial;

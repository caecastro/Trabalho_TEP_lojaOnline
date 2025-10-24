import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Pagina_inicial() {
  const navigate = useNavigate();

  const produtos = [
    { id: 1, nome: "Camisa React", preco: "R$ 79,90" },
    { id: 2, nome: "Caneca Azul", preco: "R$ 39,90" },
    { id: 3, nome: "Boné Developer", preco: "R$ 59,90" },
    { id: 4, nome: "Adesivo", preco: "R$ 9,90" },
    { id: 5, nome: "Camiseta Preta", preco: "R$ 69,90" },
  ];

  return (
    <div className="page-root">
      {/* Header */}
      <header className="top-header">
        <div className="brand">
          <img src="/src/assets/react.svg" alt="logo" className="logo" />
          <h1 className="brand-title">React Store</h1>
        </div>

        <div className="header-actions">
          <button className="btn ghost" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
          <button className="btn primary" onClick={() => navigate("/")}>
            Sair
          </button>
        </div>
      </header>

      <div className="separator" />

      {/* Produtos em grid */}
      <main className="products-container">
        {produtos.map((p) => (
          <article
            key={p.id}
            className="product-card"
            onClick={() => alert(`Abrir produto ${p.nome} (somente visual)`)}
          >
            <div className="thumb">Imagem</div>
            <div className="card-body">
              <h3 className="product-title">{p.nome}</h3>
              <p className="product-price">{p.preco}</p>
            </div>
          </article>
        ))}
      </main>

      {/* Footer */}
      <footer className="bottom-footer">© 2025 React Store</footer>
    </div>
  );
}

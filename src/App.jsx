import { Layout, Typography, theme } from "antd";
import Controller from "./components/views/Controller";
import Produtos from "./components/assets/Produtos";

const { Content, Footer } = Layout;
const { Title } = Typography;

export default function App() {
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Controller />
      {/* O Controller já tem o logo, então NÃO precisa de logo aqui no App */}

      <Content
        style={{
          padding: token.paddingLG,
          backgroundColor: token.colorBgContainer,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: token.marginXXL,
            maxWidth: 800,
            width: "100%",
          }}
        >
          <Title
            level={1}
            style={{
              color: token.colorTextHeading,
              marginBottom: token.marginSM,
            }}
          >
            Welcome to the Shop
          </Title>
          <Title
            level={2}
            type="secondary"
            style={{
              color: token.colorTextSecondary,
              marginBottom: token.marginXXL,
            }}
          >
            Top 5 Products
          </Title>
        </div>

        <div style={{ width: "100%", maxWidth: 1200 }}>
          <Produtos />
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          borderTop: `1px solid ${token.colorBorder}`,
          color: token.colorTextSecondary,
          padding: `${token.paddingLG}px 0`,
        }}
      >
        IFSC ©2025 Created by Lidiane Visintin
      </Footer>
    </Layout>
  );
}

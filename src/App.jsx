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

      <Content
        style={{
          padding: `${token.paddingLG}px ${token.paddingLG}px 0`,
          backgroundColor: token.colorBgContainer,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: token.marginLG,
            maxWidth: 800,
            width: "100%",
            paddingTop: token.paddingXL,
          }}
        >
          <Title
            level={1}
            style={{
              color: token.colorTextHeading,
              marginBottom: token.marginSM,
              fontWeight: 400,
              fontSize: "2.5rem",
              letterSpacing: "0.5px",
            }}
          >
            Welcome to the Shop
          </Title>
          <Title
            level={2}
            style={{
              color: token.colorTextSecondary,
              fontWeight: 300,
              fontSize: "1.5rem",
              margin: 0,
            }}
          >
            Top 5 Products
          </Title>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 900,
            marginBottom: token.marginXXL,
          }}
        >
          <Produtos />
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          borderTop: `1px solid ${token.colorBorder}`,
          color: token.colorTextSecondary,
          padding: `${token.paddingLG}px 0`,
          fontSize: "0.875rem",
          backgroundColor: token.colorBgLayout,
        }}
      >
        IFSC 2025 | Created by Lidiane Visintin
      </Footer>
    </Layout>
  );
}

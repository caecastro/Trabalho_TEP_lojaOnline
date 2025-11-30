import { Modal, Form, Input, InputNumber, Select } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { TextArea } = Input;

/**
 * Modal para adição de novos produtos
 * Formulário com validação para criar produtos customizados
 */
export default function AddProductModal({ visible, onCancel, onAddProduct }) {
  const [form] = Form.useForm();

  // Submete dados do formulário para criação do produto
  const handleSubmit = async (values) => {
    try {
      const productData = {
        title: values.title,
        price: values.price,
        image: values.image,
        description: values.description,
        category: values.category,
      };

      await onAddProduct(productData);
      form.resetFields();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  };

  // Fecha modal e limpa formulário
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="New Product"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Save"
      cancelText="Cancel"
      okButtonProps={{ className: "bg-blue-600 hover:bg-blue-700 border-0" }}
      maskClosable={false}
      keyboard={false}
      width={600}
      afterClose={() => form.resetFields()} // Garante reset após fechar completamente
    >
      {/* Formulário de criação de produto */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="mt-4"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter product title" }]}
        >
          <Input placeholder="Enter product title" size="large" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={3} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select placeholder="Select category" size="large">
            <Option value="electronics">Electronics</Option>
            <Option value="jewelery">Jewelery</Option>
            <Option value="men's clothing">Men Clothing</Option>
            <Option value="women's clothing">Women Clothing</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            placeholder="0.00"
            size="large"
            style={{ width: "100%" }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Image URL"
          name="image"
          rules={[{ required: true, message: "Please enter image URL" }]}
        >
          <Input placeholder="Enter image URL" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

// Validação de props para melhor debugging
AddProductModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

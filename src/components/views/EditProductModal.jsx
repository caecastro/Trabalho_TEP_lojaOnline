import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { TextArea } = Input;

/**
 * Modal para edição de produtos existentes
 * Preenche automaticamente os campos com dados do produto
 */
export default function EditProductModal({
  visible,
  onCancel,
  onEditProduct,
  product,
}) {
  const [form] = Form.useForm();

  // Preenche formulário quando produto ou visibilidade mudam
  useEffect(() => {
    if (product && visible) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        image: product.image,
      });
    }
  }, [product, visible, form]);

  // Submete dados do formulário para edição
  const handleSubmit = async (values) => {
    try {
      const productData = {
        title: values.title,
        price: values.price,
        image: values.image,
        description: values.description,
        category: values.category,
      };

      await onEditProduct(product.id, productData);
      form.resetFields();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      throw error;
    }
  };

  // Fecha modal e reseta formulário
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Product"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Save Changes"
      cancelText="Cancel"
      okButtonProps={{ className: "bg-blue-600 hover:bg-blue-700 border-0" }}
      maskClosable={false}
      keyboard={false}
      width={600}
      afterClose={() => form.resetFields()} // Garante reset após fechar
    >
      {/* Formulário de edição de produto */}
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
EditProductModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEditProduct: PropTypes.func.isRequired,
  product: PropTypes.object,
};

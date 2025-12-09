import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Alert,
} from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export default function EditProductModal({
  visible,
  onCancel,
  onEditProduct,
  product,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product && visible) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        category: product.category || "electronics",
        price: product.price,
        image: product.image,
      });
    }
  }, [product, visible, form]);

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

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div>
          <div>Edit Product</div>
          {product?.isEditedApiProduct && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              (Esta edição substituirá o produto original)
            </Text>
          )}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Save Changes"
      cancelText="Cancel"
      maskClosable={false}
      keyboard={false}
      width={600}
      afterClose={() => form.resetFields()}
    >
      {product?.isEditedApiProduct && (
        <Alert
          message="Produto da API"
          description="As alterações serão salvas e o produto original será substituído."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

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
            <Option value="men's clothing">Men's Clothing</Option>
            <Option value="women's clothing">Women's Clothing</Option>
            <Option value="other">Other</Option>
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

EditProductModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEditProduct: PropTypes.func.isRequired,
  product: PropTypes.object,
};

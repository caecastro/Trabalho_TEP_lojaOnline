import { Modal, Form, Input, InputNumber, Select } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { TextArea } = Input;

export default function AddProductModal({ visible, onCancel, onAddProduct }) {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await onAddProduct(values);
      form.resetFields();
    } catch (error) {
      throw error;
    }
  };

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
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
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

AddProductModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

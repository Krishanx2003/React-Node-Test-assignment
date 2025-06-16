import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients');
      setClients(response.data);
    } catch (error) {
      message.error('Failed to fetch clients');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/clients', values);
      message.success('Client added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchClients();
    } catch (error) {
      message.error('Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const validateField = (field, value) => {
    let error = false;
    let message = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          error = true;
          message = "Name is required";
        }
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = true;
          message = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value) {
          error = true;
          message = "Phone number is required";
        } else if (!/^\d{10,11}$/.test(value)) {
          error = true;
          message = "Please enter a valid phone number (10-11 digits)";
        }
        break;
      case "address":
        if (!value.trim()) {
          error = true;
          message = "Address is required";
        }
        break;
    }
    return { error, message };
  };

  const initialValidationState = {
    firstName: { error: false, message: "" },
    lastName: { error: false, message: "" },
    username: { error: false, message: "" },
    password: { error: false, message: "" },
    phone: { error: false, message: "" },
    email: { error: false, message: "" },
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add New Client
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={clients}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title="Add New Client"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddClient}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter client name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Client
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientList; 
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';

import './index.css';

import { adminUpload, adminUpdate } from '../../../../service';

interface MovieModalProps {
  visible: boolean;
  type: 'new' | 'edit';
  onHide: () => void;
  editingID?: number;
  initialData?: any;
}

export default function MovieModal(props: MovieModalProps) {
  const [form] = Form.useForm();

  const [file, setFile] = useState<File>();
  const fileChangeHandler = (e: any) => {
    setFile(e.target.files[0]);
  };

  const onOk = (value: any) => {
    form.validateFields().then((res) => {
      if (file) {
        res.file = file;
      } else {
        delete res.file;
      }
      res.genre_list = res.genre_list.join('/');
      if (props.type === 'new') {
        adminUpload(res).then((res) => {
          form.resetFields();
          props.onHide();
        });
      } else {
        res.id = props.editingID;
        adminUpdate(res).then((res) => {
          form.resetFields();
          props.onHide();
        });
      }
    });
  };
  const onCancel = () => {
    form.resetFields();
    props.onHide();
  };

  useEffect(() => {
    form.setFieldsValue(props.initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialData]);

  return (
    <Modal
      title={props.type === 'new' ? 'New movie' : 'Edit Movie'}
      visible={props.visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="Movie name"
          name="movie_name"
          rules={[{ required: true, message: 'Please input movie name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Director"
          name="director"
          rules={[{ required: true, message: 'Please input director!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Genre list"
          name="genre_list"
          rules={[{ required: true, message: 'Please select genre list!' }]}
        >
          <Select mode="multiple">
            <Select.Option value="COMEDY">Comedy</Select.Option>
            <Select.Option value="HORROR">Horror</Select.Option>
            <Select.Option value="ROMANCE">Romance</Select.Option>
            <Select.Option value="SCI-FI">Sci-Fi</Select.Option>
            <Select.Option value="DOCUMENTARY">Documentary</Select.Option>
            <Select.Option value="DRAMA">Drama</Select.Option>
            <Select.Option value="ACTION">Action</Select.Option>
            <Select.Option value="THRILLER">Thriller</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: 'Please input country!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Synopsis"
          name="synopsis"
          rules={[{ required: true, message: 'Please input synopsis!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Production year"
          name="production_year"
          rules={[{ required: true, message: 'Please input production year!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Studio"
          name="studio"
          rules={[{ required: true, message: 'Please input studio!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Cast list"
          name="cast_list"
          rules={[{ required: true, message: 'Please input cast list!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Picture" name="file">
          <Input onChange={fileChangeHandler} type="file" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

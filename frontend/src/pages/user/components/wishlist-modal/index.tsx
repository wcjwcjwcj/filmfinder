import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

import {
  userSearch,
  userCreateWishtlist,
  userUpdateWishtlist,
} from '../../../../service';

interface WishlistModalProps {
  visible: boolean;
  type: 'new' | 'edit';
  onHide: () => void;
  editingID?: number;
  initialData?: any;
}

export default function WishlistModal(props: WishlistModalProps) {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((res) => {
      if (props.type === 'new') {
        userCreateWishtlist({
          wishlist_name: res.wishlist_name,
          public_or_not: res.public_or_not ? 'Y' : 'N',
          movie_list: res.movie_list?.join(',') || '',
          user_to_share: res.user_to_share?.join(',') || '',
        }).then((res) => {
          if (res.data.code === 0) {
            onCancel();
          }
        });
      } else {
        userUpdateWishtlist({
          wishlist_id: props.editingID!,
          wishlist_name: res.wishlist_name,
          public_or_not: res.public_or_not ? 'Y' : 'N',
          movie_list: res.movie_list.join(','),
          user_to_share: res.user_to_share.join(','),
        }).then((res) => {
          if (res.data.code === 0) {
            onCancel();
          }
        });
      }
    });
  };
  const onCancel = () => {
    form.resetFields();
    props.onHide();
  };

  const [movieList, setMovieList] = useState<any[]>([]);
  useEffect(() => {
    userSearch('', true).then((res) => {
      setMovieList(res.data.movie_list);
    });
  }, []);

  useEffect(() => {
    if (props.type === 'edit') {
      form.setFieldsValue({
        wishlist_name: props.initialData.wishlist_name,
        public_or_not: props.initialData.public === 'Y',
        movie_list: props.initialData.movie_list
          .split(',')
          .map((id: string) => Number(id)),
        user_to_share: props.initialData.share_list
          .split(',')
          .filter((item: string) => item !== ''),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialData]);

  return (
    <Modal
      title={props.type === 'new' ? 'New Wishlist' : 'Edit Wishlist'}
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
          label="Wishlist name"
          name="wishlist_name"
          rules={[{ required: true, message: 'Please input wishlist name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Movie list"
          name="movie_list"
          rules={[{ required: true, message: 'Please select movie list!' }]}
        >
          <Select mode="multiple">
            {movieList.map((item) => {
              return (
                <Select.Option key={item.movie_id} value={item.movie_id}>
                  {item.movie_name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          valuePropName="checked"
          label="Public or not"
          name="public_or_not"
        >
          <Switch
            disabled={props.type === 'edit' && !props.initialData?.can_delete}
            checkedChildren="Public"
            unCheckedChildren="Private"
          />
        </Form.Item>
        <Form.Item label="Share list" name="user_to_share">
          <Select
            disabled={props.type === 'edit' && !props.initialData?.can_delete}
            mode="tags"
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

'use client';
import AppLayout from "@/components/custom/AppLayout/AppLayout";
import { StandardText } from "@/components/custom/StandardText/StandardText";
import { useSendUserFeedbackMutation } from "@/store/apis/userApi";
import { MailOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Flex, Form, Input, message, Select } from "antd";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";

const ShareFeedbackPage = () => {
  const [sendFeedback, { isLoading, isSuccess }] = useSendUserFeedbackMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Feedback successfully submitted',
    });
  };

  const onFormSubmit = (data: FieldValues) => {
    sendFeedback({
      feedback_type: data.feedback_type,
      message: data.message,
      name: data.name,
      email: data.email
    });
  }

  useEffect(() => {
    if (!isLoading && isSuccess) {
      success();
    }
  }, [isLoading])
  
  return (
    <AppLayout>
      {contextHolder}
      <div style={{ alignSelf: 'center', marginTop: 20}}>
      
        <Card
          size="small"
          title="Share your feedback - We'd love to hear your thoughts, questions, or suggestions."
          style={{ width: 1000 }}
          headStyle={{
            backgroundColor: '#1890ff',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
            
            <Form
              name="layout-multiple-vertical"
              layout="vertical"
              onFinish={onFormSubmit}
            >
              <Form.Item label="Feedback Type" name="feedback_type">
                <Select
                  placeholder="Select a feedback category"
                  onChange={() => {}}
                  options={[
                    { value: 'Bug Report', label: 'Bug Report' },
                    { value: 'Question / Support', label: 'Question / Support' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label={<div>Message <MessageOutlined /></div>}
                name="message"
                rules={[{ required: true }]}
                style={{marginBottom: 40}}
              >
                <Input.TextArea
                  showCount 
                  maxLength={1000} 
                  onChange={() => {}} 
                  placeholder="Add your message here..."
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>
              <Divider />
              <div style={{marginTop: 20, marginBottom: 20}}>
                <StandardText variant="h5">Contact Info</StandardText>
                <StandardText style={{ color: 'grey'}}>(If you would like to be contacted regarding this feedback, please leave your contact info. Our team will get back to you as soon as possible.)</StandardText>
              </div>
              <Flex gap="large">
                <Form.Item
                  layout="horizontal"
                  label="Name"
                  name="name"
                >
                  <Input style={{width: 200}} />
                </Form.Item>
                <Form.Item
                  layout="horizontal"
                  label={<div>Email Address <MailOutlined /></div>}
                  name="email"
                >
                  <Input style={{width: 300}} />
                </Form.Item>
              </Flex>
              
              <div style={{alignSelf: 'center', display: 'flex', justifyContent: 'center'}}>
                <Button type="primary" size="large" htmlType="submit" loading={isLoading}>{isLoading ? 'Submitting' : 'Submit Feedback'}</Button>
              </div>
            </Form>
        </Card>
      </div>
    </AppLayout>
  )
}

export default ShareFeedbackPage;

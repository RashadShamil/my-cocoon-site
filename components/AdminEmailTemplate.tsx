import * as React from 'react';
import { Html, Head, Body, Container, Text, Heading, Hr, Section, Row, Column } from '@react-email/components';

export function AdminEmailTemplate({ customerName, orderNumber, totalAmount, items, email, phone, address, paymentMethod }: any) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', margin: '0', padding: '0' }}>
        <Container style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', margin: '40px auto', padding: '32px', maxWidth: '600px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <Heading style={{ color: '#2563eb', textAlign: 'center', margin: '0 0 24px 0' }}>Cocoon Kids Admin Alert</Heading>
          <Heading as="h2" style={{ color: '#1e3a8a', fontSize: '20px', textAlign: 'center' }}>New Order Received! 🛍️</Heading>
          
          <Text style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px' }}>
            A new order <strong>#{orderNumber}</strong> has just been placed.
          </Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          
          <Heading as="h3" style={{ color: '#3b82f6', fontSize: '16px', margin: '0 0 16px 0' }}>Customer Details</Heading>
          <Text style={{ color: '#374151', fontSize: '14px', lineHeight: '20px', margin: '0 0 16px 0' }}>
            <strong>Name:</strong> {customerName}<br/>
            <strong>Email:</strong> {email}<br/>
            <strong>Phone:</strong> {phone}<br/>
            <strong>Address:</strong> {address}<br/>
            <strong>Payment:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </Text>

          <Heading as="h3" style={{ color: '#3b82f6', fontSize: '16px', margin: '0 0 16px 0' }}>Order Summary</Heading>
          <Section>
            {items?.map((item: any, i: number) => (
              <Row key={i} style={{ marginBottom: '8px' }}>
                <Column style={{ width: '80%', color: '#374151', fontSize: '14px' }}>• {item.productName} (Size: {item.size || 'Std'}) (x{item.quantity})</Column>
                <Column style={{ width: '20%', textAlign: 'right', color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>LKR {item.price}</Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          
          <Row>
            <Column style={{ width: '80%', color: '#1e3a8a', fontSize: '16px', fontWeight: 'bold' }}>Total</Column>
            <Column style={{ width: '20%', textAlign: 'right', color: '#2563eb', fontSize: '16px', fontWeight: 'bold' }}>LKR {totalAmount}</Column>
          </Row>

          <Text style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', marginTop: '48px' }}>
            Action required: Please review and process this order in the Admin Dashboard.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

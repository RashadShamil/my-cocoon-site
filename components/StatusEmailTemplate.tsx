import * as React from 'react';
import { Html, Head, Body, Container, Text, Heading, Hr, Section, Row, Column } from '@react-email/components';

export function StatusEmailTemplate({ customerName, orderNumber, totalAmount, items, status, phone, address }: any) {
  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return "We have received your payment and are processing your order!";
      case 'shipped': return "Great news! Your order has been shipped and is on its way to you.";
      case 'delivered': return "Your order has been delivered! We hope you love your items.";
      case 'cancelled': return "Your order has been cancelled. Please contact us if you have any questions.";
      default: return `Your order status has been updated to: ${status}`;
    }
  };

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#fdf2f8', fontFamily: 'sans-serif', margin: '0', padding: '0' }}>
        <Container style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', borderRadius: '16px', margin: '40px auto', padding: '32px', maxWidth: '600px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <Heading style={{ color: '#db2777', textAlign: 'center', margin: '0 0 24px 0' }}>🎀 Cocoon Kids 🎀</Heading>
          <Heading as="h2" style={{ color: '#9d174d', fontSize: '20px', textAlign: 'center' }}>Order Status Update</Heading>

          <Text style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px' }}>
            Hi <strong style={{ color: '#db2777' }}>{customerName}</strong>,<br />
            There's an update regarding your order <strong>#{orderNumber}</strong>!
          </Text>

          <Container style={{ backgroundColor: '#fdf2f8', borderRadius: '8px', padding: '16px', textAlign: 'center', margin: '24px 0' }}>
            <Text style={{ color: '#be185d', fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
              {getStatusMessage(status)}
            </Text>
          </Container>

          <Hr style={{ borderColor: '#fbcfe8', margin: '24px 0' }} />

          <Heading as="h3" style={{ color: '#db2777', fontSize: '16px', margin: '0 0 16px 0' }}>Shipping Details</Heading>
          <Text style={{ color: '#4b5563', fontSize: '14px', lineHeight: '20px', marginBottom: '24px' }}>
            {address}<br />
            <strong>Phone:</strong> {phone}
          </Text>

          <Hr style={{ borderColor: '#fbcfe8', margin: '24px 0' }} />

          <Heading as="h3" style={{ color: '#db2777', fontSize: '16px', margin: '0 0 16px 0' }}>Order Summary</Heading>

          <Section>
            {items?.map((item: any, i: number) => (
              <Row key={i} style={{ marginBottom: '8px' }}>
                <Column style={{ width: '80%', color: '#374151', fontSize: '14px' }}>• {item.productName} (x{item.quantity})</Column>
                <Column style={{ width: '20%', textAlign: 'right', color: '#111827', fontSize: '14px', fontWeight: 'bold' }}>LKR {item.price}</Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: '#fbcfe8', margin: '24px 0' }} />

          <Row>
            <Column style={{ width: '80%', color: '#9d174d', fontSize: '16px', fontWeight: 'bold' }}>Total</Column>
            <Column style={{ width: '20%', textAlign: 'right', color: '#db2777', fontSize: '16px', fontWeight: 'bold' }}>LKR {totalAmount}</Column>
          </Row>

          <Text style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', marginTop: '48px' }}>
            With love, the Cocoon Kids Team 🌸<br />
            Thank you for shopping with us!<br />
            If you need any help, please reach out to us at <strong>070 132 7373</strong>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

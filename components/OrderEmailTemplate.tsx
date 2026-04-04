import * as React from 'react';
import { Html, Head, Body, Container, Text, Heading, Hr, Section, Row, Column } from '@react-email/components';

export function OrderEmailTemplate({ customerName, orderNumber, totalAmount, items }: any) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#fdf2f8', fontFamily: 'sans-serif', margin: '0', padding: '0' }}>
        <Container style={{ backgroundColor: '#ffffff', border: '1px solid #fce7f3', borderRadius: '16px', margin: '40px auto', padding: '32px', maxWidth: '600px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <Heading style={{ color: '#db2777', textAlign: 'center', margin: '0 0 24px 0' }}>🎀 Cocoon Kids 🎀</Heading>
          <Heading as="h2" style={{ color: '#9d174d', fontSize: '20px', textAlign: 'center' }}>Thank You For Your Order!</Heading>
          
          <Text style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px' }}>
            Hi <strong style={{ color: '#db2777' }}>{customerName}</strong>,<br/>
            Thank you so much for shopping with us! We have received your order <strong>#{orderNumber}</strong> and are getting it ready for your little princess.
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
            With love, the Cocoon Kids Team 🌸<br/>
            We will contact you regarding delivery right away!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

import { ShoppingBag } from "lucide-react";

export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: ShoppingBag,
  fields: [
    { name: 'orderNumber', title: 'Order Number', type: 'string' },
    { name: 'orderDate', title: 'Order Date', type: 'date' },
    { name: 'customerName', title: 'Customer Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'address', title: 'Shipping Address', type: 'text' },
    // ✅ NEW FIELD: Payment Method
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Cash on Delivery', value: 'cod' },
          { title: 'Online Payment', value: 'online' }
        ],
        layout: 'radio'
      }
    },
    { name: 'items', title: 'Ordered Items', type: 'array', of: [{ type: 'object', fields: [
        { name: 'productName', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
        { name: 'size', type: 'string' },
        { name: 'product', type: 'reference', to: [{ type: 'product' }] } 
      ]}]
    },
    { name: 'totalAmount', title: 'Total Amount', type: 'number' },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
        ],
        layout: 'radio'
      },
      initialValue: 'pending'
    }
  ]
}
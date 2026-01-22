export default {
  name: 'cart',
  title: 'Shopping Cart',
  type: 'document',
  fields: [
    {
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
    },
    {
      name: 'items',
      title: 'Cart Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string', title: 'Product ID' },
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'price', type: 'number', title: 'Price' },
            { name: 'quantity', type: 'number', title: 'Quantity' },
            { name: 'size', type: 'string', title: 'Size' },
            { name: 'imageUrl', type: 'string', title: 'Image URL' },
          ],
        },
      ],
    },
  ],
};
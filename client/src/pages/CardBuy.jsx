import React from 'react';

export default function CardBuy() {
  const products = [
    {
      name: 'Road Construction Material 1',
      image: 'https://via.placeholder.com/150', // Replace with actual image URL
      description: 'High-quality material for road construction projects 1.',
      price: 10.99
    },
    {
      name: 'Road Construction Material 2',
      image: 'https://via.placeholder.com/150', // Replace with actual image URL
      description: 'High-quality material for road construction projects 2.',
      price: 12.99
    },
    {
      name: 'Road Construction Material 3',
      image: 'https://via.placeholder.com/150', // Replace with actual image URL
      description: 'High-quality material for road construction projects 3.',
      price: 15.99
    },
    {
      name: 'Road Construction Material 4',
      image: 'https://via.placeholder.com/150', // Replace with actual image URL
      description: 'High-quality material for road construction projects 4.',
      price: 18.99
    }
  ];

  return (
    <div>
      <h1 className="text-center text-3xl  font-semibold mb-6">Road Construction Materials</h1>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="max-w-xs mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex md:flex-col md:justify-center md:items-center">
              <img className="h-56 w-full object-cover md:h-48 md:w-48" src={product.image} alt={product.name} />
              <div className="p-4">
                <h2 className="text-gray-800 text-2xl font-semibold">{product.name}</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-gray-700 font-bold">{product.price}</span>
                  <button className="px-3 py-1 bg-gray-800 text-white text-xs font-bold uppercase rounded">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

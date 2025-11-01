import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  

  // ✅ fetchList defined outside so it can be reused
  const fetchList = useCallback(async () => {
    try {
       const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token },
      });

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch products'); // ✅ toast works now
    }
  }, [token]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // ✅ works now
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-small'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center border-b py-1 px-2'
          >
            <img
              src={item.image?.[0] || 'placeholder.jpg'}
              alt={item.name}
              className='w-12 h-12 object-cover'
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p
              onClick={() => removeProduct(item._id)}
              className='text-center text-red-500 cursor-pointer'
            >
             Remove Product
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;

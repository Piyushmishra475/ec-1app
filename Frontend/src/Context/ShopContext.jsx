import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext  = createContext();

const ShopContextProvider =(props)=>{
   
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const [search , setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products , setProducts] = useState([]);
    const [token , setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
 

const addToCart = async (itemId, size) => {
  if (!size) {
    toast.error('Please select size');
    return;
  }

  let cartData = structuredClone(cartItems);

  if (cartData[itemId]) {
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }
  } else {
    cartData[itemId] = {};
    cartData[itemId][size] = 1;
  }

  setCartItems(cartData);

  if (token) {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, {
        headers: { token }
      });
      console.log('Add to cart response:', response.data);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to update cart');
    }
  } else {
    console.log('No token available for cart sync');
  }
};



   const getCartCount = ()=>{
    let totalCount = 0;
    for(const items in cartItems){
        for(const item in cartItems[items]){
            try{
                if(cartItems[items][item] > 0){
                    totalCount += cartItems[items][item];
                }
            } catch(err){
               
            }
        }
    }
        return totalCount;
   }

const updateQuantity = async (itemId, size, quantity) => {
  let cartData = structuredClone(cartItems);
  cartData[itemId][size] = quantity;
  setCartItems(cartData);

  if (token) {
    try {
      await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, {
        headers: { token }
      });
    } catch (error) {
      console.error(error);
    }
  }
};

   const getCartAmount = ()=>{
    let totalAmount = 0;
    for(const items in cartItems){
        let itemInfo = products.find((product)=> product._id === items);
        if (itemInfo) {
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
    }
    return totalAmount;
   }

    const getProductsData = async () => {
    try {
    const response = await axios.get(backendUrl+'/api/product/list');

    if (response.data.success) {
      console.log('Products fetched:', response.data.products);
      setProducts(response.data.products);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch products");
  }
};

useEffect(() => {
  getProductsData();
}, []); 

  
const getUserCart = async (token) => {
  try {
    const response = await axios.get(`${backendUrl}/api/cart/get`, {
      headers: { token }
    });
    if (response.data.success) {
      setCartItems(response.data.cartData || {});
    }
  } catch (error) {
    console.error('Cart fetch error:', error);
    setCartItems({});
  }
};


useEffect(() => {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    setToken(savedToken);
  }
  setLoading(false);
}, []);

useEffect(() => {
  if (token && !loading) {
    getUserCart(token);
  }
}, [token, loading]);




    const value = {
            products, currency, delivery_fee, 
            search, setSearch, showSearch, setShowSearch,
            cartItems, addToCart,
            getCartCount, updateQuantity,
            getCartAmount, navigate, backendUrl,
            setToken, token, setCartItems, loading,
            getProductsData
     };

    return(
       <ShopContext.Provider value={value}>
           {props.children}
       </ShopContext.Provider>
    )

}

export default ShopContextProvider;
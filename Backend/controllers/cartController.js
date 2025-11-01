import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;
    
    console.log('Adding to cart:', { userId, itemId, size });
    
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};
    
    console.log('Current cart data:', cartData);

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
    
    console.log('Updated cart data:', cartData);

    await userModel.findByIdAndUpdate(userId, { cartData });
    console.log('Cart saved to database');
    
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log('Cart error:', error);
    res.json({ success: false, message: error.message });
  }
};

const updateToCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;
    
    console.log('Updating cart:', { userId, itemId, size, quantity });
    
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};
    
    console.log('Before update:', cartData);
    
    if (quantity === 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = quantity;
    }
    
    console.log('After update:', cartData);
    
    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true, markModified: true });
    console.log('Cart updated in database');
    
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log('Update cart error:', error);
    res.json({ success: false, message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};
    
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, getUserCart, updateToCart };
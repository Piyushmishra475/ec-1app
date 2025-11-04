import React, {  useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../Components/Title';
import ProductItem from '../Components/ProductItem';

const Collection = () => {

  const {products , search , showSearch, getProductsData} = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false);

  const [filterProducts, setFilterProducts]= useState([]);

  const [category,setCategory]= useState([]);
  const [subCategory,setSubCategory]= useState([]);
  const[sortType,setSortType]= useState('relevant');

  useEffect(()=>{
    setFilterProducts(products);
  },[products])
  
  const toggleCategory=(e)=>{
    if(category.includes(e.target.value)){
      setCategory(prev=>prev.filter(item=> item !==e.target.value))
  }else{
      setCategory(prev=>[...prev,e.target.value])
  }
}


  const toggleSubCategory=(e)=>{
    console.log('Checkbox clicked:', e.target.value, 'Current subCategory:', subCategory);
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev=>prev.filter(item=> item !==e.target.value))
    }else{
      setSubCategory(prev=>[...prev,e.target.value])
    }
  }

  const applyFIlter=()=>{
    let productsCopy = products.slice()
    console.log('All products full:', products);
    console.log('First product detailed:', products[0]);
    console.log('All products mapped:', products.map(p => ({
      name: p.name, 
      subcategory: p.subcategory,
      subCategory: p.subCategory,
      keys: Object.keys(p)
    })));
    console.log('Selected subCategories:', subCategory);
    
    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if(category.length>0){
      productsCopy = productsCopy.filter(item=> category.includes(item.category));
    }

    if(subCategory.length>0){
      productsCopy = productsCopy.filter(item=> {
        // Temporary fix: assign subcategory based on product name
        let tempSubcategory = 'Topwear'; // default for t-shirts, tops, etc.
        
        const name = item.name.toLowerCase();
        if (name.includes('trouser') || name.includes('jean') || name.includes('pant')) {
          tempSubcategory = 'Bottomwear';
        } else if (name.includes('jacket') || name.includes('winter') || name.includes('coat')) {
          tempSubcategory = 'Winterwear';
        } else if (name.includes('t-shirt') || name.includes('top') || name.includes('shirt')) {
          tempSubcategory = 'Topwear';
        }
        
        const match = subCategory.includes(tempSubcategory);
        console.log(`Product "${item.name}": assigned subcategory=${tempSubcategory}, selected filters=${subCategory}, match=${match}`);
        return match;
      });
      console.log('Filtered products count:', productsCopy.length);
    }

    setFilterProducts(productsCopy);

  }

  const sortProducts = ()=>{

    let fpCopy = filterProducts.slice();

    switch(sortType){
      case'low-high':
      setFilterProducts(fpCopy.sort((a,b)=>(a.price-b.price)));
      break;

      case'high-low':
         setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)));
      break;

      default:
       applyFIlter();
        break;

    }
  }

  useEffect(()=>{
    applyFIlter();
  },[category,subCategory,search ,showFilter,products,showSearch])

  useEffect(()=>{
    sortProducts();
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* filter options */}

      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90': ''}`} src={assets.dropdown_icon} alt="" />
        </p>

      {/*  category filter */}

      <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '':'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Men'}   onChange={toggleCategory} /> Men
              </p>
               <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Women'}  onChange={toggleCategory}/> Women
              </p>
               <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
              </p>
          </div>
      </div>

      {/*  Sub Category filter         */ }

       <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '':'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Topwear'} checked={subCategory.includes('Topwear')} onChange={toggleSubCategory}/> Topwear
              </p>
               <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Bottomwear'} checked={subCategory.includes('Bottomwear')} onChange={toggleSubCategory}/> Bottomwear
              </p>
               <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Winterwear'} checked={subCategory.includes('Winterwear')} onChange={toggleSubCategory}/> Winterwear
              </p>
          </div>
      </div>

      </div>
          {/* Right side --------------------------------*/}

          <div className='flex-1'>
            <div className='flex justify-between text-base sm:text-2xl mb-4'>
              <Title text1={'ALL'} text2={'COLLECTIONS'}/>
                {/* product Sort --------------------*/}
                <select onChange={(e)=>setSortType(e.target.value)} className='border border-gray-300 text-sm px-2'>
                  <option value="relavent">Sort By: Relavent</option>
                  <option value="low-high">Sort By: Low to High</option>
                  <option value="high-low">Sort By: High to Low</option>
                </select>
            </div>
                {/* map products -------------------*/}

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                  {
                    filterProducts.map((item,index)=>(
                      <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image}/>
                    ))
                  }
                </div>
          </div>
    </div>
  )
}

export default Collection
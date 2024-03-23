import React, { useEffect, useState } from "react";
import "./ProductDetail.scss";
import {useParams} from 'react-router-dom'
// import dummyImg from "../../Assets/naruto.jpeg";
import { axiosClient } from "../../Utils/axiosClient";
import Loader from "../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/CartSlice";

function ProductDetail() {

  const params =useParams();
  const dispatch =useDispatch();
  const [product,setProduct]=useState(null);
  const productKey=params.productId;
  
  const cart=useSelector(state=>state.cartReducer.cart);
  const quantity= cart.find(item=>item.key===params.productId)?.quantity || 0;

  async function fetchData(){
    const productResponse=await axiosClient.get(`/products?filters[key][$eq]=${productKey}&populate=*`)
    if(productResponse.data.data.length > 0){
      setProduct(productResponse.data.data[0])
    }
  }

  useEffect(()=>{
    setProduct(null);
    fetchData();
  },[params])

  if(!product){
    return <Loader/>
  }

  return (
    <div className="ProductDetail">
      <div className="product-layout">
        <div className="product-img center">
          <div className="img-container">
          <img src={product?.attributes.image.data.attributes.url} alt="" />
          </div>
        </div>
        <div className="product-info">
          <h1 className="heading">{product?.attributes.title}</h1>
          <h3 className="price">₹ {product?.attributes.price}</h3>
          <p className="description">
          {product?.attributes.des}
          </p>

          <div className="cart-option">
            <div className="quantity-selector">
              <span className="btn decrement" onClick={()=>dispatch(removeFromCart(product))}>-</span>
              <span className="quantity">{quantity}</span>
              <span className="btn increment" onClick={()=>dispatch(addToCart(product))}>+</span>
            </div>
            <button className="btn-primary add-to-cart" onClick={() => dispatch(addToCart(product))}>Add To Cart</button>
          </div>

          <div className="returnPolicy">
            <ul>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id autem temporibus officia nemo sit?</li>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem minus unde quam?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

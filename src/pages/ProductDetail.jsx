import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../constants/API';
import { connect } from 'react-redux';
import { getCartData } from '../redux/actions/cart';

const ProductDetail = ({ userGlobal, getCartData }) => {
    let { productId } = useParams();
    const [productData, setProductData] = useState({});
    const [productNotFound, setProductNotFound] = useState(false);
    const [qty, setQty] = useState(1);
    
    useEffect(() => {
        getProductDetail(productId);
    })

    const getProductDetail = (id) => {
        Axios.get(`${API_URL}/products/${id}`)
        .then((result) => {
            setProductData(result.data);
        })
        .catch(() => {
            setProductNotFound(true);
        });
    }

    const qtyBtnHandler = (action) => {
        if (action === 'decrement' && qty > 1)
            setQty(qty - 1);
        else if (action === 'increment')
            setQty(qty + 1);
    }

    const addToCartHandler = () => {
        // CHECK IF USER HAVE ITEM IN CART
        Axios.get(`${API_URL}/carts`, {
            params:  {
                userId: userGlobal.id,
                productId: productData.id
            }
        })
        .then((result) => {
            if (result.data.length) { // IF CART ALREADY HAVE ITEM IN CART
                Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
                    quantity: result.data[0].quantity + qty
                })
                .then(() => {
                    alert("Berhasil menambah kuantitas item");
                    getCartData(userGlobal.id);
                })
                .catch(() => {
                    alert("Gagal menambahkan barang lama")
                })
            } else { // WHEN USER NEVER ADD ITEM IN CART
                Axios.post(`${API_URL}/carts`, {
                    userId: userGlobal.id,
                    productId: productData.id,
                    price: productData.price,
                    productName: productData.productName,
                    productImage: productData.productImage,
                    quantity: qty
                })
                .then(() => {
                    alert("berhasil menambahkan barang");
                    getCartData(userGlobal.id);
                })
                .catch(() => {
                    alert("gagal menambahkan barang");
                })
            }
        })
    }

    // console.log(this.props)
    return (
        <div className="container">
            {
                productNotFound ?
                <div className="alert alert-danger mt-3">Product with ID { productData.id } has not been found</div>
                :
                <div className="row mt-3">
                    <div className="col-5">
                        <img
                            style={{ width: '100%' }} 
                            src={ productData.productImage }
                            alt=""
                        />
                    </div>
                    <div className="col-7 d-flex flex-column justify-content-center">
                        <h4>{ productData.productName }</h4>
                        <h5>Rp { productData.price }</h5>
                        <p>
                            { productData.description }
                        </p>
                        <div className="d-flex flex-row align-items-center">
                            <button onClick={() => qtyBtnHandler('decrement')} className="btn btn-danger mr-4" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>-</button>
                            <input type="text" disabled value={ qty } style={{ height: "38px", width: "60px", borderRadius: 0, borderWidth: "1px", textAlign: "center" }} />
                            <button onClick={() => qtyBtnHandler('increment')} className="btn btn-success mr-3" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>+</button>
                        </div>
                        <button className="btn btn-primary mt-3" onClick={() => addToCartHandler() }>
                            Add to cart
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userGlobal: state.user,
    }
}

const mapDispatchToProps = {
    getCartData
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
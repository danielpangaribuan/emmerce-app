import React from 'react';
import "../assets/styles/product_card.css";
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../constants/API';
import { connect } from 'react-redux';
import { getCartData } from '../redux/actions/cart';

class ProductCard extends React.Component {

    addToCartHandler = () => {
        // CHECK IF USER HAVE ITEM IN CART
        Axios.get(`${API_URL}/carts`, {
            params:  {
                userId: this.props.userGlobal.id,
                productId: this.props.productData.id
            }
        })
        .then((result) => {
            if (result.data.length) { // IF CART ALREADY HAVE ITEM IN CART
                Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
                    quantity: result.data[0].quantity + 1
                })
                .then(() => {
                    this.props.getCartData(this.props.userGlobal.id);
                })
                .catch(() => {
                    alert("Gagal menambahkan barang lama")
                })
            } else { // WHEN USER NEVER ADD ITEM IN CART
                Axios.post(`${API_URL}/carts`, {
                    userId: this.props.userGlobal.id,
                    productId: this.props.productData.id,
                    price: this.props.productData.price,
                    productName: this.props.productData.productName,
                    productImage: this.props.productData.productImage,
                    quantity: 1
                })
                .then(() => {
                    this.props.getCartData(this.props.userGlobal.id);
                })
                .catch(() => {
                    alert("gagal menambahkan barang");
                })
            }
        })
    }

    render() {
        return (
            <div className="card product-card">
                <img 
                    src={this.props.productData.productImage} 
                    alt="" 
                />
                <div className="mt-2">
                    <div>
                        <Link to={`/product-detail/${this.props.productData.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <h6>{this.props.productData.productName}</h6>
                        </Link>
                        <span className="text-muted">Rp. {this.props.productData.price}</span>
                    </div>
                    <div className="d-flex flex-row justify-content-end">
                        <button className="btn btn-success mt-2" onClick={() => this.addToCartHandler()}>
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userGlobal: state.user
    }
}

const mapDispatchToProps = {
    getCartData,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
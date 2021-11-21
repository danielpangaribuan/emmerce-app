import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../constants/API';
import { getCartData } from '../redux/actions/cart';

class Cart extends React.Component {
    state = {
        isCheckoutMode: false,
        recipientName: "",
        address: "",
        payment: 0
    }

    deleteCartHandler = (cartId) => {
        Axios.delete(`${API_URL}/carts/${cartId}`)
        .then(() => {
            this.props.getCartData(this.props.userGlobal.id)
        })
        .catch(() => {
            alert("Gagal menghapus cart")
        })
    }

    renderCart = () => {
        return this.props.cartGlobal.cartList.map((val) => {
            return (
                <tr key={val.id}>
                    <td className="align-middle">
                        <img src={ val.productImage} alt="" style={{ height: "125px"}} />
                    </td>
                    <td className="align-middle">
                        {val.productName}
                    </td>
                    <td className="align-middle">
                        {val.quantity}
                    </td>
                    <td className="align-middle">
                        {val.price}
                    </td>
                    <td className="align-middle">
                        {val.price * val.quantity}
                    </td>
                    <td className="align-middle">
                        <button className="btn btn-danger" onClick={() => this.deleteCartHandler(val.id)}>
                            Delete
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderSubTotalPrice = () => {
        let subtotal = 0;
        for (let i = 0; i < this.props.cartGlobal.cartList.length; i++) {
            subtotal += this.props.cartGlobal.cartList[i].price * this.props.cartGlobal.cartList[i].quantity;
        }

        return parseFloat(subtotal);
    }

    renderTaxFee = () => {
        return this.renderSubTotalPrice() * 0.05;
    }

    renderTotalPrice = () => {
        return this.renderSubTotalPrice() + this.renderTaxFee();
    }

    checkoutModeToggle = () => {
        this.setState({ isCheckoutMode: !this.state.isCheckoutMode });
    }

    inputHandler = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    payButtonHandler = () => {
        // 1. Post ke transactions
        // 2. DELETE semua cart item yg sudah dibayar
        if (this.state.payment < this.renderTotalPrice()) {
            alert(`Uang anda kurang ${this.renderTotalPrice() - this.state.payment}`);
            return;
        }

        const d = new Date();
        Axios.post(`${API_URL}/transactions`, {
            userId: this.props.userGlobal.id,
            address: this.state.address,
            recipientName: this.state.recipientName,
            totalPrice: parseInt(this.renderTotalPrice()),
            totalPayment: parseInt(this.state.payment),
            transactionDate: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`, //DD-MM-YYYY
            transactionItems: this.props.cartGlobal.cartList
        })
        .then((result) => {
            if (this.state.payment > this.renderTotalPrice())
                alert(`Anda berhasil melakukan pembayaran, kembalian yang akan anda terima ${this.state.payment - this.renderTotalPrice()}`);
            alert(`Terimakasih telah melakukan pembelian di toko kami.`)
            result.data.transactionItems.forEach((val) => {
                this.deleteCartHandler(val.id);
            })
        })
        .catch(() => {
            alert("Terjadi kesalahan di server");
        })
    }

    render () {
        return (
            <div className="p-5">
                <h2 className='text-center'>Cart</h2>
                <div className="row mt-5">
                    <div className="col-9 text-center">
                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.renderCart() }
                            </tbody>
                            <tfoot className="bg-light">
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'right' }}>
                                        <button className="btn btn-success" onClick={this.checkoutModeToggle}>
                                            Checkout
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {
                        this.state.isCheckoutMode ? 
                        <div className="col-3">
                            <div className="card">
                                <div className="card-header">
                                    <strong>Order Summary</strong>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-row justify-content-between my-2">
                                        <span className="fw-bold">Subtotal Price</span>
                                        <span>Rp { this.renderSubTotalPrice() }</span>
                                    </div>

                                    <div className="d-flex flex-row justify-content-between my-2">
                                        <span className="fw-bold">Tax Fee (5%)</span>
                                        <span>Rp { this.renderTaxFee() }</span>
                                    </div>

                                    <div className="d-flex flex-row justify-content-between my-2">
                                        <span className="fw-bold">Total Price</span>
                                        <span>Rp { this.renderTotalPrice() }</span>
                                    </div>
                                </div>
                                <div className="card-body border-top">
                                    <label htmlFor="recipientName">Recipient Name</label>
                                    <input type="text" onChange={this.inputHandler} className="form-control mb-3" name="recipientName" />

                                    <label htmlFor="address">Address</label>
                                    <input type="text" onChange={this.inputHandler} className="form-control" name="address" />
                                </div>
                                <div className="card-footer">
                                    <input type="number" onChange={this.inputHandler} className="form-control" name="payment"/>
                                    <button className="btn btn-success w-100 mt-2" onClick={this.payButtonHandler}>Pay</button>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        cartGlobal: state.cart,
        userGlobal: state.user
    }
}

const mapDispatchToProps = {
    getCartData
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
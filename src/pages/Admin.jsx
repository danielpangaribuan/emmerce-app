import React from 'react';
import Axios from 'axios';
import { API_URL } from '../constants/API'
import '../assets/styles/admin.css';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

class Admin extends React.Component {
    state = {
        productList: [],
        addProductName: "",
        addPrice: 0,
        addProductImage: "",
        addDescription: "",
        addCategory: "",

        editId: 0,
        editProductName: "",
        editPrice: 0,
        editProductImage: "",
        editDescription: "",
        editCategory: "",
    }

    fetchProducts = () => {
        Axios.get(`${API_URL}/products`)
        .then((result) => {
            this.setState({ productList: result.data})
            console.log(result.data)
        })
        .catch(() => {
            alert('error')
        })
    }

    editToggle = ({ id, productName, price, productImage, description, category }) => {
        this.setState({ 
            editId: id,
            editProductName: productName,
            editPrice: price,
            editProductImage: productImage,
            editDescription: description,
            editCategory: category,
        });
    }

    cancelEdit = () => {
        this.setState({editId: 0});
        this.fetchProducts();
    }

    saveButtonHandler = () => {
        Axios.patch(`${API_URL}/products/${this.state.editId}`, {
            productName: this.state.editProductName,
            price: parseInt(this.state.editPrice),
            productImage: this.state.editProductImage,
            description: this.state.editDescription,
            category: this.state.editCategory
        })
        .then(() => {
            this.fetchProducts();
            this.cancelEdit();
        })
        .then(error => console.log('error :', error))
    }

    deleteButtonHandler = (deleteId) => {
        const confirmDelete = window.confirm(`Are you sure want to delete id = ${deleteId}`);
        if (confirmDelete) {
            Axios.delete(`${API_URL}/products/${deleteId}`)
            .then(() => {
                this.fetchProducts();
            })
            .catch(error => console.log('Error : ', error));
        } else {
            this.fetchProducts();
        }
    }

    renderProducts = () => {
        return this.state.productList.map(item => {
            if (item.id === this.state.editId) {
                return (
                    <tr>
                        <td>{item.id}</td>
                        <td>
                            <input onChange={this.inputHandler} type="text" name="editProductName" className="form-control" value={this.state.editProductName}/>
                        </td>
                        <td>
                            <input onChange={this.inputHandler} type="text" name="editPrice" className="form-control" value={this.state.editPrice}/>
                        </td>
                        <td>
                            <input onChange={this.inputHandler} type="text" name="editProductImage" className="form-control" value={this.state.editProductImage}/>
                        </td>
                        <td>
                            <input onChange={this.inputHandler} type="text" name="editDescription" className="form-control" value={this.state.editDescription}/>
                        </td>
                        <td>
                            <select onChange={this.inputHandler} type="text" name="editCategory" className="form-control" value={this.state.editCategory}>
                                <option value="">Select Category</option>
                                    <option value="shirt">Shirt</option>
                                    <option value="pants">Pants</option>
                                    <option value="outer">Outer</option>
                                </select>
                        </td>
                        <td>
                            <button className="btn btn-secondary" onClick={() => this.cancelEdit()}>Cancel</button>
                        </td>
                        <td>
                            <button className="btn btn-success" onClick={() => this.saveButtonHandler()}>Save</button>
                        </td>
                    </tr>
                )
            }
            return (
                <tr>
                    <td>{item.id}</td>
                    <td>{item.productName}</td>
                    <td>{item.price}</td>
                    <td>
                        <img src={item.productImage} alt="" className="admin-product-image" />
                    </td>
                    <td>{item.description}</td>
                    <td className="admin-product-category">{item.category}</td>
                    <td>
                        <button className="btn btn-secondary" onClick={() => this.editToggle(item)}>Edit</button>
                    </td>
                    <td>
                        <button className="btn btn-danger" onClick={() => this.deleteButtonHandler(item.id)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    addNewProduct = () => {
        Axios.post(`${API_URL}/products`, {
            productName: this.state.addProductName,
            price: parseInt(this.state.addPrice),
            productImage: this.state.addProductImage,
            description: this.state.addDescription,
            category: this.state.addCategory
        })
        .then(() => {
            this.fetchProducts();
            this.setState({
                addProductName: "",
                addPrice: 0,
                addProductImage: "",
                addDescription: "",
                addCategory: ""
            })
        })
        .then(error => console.log('error : ', error));
    }

    inputHandler = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value })
    }

    componentDidMount() {
        this.fetchProducts();
    }

    render () {
        if (this.props.userGlobal.role !== 'admin') {
            return <Navigate to="/" />
        }
        return (
            <div className="p-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <h1>Manage Products</h1>
                        <table className="table mt-4">
                            <thead className="bg-dark text-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Image</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th colSpan="2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.renderProducts() }
                            </tbody>
                            <tfoot className="bg-light">
                                <tr>
                                    <td></td>
                                    <td>
                                        <input value={this.state.addProductName} type="text" name="addProductName" onChange={this.inputHandler} className="form-control" />
                                    </td>
                                    <td>
                                        <input value={this.state.addPrice} type="number" name="addPrice" onChange={this.inputHandler} className="form-control" />
                                    </td>
                                    <td>
                                        <input value={this.state.addProductImage} type="text" name="addProductImage" onChange={this.inputHandler} className="form-control" />
                                    </td>
                                    <td>
                                        <input value={this.state.addDescription} type="text" name="addDescription" onChange={this.inputHandler} className="form-control" />
                                    </td>
                                    <td>
                                        <select value={this.state.addCategory}  name="addCategory" onChange={this.inputHandler} className="form-control">
                                            <option value="">Select Category</option>
                                            <option value="shirt">Shirt</option>
                                            <option value="pants">Pants</option>
                                            <option value="outer">Outer</option>
                                        </select>
                                    </td>
                                    <td colSpan="2">
                                        <button className="btn btn-info" onClick={() => this.addNewProduct() }>
                                            Add Product
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
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

export default connect(mapStateToProps)(Admin);
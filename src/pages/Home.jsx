import React from 'react';
import Axios from 'axios';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../constants/API';

class Home extends React.Component {
    state = {
        productList: [],
        filterProductList: [],
        page: 1,
        maxPage: 0,
        itemPerPage: 5,
        searchProductName: "",
        searchCategory: "",
        sortBy: "",
    }

    fetchProducts = () => {
        Axios.get(`${API_URL}/products`)
        .then((result) => {
            this.setState({ productList: result.data, maxPage: Math.ceil(result.data.length / this.state.itemPerPage), filterProductList: result.data })
        })
        .catch(() => {
            alert('Terjadi kesalahan di server');
        });
    }
    
    renderProducts = () => {
        const beginningIndex = (this.state.page - 1) * this.state.itemPerPage;

        const compareString = (a, b) => {
            if (a.productName < b.productName) 
                return -1

            if (a.productName > b.productName)
                return 1;

            return 0;
        }

        // sort product
        let rowData = [ ...this.state.filterProductList ];
        switch (this.state.sortBy) {
            case "lowPrice":
                rowData.sort((a,b) => a.price - b.price);
                break;
            case "highPrice":
                rowData.sort((a,b) => b.price - a.price);
                break;
            case "az":
                rowData.sort(compareString);
                break;
            case "za":
                rowData.sort((a,b) => compareString(b, a));
                break;
            default:
                rowData = [ ...this.state.filterProductList ]
                break;
        }
        const currentData = rowData.slice(beginningIndex, beginningIndex + this.state.itemPerPage);

        return currentData.map((item) => {
            return <ProductCard productData={ item } key={ item.id } />
        })
    }

    nextPageHandler = () => {
        if (this.state.page < this.state.maxPage)
            this.setState({ page: this.state.page + 1 })
    }

    prevPageHandler = () => {
        if (this.state.page > 1)
            this.setState({ page: this.state.page - 1 })
    }

    inputHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value });
    }

    searchButtonHandler = () => {
        const filterProductList = this.state.productList.filter((item) => {
            return item.productName.toLowerCase().includes(this.state.searchProductName.toLocaleLowerCase()) && item.category.toLowerCase().includes(this.state.searchCategory.toLocaleLowerCase())
        });

        this.setState({ filterProductList, maxPage: Math.ceil(filterProductList.length / this.state.itemPerPage), page: 1 });
    }

    componentDidMount() {
        this.fetchProducts();
    }

    render () {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-3">
                        <div className="card">
                            <div className="card-header">
                                <strong>Filter Products</strong>
                            </div>
                            <div className="card-body">
                                <label htmlFor="searchProductName">Product Name</label>
                                <input 
                                    type="text"
                                    name="searchProductName"
                                    placeholder="Search Product"
                                    className="form-control mb-3" 
                                    onChange={this.inputHandler}
                                />
                                <label htmlFor="searchCategory">Product Category</label>
                                <select name="searchCategory" onChange={this.inputHandler} className="form-control">
                                    <option value="">All Items</option>
                                    <option value="shirt">Shirt</option>
                                    <option value="pants">Pants</option>
                                    <option value="outer">Outer</option>
                                </select>
                                <button className="btn btn-primary w-100 mt-3" onClick={() => this.searchButtonHandler()}>Search</button>
                            </div>
                        </div>
                        <div className="card mt-4">
                            <div className="card-header">
                                <strong>Sort Products</strong>
                            </div>
                            <div className="card-body">
                                <label htmlFor="sortBy">Sort by</label>
                                <select name="sortBy" id="" className="form-control" onChange={this.inputHandler}>
                                    <option value="">Default</option>
                                    <option value="lowPrice">Lowest Price</option>
                                    <option value="highPrice">Highest Price</option>
                                    <option value="az">A-Z</option>
                                    <option value="za">Z-A</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <button className="btn btn-dark" onClick={this.prevPageHandler} disabled={this.state.page === 1}>
                                    { "<" }
                                </button>
                                <div className="text-center">Page { this.state.page } of { this.state.maxPage }</div>
                                <button className="btn btn-dark" onClick={this.nextPageHandler} disabled={this.state.page === this.state.maxPage}>
                                    { ">" }
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="d-flex flex-wrap flex-row">
                            {/* Render products here */}
                            { this.renderProducts() }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;
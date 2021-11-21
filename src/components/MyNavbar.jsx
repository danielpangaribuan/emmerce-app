import React from 'react';
import { Navbar, Nav, NavItem, UncontrolledDropdown, DropdownToggle, NavbarBrand, NavbarText, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/user';
import { AiOutlineShopping } from "react-icons/ai";
import "../assets/styles/navbar.css";

class MyNavbar extends React.Component {

    render() {
        return (
            <div>
                <Navbar color="dark" dark>
                    <NavbarBrand href="/">
                        Emmerce
                    </NavbarBrand>

                    <Nav>
                        {
                            this.props.userGlobal.username ?
                            <>
                                <NavItem className="my-auto">
                                    <NavbarText>Hello, {this.props.userGlobal.username}</NavbarText>
                                </NavItem>
                                <UncontrolledDropdown className="mx-3 cart-navbar">
                                    <DropdownToggle>
                                        <AiOutlineShopping />
                                        <span className="cart-count">{ this.props.cartGlobal.cartList.length }</span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>
                                            <div className="row">
                                                <div className="col-4">
                                                    <img src={"https://www.oxfoord.id/wp-content/uploads/2020/09/stripe-green-mix-247x296.jpg"} alt="" />
                                                </div>
                                                <div className="col-6">
                                                    <h5>Stripe Green Norwich</h5>
                                                </div>
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>

                                </UncontrolledDropdown>
                                <UncontrolledDropdown>
                                    <DropdownToggle nav caret style={{ color: "#BBB" }}>
                                        Pages
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>
                                            <Link to="/cart">Cart</Link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <Link to="/history">History</Link>
                                        </DropdownItem>
                                        {
                                            this.props.userGlobal.role === "admin" ?
                                            <DropdownItem>
                                                <Link to="/admin">Admin</Link>
                                            </DropdownItem>
                                            : null
                                        }
                                        <DropdownItem divider />
                                        <DropdownItem onClick={this.props.logoutUser}>
                                            Logout
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </>
                            :
                            <NavItem>
                                <NavbarText>
                                    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                                </NavbarText>
                            </NavItem>
                        }
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal: state.user,
        cartGlobal: state.cart
    }
}

const mapDispatchToProps = {
    logoutUser
}

export default connect(mapStateToProps, mapDispatchToProps)(MyNavbar);
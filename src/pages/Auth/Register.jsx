import React from 'react';
import { Link } from 'react-router-dom';
import { registerHandler } from '../../redux/actions/user';
import { connect } from 'react-redux';

class Register extends React.Component {
    state = {
        fullname: "",
        username: "",
        email: "",
        password: ""
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }

    

    render () {
        return (
            <div className="container">
                <div className="row mt-4">
                    <div className="col-12 text-center">
                        <h1>Register Now!</h1>
                        <p className="lead">
                            Register now and start shopping in the most affordable ecommerce platform
                        </p>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-4 offset-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="font-weight-bold mb-3">Register</div>
                                <input onChange={this.inputHandler} name="fullname" type="text" placeholder="Full Name" className="form-control my-2" />
                                <input onChange={this.inputHandler} name="username" type="text" placeholder="Username" className="form-control my-2" />
                                <input onChange={this.inputHandler} name="email" type="text" placeholder="Email" className="form-control my-2" />
                                <input onChange={this.inputHandler} name="password" type="password" placeholder="Password" className="form-control my-2" />
                                <div className="d-flex flex-row justify-content-between align-items-center">
                                    <button className="btn btn-primary mt-2" onClick={() => this.props.registerUser(this.state)}>
                                        Register
                                    </button>
                                    <Link to="/login">Or login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = {
    registerUser: registerHandler
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
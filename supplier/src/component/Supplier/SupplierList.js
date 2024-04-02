import React, { Component } from 'react';
import axios from "axios";
import PdfButton from './PdfButton';
import Header from '../Dashboard/Header/Header';
import Chart from 'chart.js/auto'; 
import "./supplier.css";

export default class SupplierList extends Component {

    constructor(props){
        super(props)

        this.state = {
            suppliers:[],
            oldsuppliers:[]
        }
    }

    componentDidMount(){
        this.retriveSupplier();
        this.retriveOldSupplier();
    }

    retriveSupplier(){
        axios.get("http://localhost:8070/supplier").then((res) =>{
            if(res.data.success){
                this.setState({
                    suppliers: res.data.existingSupplier
                }, () => {
                    this.initializeChart(this.state.suppliers);
                });
            }
        })
    }

    retriveOldSupplier(){
        axios.get("http://localhost:8070/old/supplier").then((res) =>{
            if(res.data.success){
                this.setState({
                    oldsuppliers: res.data.existingOldSupplier
                }, () => {
                    // Call initializeChart with both datasets
                    this.initializeChart(this.state.suppliers, this.state.oldsuppliers);
                });
            }
        })
    }

    onDelete1 = (id) =>{
        const isConfirmed = window.confirm('Are you sure you want to delete this supplier?');

        if (isConfirmed) {
            axios.delete(`http://localhost:8070/old/supplier/delete/${id}`)
                .then((res) => {
                    this.retriveOldSupplier();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    onDelete = (id) =>{
        const isConfirmed = window.confirm('Are you sure you want to delete this supplier?');

        if (isConfirmed) {
            axios.delete(`http://localhost:8070/supplier/delete/${id}`)
                .then((res) => {
                    this.retriveSupplier();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    filterData(suppliers, searchKey){
        const result = suppliers.filter((supplier) =>
            supplier.sid.toLowerCase().includes(searchKey) ||
            supplier.name.toLowerCase().includes(searchKey) || 
            supplier.address.toLowerCase().includes(searchKey) 
        );

        this.setState({suppliers: result});
    }

    handleSearchArea = (e) =>{
        const searchKey =  e.currentTarget.value;

        axios.get("http://localhost:8070/supplier").then((res) =>{
            if(res.data.success){
                this.filterData(res.data.existingSupplier, searchKey);
            }
        });
    }

    initializeChart(suppliers, oldSuppliers) {
        const ctxL = document.getElementById("lineChart");
    
        if (!ctxL || !suppliers || !oldSuppliers) return;
    
        if (this.chartInstance) {
            this.chartInstance.destroy(); // Destroy existing chart instance
        }
    
        const labels = suppliers.map(supplier => supplier.name);
        const data = suppliers.map(supplier => supplier.amount);
        const oldData = oldSuppliers.map(oldSupplier => oldSupplier.amount);
    
        this.chartInstance = new Chart(ctxL, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Supplier Amount",
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red background
                    borderColor: 'rgba(255, 99, 132, 1)', // Red border
                    borderWidth: 2
                },
                {
                    label: "Existing Supplier Amount",
                    data: oldData,
                    background: 'rgba(54, 162, 235, 0.2)', // Blue background
                    borderColor: 'rgba(54, 162, 235, 1)', // Blue border
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1000, 
                    easing: 'easeInOutQuart', 
                    
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    }
                },
                elements: {
                    line: {
                        tension: 0 // Disable bezier curves
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'X Axis = Supplier Name'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Y Axis = Total Amount'
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 20,
                        right: 30,
                        bottom: 20,
                        left: 30
                    }
                },
                
                
            }
        });
    }
    
    
    

    render() {
        return (
            <div>
                <Header/>
                <div className='container' id="supplierContainer">

{/*graph */}
                <div id="lineChartContainer" style={{marginBottom:"5%"}}>
                        <canvas id="lineChart"></canvas>
                    </div>
                    

                    <div className='col-lg-3 mt-2 mb-2'>
                        <input  
                            className="form-control"
                            type='search'
                            placeholder='Search'
                            name="serchQuery"
                            style={{marginLeft:"50px", borderRadius:"20px"}}
                            onChange={this.handleSearchArea}
                        />
                    </div>
                    
                
                    <div className='row' id="BtnRow">
                        <div className='col' id="newCol">
                            <button className='btn btn-success' id="supplierAdd">
                                <a href='add/supplier' style={{textDecoration:"none", color:"white"}}>
                                    <i className='fas fa-plus'></i>&nbsp;Add New
                                </a>
                            </button>
                        </div>

                        <div className='col' id="oldCol">
                            <button className='btn btn-info' id="supplierAddLod" >
                                <a href='/Old Supplier' style={{textDecoration:"none", color:"white"}}>
                                    <i className='fas fa-plus'></i>&nbsp;Add Old
                                </a>
                            </button>
                        </div>
                    </div> 

                    <h2 id="AllSupplier">All Suppliers</h2>
                    <br></br>       
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th scope='col'><i className='fas fa-list'></i></th>
                                <th scope='col'>Supplier Code</th>
                                <th scope='col'>Supplier Name</th>
                                <th scope='col'>Address</th>
                                <th scope='col'>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.suppliers.map((supplier, index) =>(
                                <tr key={index}>
                                    <th scope='row'>{index+1}</th>
                                    <td id='supplier'>{supplier.sid}</td>
                                    <td id='supplier'>{supplier.name}</td>
                                    <td id='supplier'>{supplier.address}</td>
                                    <td>
                                        <a className='btn' id="editBtn" href={`/editsupplier/${supplier._id}`}>
                                            <i className='fas fa-edit' id="editIcon"></i>
                                        </a>
                                        &nbsp;
                                        <a className='btn' href='# ' id="editDelete" onClick={() => this.onDelete(supplier._id)}>
                                            <i className='fas fa-trash-alt' id="DeleteIcon"></i>&nbsp;
                                        </a>
                                        &nbsp;<PdfButton supplier={supplier} />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <a href={`/supplier/${supplier._id}`} id="view">VIEW</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                
                    <div id="Extisting">
                        <h2 id="AllSupplier">Existing Record</h2>
                        <br></br>       
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th scope='col'><i className='fas fa-list'></i></th>
                                    <th scope='col'>Supplier Code</th>
                                    <th scope='col'>Product</th>
                                    <th scope='col'>Quantity</th>
                                    <th scope='col'>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.oldsuppliers.map((oldsupplier, index) =>(
                                    <tr key={index}>
                                        <th scope='row'>{index+1}</th>
                                        <td id='supplier'>{oldsupplier.sid}</td>
                                        <td id='supplier'>{oldsupplier.product}</td>
                                        <td id='supplier'>{oldsupplier.amount}</td>
                                        <td>
                                            <a className='btn' id="editBtn" href={`/editOldSupplier/${oldsupplier._id}`}>
                                                <i className='fas fa-edit' id="editIcon"></i>
                                            </a>
                                            &nbsp;
                                            <a className='btn' href='# ' id="editDelete" onClick={() => this.onDelete1(oldsupplier._id)}>
                                                <i className='fas fa-trash-alt' id="DeleteIcon"></i>&nbsp;
                                            </a>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <a href={`/view/Oldsupplier/${oldsupplier._id}`} id="view">VIEW</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

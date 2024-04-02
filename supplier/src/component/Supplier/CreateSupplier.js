import React,{useState, useEffect} from "react";
import axios from "axios";
import {useHistory } from "react-router-dom";
import "./supplier.css"
import Header from '../Dashboard/Header/Header'

export default function CreateSupplier() {

    const [sid, setSid] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [product, setProduct] = useState("");
    const [amount, setAmount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const history = useHistory();
    const [error, setError] = useState("");

    function sendData(e) {
      e.preventDefault();
  
      // Calculate the total amount
      const calculatedTotalAmount = quantity * amount;
  
      const newSupplier = {
          sid,
          name,
          address,
          product,
          amount,
          quantity,
          date,
          note,
          totalAmount: calculatedTotalAmount, // Add this line
      };
  
      axios.post("http://localhost:8070/supplier/save", newSupplier).then(() => {
          alert("Supplier Record Added");
          history.push("/supplier");
          window.location.reload();
      }).catch((err) => {
          if (err.response && err.response.data && err.response.data.error) {
            setError(err.response.data.error); 
            alert("Supplier with the same SID or Name already exists.")
            console.log(error)
          } else {
            setError("An error occurred while saving the supplier.");
          }
      });
  }

      useEffect(() => {   
      // Get the current date
      var currentDate = new Date();

      // Set the maximum date attribute for the input to the current date
      var year = currentDate.getFullYear();
      var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      var day = currentDate.getDate().toString().padStart(2, '0');
      var maxDate = `${year}-${month}-${day}`;

      document.getElementById('dateInput').setAttribute('max', maxDate);
         }, []);

    
  return (
    <div>
        <Header/>

        <div className="container" id="createSupplier" >
            <form onSubmit={sendData} style={{position:"relative", width:"65%"}}>
              <h2 id="AllSupplier">Add New Supplier</h2>
              <br></br>
              
  <div className="mb-3">
    <label for="exampleInputEmail1" className="form-label" id='supplier'>Supplier Code</label>
    <input type="text" className="form-control" id="exampleInputPassword1" aria-describedby="emailHelp" placeholder="Enter Supplier Code" 
    onChange={(e) =>{

        setSid(e.target.value);
    }}/>
  </div>

  
  <div className="mb-3">
    <label for="exampleInputPassword1" className="form-label" id='supplier'>Supplier Name</label>
    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Enter Supplier Name"
     onChange={(e) =>{

        setName(e.target.value);
    }}/>
  </div>

  <div className="mb-3">
    <label for="exampleInputPassword1" className="form-label" id='supplier'>Address</label>
    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Enter Supplier Address"
     onChange={(e) =>{

        setAddress(e.target.value);
    }}/>
  </div>

  <div className="mb-3">
    <label for="exampleInputPassword1" className="form-label" id='supplier'>Product</label>
    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Enter Product Name"
     onChange={(e) =>{

        setProduct(e.target.value);
    }}/>
  </div>

  <div className="mb-3">
    <label for="exampleInputPassword1" className="form-label" id='supplier'>Amount</label>
    <input type="number" className="form-control" id="exampleInputPassword1" placeholder="Enter Amount"
        min={"1"}
        onChange={(e) => {
            setAmount(e.target.value);
            setTotalAmount(e.target.value * quantity);
        }}
    />
</div>

<div className="row">
  <div className="col">
<div className="mb-3">
    <label for="exampleInputPassword1" className="form-label" id='supplier'>Quantity</label>
    <input type="number" className="form-control" id="exampleInputPassword1" placeholder="Enter Quantity"
         min={"1"}
        onChange={(e) => {
            setQuantity(e.target.value);
            setTotalAmount(e.target.value * amount);
        }}
    />
</div>
</div>


<div className="col">
  <div className="mb-3">
    <label htmlFor="dateInput" className="form-label" id='supplier'>Date</label>
    <input type="date" id="dateInput" name="date" max={""} value={date}
    className="form-control"
     onChange={(e) => setDate(e.target.value)}
      required/>
  </div>
  </div>
  </div>


  <div className="mb-3">
    <label for="exampleInputPassword1" className="form-label" id='supplier'>Additional Note</label>
    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Enter Additional Note"
     onChange={(e) =>{

        setNote(e.target.value);
    }}/>
  </div>

  <div class="count-display">
    <label class="count-label" for="exampleInputPassword1" id='supplier'>Total Amount:</label>
    <div class="count-value">LKR: {totalAmount}</div>
</div>


  <button type="submit" className="btn btn-success" style={{marginTop:"15px", borderRadius:"20px"}}>
  <i className='fas fa-save'></i>
  &nbsp; Save
  </button>
</form>

        </div> 
    </div>
  )
}



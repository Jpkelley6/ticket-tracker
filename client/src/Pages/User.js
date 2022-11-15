import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState, useEffect, useContext } from "react";
import PicContext from "../Contexts/UserPContext";
import Avatar from "react-avatar-edit";
import { Button } from "primereact/button";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import axios from "axios";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';




const User = () => {
  // const [src, setSrc] = useState(false);
  const [image, setImage] = useState("");
  const [imageCrop, setImageCrop] = useState(false);
  const [profile, setProfile] = useState([]);
  const [pview, setPview] = useState(false);
  const profileFinal = profile.map((item) => item.pview);

  const {fetchReq, fileState, pic, file} = useContext(PicContext)
  

  const onClose = () => {
    setPview(null);
  };

  const onCrop = (view) => {
    setPview(view);
  };

  const saveCropImage = () => {
    setProfile([...profile, { pview }]);
    setImageCrop(false);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const [category, setCategory] = useState([])
  const [urgency, setUrgency] = useState([])

  const [tickets, setTickets] = useState([]);
  const [date, setDate] = useState(null);
  const columns = [
      {field: 'ticket_id', header: 'Ticket #'},
      {field: 'to_char', header: 'Submission'},
      {field: 'category', header: 'Category'},
      {field: 'priority', header: 'Urgency'},
      {field: 'status', header: 'Status'},
      {field: 'assigned', header: 'Tech'}
  ];

  // const ticketService = new TicketService();

  //access token through sessionStorage
  const testToken = sessionStorage.getItem('testToken');
  //set the payload portion into a variable
  const getPayload = testToken.split('.')[1]; 
  //parse the decoded payload to access obj
  const payloadObj = (JSON.parse(atob(getPayload)))
  const {iat, email, userName, user_id, } = payloadObj

    //This allows us to re-render the page // 
    const [submitTicket, setSubmitTicket] = useState(false)

  const onSubmitForm = async (e) => {
    e.preventDefault();  
    console.log(category)
    
    
      
       const response = await axios.post("http://localhost:6001/User/ticket/create", { 
        user_id: user_id,
        category,
        descrip: "doesnt work",
        assigned: false,
        priority: urgency,
        eta: null,
       email: email,
        status: "in progress",
        campus_id: 1,
        create_date: date,
        resolved: null  });
        setSubmitTicket(true)
         console.log(response);
    

  }

  useEffect(() => {
      const renderTickets = async(e) =>{
          const response = await axios.get(`http://localhost:6001/user/${user_id}`);
          console.log(response.data);
          setSubmitTicket(false)
          setTickets(response.data)
      //   await ticketService.getTicketsSmall().then(data => setTickets(data));
      } 
      renderTickets();
  }, [submitTicket]);

  const dynamicColumns = columns.map((col,i) => {
      return <Column key={col.field} field={col.field} header={col.header} />;
  });

  
const categorySelectItems = [
  {label: 'Hardware', value: 'Hardware'},
  {label: 'Software', value: 'Software'},
  {label: 'Infrastructure', value: 'Infrastructure'},
  {label: 'Wi-Fi', value: 'Wi-Fi'},
  {label: 'Other', value: 'Other'}
];

const urgencyItems =[
  {label: '1- Urgent', value: '1- Urgent'},
  {label: '2- Priority', value: '2- Priority'},
  {label: '3- Routine', value: '3- Routine'},
  {label: '4- Minor', value: '4- Minor'}
]







  return (
    <>
    <div className="user-main">

      <h1 className="main-header">Welcome, user!</h1>
      <div className="profile_img text-center p-4">
        <div className="flex flex-column justify-content-center align-items-center">
          <img
          className="avatar-image"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid green",
            }}
            onClick={() => setImageCrop(true)}
            src={pic}
            alt=""
          />
          {/* <label htmlFor='' className='mt-3 font-semibold text-5x1'>placeHolder</label> */}
          <Dialog
            visible={imageCrop}
            header={() => (
              <p htmlFor="" className="text-2x1 font-semibold textColor">
                Update Profile Picture
              </p>
            )}
            onHide={() => setImageCrop(false)}
          >
            <div className="confirmation-content flex flex-column align-items-center">
              <Avatar
                width={500}
                height={400}
                onCrop={onCrop}
                onClose={onClose}
                // src={src}
                shadingColor={"#474649"}
                backgroundColor={"#474649"}
              />

              <div className="flex flex-column align-items-center mt-5 w-12">
                <div className="flex justify-content-around w-12 mt-4">
                  <Button
                    onClick={saveCropImage}
                    label="Save"
                    icon="pi pi-check"
                  />
                </div>
              </div>
            </div>
          </Dialog>

          <InputText
            type="file"
            accept="/image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        test
        <form onSubmit={fetchReq}>
          <input type="file" onChange={fileState}></input>
          <input className="upload" type="submit" />
        </form>
        <img src = {file} alt = ''/>
      </div>

    </div>


      <div className="ticket-card">

      <div className='ticket-Creation-Container'>
            <h2 className='create-Ticket'>Create a Ticket</h2>                    
            <span id="rtr-s-Paragraph_2_0" className='span-category'>Please select a category.</span>               
           <div className='Ticket-Creation'>
             <Dropdown className="category-Drop" value={category} options={categorySelectItems} onChange={(e) => setCategory(e.value)} placeholder="Select a Category"/>
           </div>
           <span id="urgency-Span">Please select an urgency.</span>             
               <div className='ticket-Urgency'>
               <Dropdown className="urgency-Drop" value={urgency} options={urgencyItems} onChange={(e) => setUrgency(e.value)} placeholder="Select Urgency"/>
               </div>
               <span className="date-Span">Please select Date</span>
               <div className="ticket-Date">
               <Calendar dateFormat="mm/dd/yy" value={date} onChange={(e) => setDate(e.value)}></Calendar>
              </div>
            <span id="rtr-s-Paragraph_9_0">Please provide specific details.</span> 
            <div class="paddingLayer">
               <textarea tabIndex="-1" placeholder=""></textarea>
            </div>
                <button className="ticket-submit" onClick={onSubmitForm}>Submit</button>
         </div>      
                              
                
                  
            <div className="card">
            <h2>Your Tickets</h2>             

                <DataTable value={tickets} className="ticket-Table" responsiveLayout="scroll">
                    {dynamicColumns}
                </DataTable>
            </div>                                 
      </div>
                  
    </>
  );
};

export default User;

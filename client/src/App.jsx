import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [users,setusers] = useState([]);
  const [filter,setfilter] = useState([]);
  const [userdata,setuserdata] = useState({name:"",age:"",city:""});
  const [addDataModel,setaddDataModel] = useState(false);
  const getallusers = async ()=>{
    const data = await axios.get("http://localhost:8000/users").then((res)=>res.data);
    console.log(data);
    setusers(data);
    setfilter(data);
  };
  // search function:
function handleSearch(event){
  const searchtext = event.target.value.toLowerCase();
  const filteruser = users.filter((user) => user.name.toLowerCase().includes(searchtext)||user.city.toLowerCase().includes(searchtext));
  setfilter(filteruser);
}
//delete user function:
  async function deleteuser(currenid){
    const isconfirmed = window.confirm('Are you sure you want to delete user');
    if(isconfirmed){
      const data = await axios.delete(`http://localhost:8000/users/${currenid}`).then((res)=>res.data);
      console.log(data);
      setusers(data)
      setfilter(data)
      window.alert("user deleted successfully")
    }
    else{}
  };
// add user data
function handleadduserdata(){
  setuserdata({name:"",age:"",city:""});
  setaddDataModel(true);
}
function closeadduser(){
  setaddDataModel(false);
  getallusers();
}
function handleinput(event){
  setuserdata({...userdata,[event.target.name]:event.target.value})
}
async function submitnewuser(event){
  event.preventDefault();
  if(!userdata.name||!userdata.age||!userdata.city){
    window.alert("please enter all data")
  }
  else{
    try{
      if(userdata.id){
        const submit = await axios.patch(`http://localhost:8000/users/${userdata.id}`,userdata).then((res)=>console.log(res));
      }
      else{
        const submit = await axios.post("http://localhost:8000/users",userdata).then((res)=>console.log(res));
      }
      
    }
    catch(error){
        window.alert(error)
    }
    finally{
      if(userdata.id){
       
        window.alert("User updated Successfully");
      }
      else{
        window.alert("user added successfully");
      }
      
    }
  }
  closeadduser();
  setuserdata({name:"",age:"",city:""});
  };

  function updateuser(user){
    setuserdata(user);
    setaddDataModel(true);
  };

useEffect(()=>{
  getallusers();
},[]);
  return (
    <>
    <div className="container">
      <h3>CRUR Application with React.js Frontend and Node.js Backend</h3>
      <div className="input-search">
        <input type="search" placeholder="search" onChange={handleSearch}/>
        <button onClick={handleadduserdata}>Add Record</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>s.no</th>
            <th>name</th>
            <th>age</th>
            <th>city</th>
            <th>edit</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
         {filter && filter.map((user,index)=>{
          return(  
            <tr key={user.id}>
            <td>{index+1}</td>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.city}</td>
            <td><button className="btn edit" onClick={()=>updateuser(user)}>edit</button></td>
            <td><button onClick={()=>deleteuser(user.id)} className="btn delete">delete</button></td>
          </tr>);
         })}
        </tbody>
      </table>
      {addDataModel && (<div className="add-data-model">
        <div className="add-data-body">
          <div className="add-data-head">
          {userdata.id?(<h2>update record</h2>):(<h2>add record</h2>)}
          <span onClick={closeadduser} className="close">&times;</span>
          </div>
          <div className="add-data-details">
            <label htmlFor="name">name:
              <input type="text" name="name" id="name" value={userdata.name} onChange={handleinput}/>
            </label>
            <label htmlFor="age">age:
              <input type="number" name="age" id="age" value={userdata.age} onChange={handleinput}/>
            </label>
            <label htmlFor="city">city:
              <input type="text" name="city" id="city" value={userdata.city} onChange={handleinput}/>
            </label>
            <button className="btn edit" onClick={submitnewuser}>{userdata.id?"update record":"add record"}</button>
          </div>
        </div>
      </div>)}
    </div>
     </>
  )
}

export default App;


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyBwFUr2WPYtxxMNJjw5ZPEJgR2hct-Ijjc",
  authDomain: "bank-c3ac1.firebaseapp.com",
  projectId: "bank-c3ac1",
  storageBucket: "bank-c3ac1.appspot.com",
  messagingSenderId: "43700694139",
  appId: "1:43700694139:web:b7d3b1183317065c7ec6de"
};



window.onload = function(){
  const app = initializeApp(firebaseConfig);
  const db = getDatabase();
  const dbref = ref(db);

    document.getElementById('ToReg').onclick=switchToReg;
    document.getElementById('ToLogin').onclick=switchTologin;
    document.getElementById('login-btn').onclick = loginValidation;
    document.getElementById('register-btn').onclick = registerValidation;
   
   
   
   
   function switchToReg(){
    document.getElementById('register-portal').style = "display:inline-block";
    document.getElementById('login-portal').style = "display:none";
   }
   function switchTologin(){
    document.getElementById('register-portal').style = "display: none ";
    document.getElementById('login-portal').style = "display:inline-block";
   }
   
   
   
   var accNoPat = "^[0-9]{6}$";
   var accPinPat = "^[0-9]{4}$";
   
   function loginValidation(){
    var lAccNo = document.getElementById('lAccNo').value;
    var lAccPin = document.getElementById('lAccPin').value;
    if(lAccNo.match(accNoPat) && lAccPin.match(accPinPat)){
      
      portal(lAccNo,lAccPin);
    }else{
        document.getElementById('ErrMsg').innerHTML = "Enter vaild details";
    }
   }

   function registerValidation(){
    var rAccName = document.getElementById('rAccName').value;
    var rAccNo = document.getElementById('rAccNo').value;
    var rAccPin = document.getElementById('rAccPin').value;
    var rConAccPin = document.getElementById('rConAccPin').value;
    if(rAccName!==null && rAccNo.match(accNoPat) && rAccPin.match(accPinPat) && rAccPin == rConAccPin){

        set(ref(db,"accNo "+rAccNo+"/accPin "+rAccPin+"/accDetails"),{
          name: rAccName,
          avalBal: 0
        }).then(()=>{
          alert("Registered");
        }).catch((error)=>{
          alert("Registered Failed\n"+error);
        });
     
        set(ref(db,"accNo "+rAccNo+"/received"),{
          receivedAmt: 0
        }).then(()=>{
          console.log("received amt updated");
        }).catch((error)=>{
          alert("received amt updation Failed\n"+error);
        });
     }else{
       alert("Please enter a valid details");
     }
     }
    
     

function portal(accNo,accPin){
  document.getElementById('login-portal').style = "display:none";
  document.getElementById('register-portal').style = "display:none";
  document.getElementById('portal').style = "display:inline-block";

  var name,avalBal,totalBal,receivedAmt,msg;


get(child(dbref,"accNo "+accNo+"/accPin "+accPin+"/accDetails")).then((snapshot)=>{
  if(snapshot.exists()){
     name = snapshot.val().name;
     avalBal = snapshot.val().avalBal;
     document.getElementById('userName').innerHTML += name.toUpperCase();
  }else{
    alert("no data found in the database");
  }
}).catch((error)=>{
  alert("error while getting  data\n"+error);
});

get(child(dbref,"accNo "+accNo+"/received")).then((snapshot)=>{
  if(snapshot.exists()){
      receivedAmt = snapshot.val().receivedAmt;
      totalBal = avalBal + receivedAmt;
      msg="welcome, "+name;
      updateAvalBal(msg,totalBal);
      updateReceivedAmt();
  }else{
    alert("no received amount found in the database");
  }
}).catch((error)=>{
  alert("error while getting  data\n"+error);
});



function updateAvalBal(msg,totalBal){
   update(ref(db,"accNo "+accNo+"/accPin "+accPin+"/accDetails"),{
     avalBal: totalBal
   }).then(()=>{
     alert(msg);
     document.getElementById('totalBal').innerHTML = "Total Balancec: "+totalBal;
   }).catch((error)=>{
     alert("error\n"+error);
   });
 }
   function updateReceivedAmt(){
      update(ref(db,"accNo "+accNo+"/received"),{
        receivedAmt: 0
      }).then(()=>{
        console.log("recived amount updated");
      }).catch((error)=>{
        alert("error\n"+error);
      });
}

document.getElementById('depoist-btn').addEventListener('click',depoist);

function depoist(){
  document.getElementById('depoist-portal').style= "display:inline-block";
  document.getElementById('withdraw-portal').style= "display:none";
  document.getElementById('transfer-portal').style= "display:none";

  document.getElementById('dep-submit').addEventListener('click',function(){
    document.getElementById('depoist-btn').removeEventListener('click',depoist);
    var depoistAmt = Number(document.getElementById('depoist-amt').value);
    if(depoistAmt>=100){
      totalBal += depoistAmt;
      document.getElementById('depoist-amt').value = '';
      msg = "Rs. "+depoistAmt+" was successfully depoisted";
      updateAvalBal(msg,totalBal);
    }else{
      alert('Minium depoist amount Rs.100');
    }
  });
}




document.getElementById('withdraw-btn').addEventListener('click',withdraw);
function withdraw(){
  document.getElementById('depoist-portal').style= "display:none ";
  document.getElementById('withdraw-portal').style= "display:inline-block";
  document.getElementById('transfer-portal').style= "display:none";

  document.getElementById('wit-submit').addEventListener('click',function(){
    document.getElementById('withdraw-btn').removeEventListener('click',depoist);
    var withdrawAmt = Number(document.getElementById('withdraw-amt').value);
    if(withdrawAmt>=10){
      totalBal -= withdrawAmt;
      document.getElementById('withdraw-amt').value = '';
      msg = "Rs. "+withdrawAmt+" was successfully withdrawn";
      updateAvalBal(msg,totalBal);
    }else{
      alert('Minium withdraw amount 10');
    }
  });
}



document.getElementById('transfer-btn').addEventListener('click',transfer);
function transfer(){
  document.getElementById('depoist-portal').style= "display:none ";
  document.getElementById('withdraw-portal').style= "display:none";
  document.getElementById('transfer-portal').style= "display:inline-block";

  document.getElementById('trans-submit').addEventListener('click',function(){

    document.getElementById('transfer-btn').removeEventListener('click',transfer);

    var transAccNo = document.getElementById('transfer-acc-no').value;
    var transferAmt = Number(document.getElementById('transfer-amt').value);

    document.getElementById('transfer-acc-no').value = '';
    document.getElementById('transfer-amt').value = '';

    if(transAccNo.match(accNoPat) && transferAmt>=10){

      update(ref(db,"accNo "+transAccNo+"/received"),{
        receivedAmt: transferAmt
      }).then(()=>{
        totalBal -= transferAmt;
        document.getElementById('withdraw-amt').value = '';
        msg = transferAmt+" was successfully transfer to "+transAccNo;
        updateAvalBal(msg,totalBal);
      }).catch((error)=>{
        alert('error\n'+error);
      });
    }else{
      alert('Minium withdraw amount 10');
    }
  });
  }
}

   

}



const canvas = document.getElementById('Matrix');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';



const alphabet = katakana + latin + nums ;

const fontSize = 16;
const columns = canvas.width/fontSize;

const rainDrops = [];

for( let x = 0; x < columns; x++ ) {
    rainDrops[x] = 1;
}

const draw = () => {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = '#0F0';
    context.font = fontSize + 'px monospace';

    for(let i = 0; i < rainDrops.length; i++)
    {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        context.fillText(text, i*fontSize, rainDrops[i]*fontSize);
        
        if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};

setInterval(draw, 30);

var popup = document.getElementById("popup");

var popBtn = document.getElementById("popupBtn");

popBtn.onclick = function(){

  
  if(popup.style.display == "block"){
    popup.style.display = "none"
  }else{
    popup.style.display = "block";
  }
}
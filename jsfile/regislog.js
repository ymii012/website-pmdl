const RegisterButton=document.getElementById('RegisterButton');
const LoginButton=document.getElementById("LoginButton");
const registerForm=document.getElementById('register');
const loginForm=document.getElementById('login');
const recoverButton=document.getElementById('ForgotButton');
const recoverForm=document.getElementById('forgot-password');

RegisterButton.addEventListener('click',function(){
    recoverForm.style.display="none";
    loginForm.style.display="none";
    registerForm.style.display="block";
})
LoginButton.addEventListener('click',function(){
    recoverForm.style.display="none";
    registerForm.style.display="none";
    loginForm.style.display="block";
})
recoverButton.addEventListener('click',function(){
    recoverForm.style.display="block";
    registerForm.style.display="none";
    loginForm.style.display="none";
})
// ----------------------POP UP------------------
// Close the popup when the button is clicked
function closePopup() {
  document.getElementById('errorPopup').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) closeBtn.addEventListener('click', closePopup);

  // Check if URL has ?error=1 (meaning login failed)
  const params = new URLSearchParams(window.location.search);
  if (params.has('error')) {
    document.getElementById('errorPopup').style.display = 'flex';
  }
});
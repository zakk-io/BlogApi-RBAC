

//register
const registerForm = document.getElementById('registerForm')
const registerUsername = document.getElementById('registerUsername')
const registerEmail = document.getElementById('registerEmail')
const registerPassword = document.getElementById('registerPassword')
const errormessage = document.getElementById('error-message')


registerForm.addEventListener('submit',async (e) => {
    e.preventDefault()
    const body = {
        username : registerUsername.value,
        email : registerEmail.value,
        password : registerPassword.value
    }

    const response = await fetch('/api/auth/register',{
        method : 'POST',
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify(body)
    })

    if(response.redirected){
        window.location.href = response.url
    }else{
        const data = await response.json()
        errormessage.style.display = "block"
        errormessage.innerHTML = data.message
    }
})

//register


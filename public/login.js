const loginForm = document.getElementById('loginForm')
const loginEmail = document.getElementById('loginEmail')
const loginPassword = document.getElementById('loginPassword')
const errormessage = document.getElementById('error-message')

const message = DOMPurify.sanitize(new URLSearchParams(window.location.search).get("message"),{ ALLOWED_TAGS: [] })
if(message){
    errormessage.style.display = "block"
    errormessage.innerHTML = message
}

loginForm.addEventListener('submit',async (e) => {
    e.preventDefault()
    const body = {
        email : loginEmail.value,
        password : loginPassword.value
    }

    const response = await fetch('/api/auth/login',{
        method : 'POST',
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify(body)
    })

    if(response.redirected){
        window.location.href = response.url
    }

    const data = await response.json()

    if(data.status === 400 || data.status === 401 || data.status === 429){
        errormessage.style.display = "block"
        errormessage.innerHTML = data.message
    }


})    
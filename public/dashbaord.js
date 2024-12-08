const group_id = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]
const message = document.getElementById("message")
const members_tbody = document.getElementById("members")
//group members
const GroupMembers = async function(){
    try {
        const response = await fetch(`/api/groups/${group_id}/members`)
        const data = await response.json()
        if(data.successful){
            
            let members_holder = ""
            for (let member = data.members.length - 1; member >= 0; member--) {

                const username = data.members[member].username
                const role = data.members[member].role
                const email = data.members[member].email
                const posts = data.members[member].posts

                members_holder += `<tr>
                            <td>${username}</td>
                            <td>${email}</td>
                            <td>${role}</td>
                            <td>${posts}</td>
                            <td>
                                <select id="selected_role" class="form-select me-2 mb-2 mb-md-0" aria-label="Set Role">
                                    <option value="admin">admin</option>
                                    <option value="member">member</option>
                                </select>
                                <button type="button" class="btn btn-primary" onclick="UpdateRole('${email}')">Update Role</button>
                            </td>
                            
                            <td>
                                <button class="btn btn-danger" onclick="KickUser('${email}')">Kick</button>
                            </td>
                        </tr>`
            }
            members_tbody.innerHTML = members_holder
            if(data.message){
                message.innerHTML = data.message
                message.style.display = "block"
            }
        }else{
            location.href = "/404"
        }
        
    } catch (error) {
        console.log(error);  
    }
}
//group members






//InvitedUsers
const InvitedUsersTable = document.getElementById("InvitedUsersTable")
const InvitedUsers = async function(){
    try {
        const response = await fetch(`/api/groups/${group_id}/invitations`)
        const data = await response.json()
        if(data.successful){
            let invitations_holder = ""
            for (let i = data.invitations.length - 1; i >= 0; i--) {
                const role = data.invitations[i].role
                const id = data.invitations[i]._id
                const email = data.invitations[i].email

                invitations_holder += `<tr class="tr">
                            <td>${email}</td>
                            <td>${role}</td>
                            <td>
                                <button class="btn btn-danger" id="${id}" onclick="DeleteInvitation('${id}')">Delete Invitation</button>
                            </td>
                        </tr>`
            }
            InvitedUsersTable.innerHTML = invitations_holder
        }else {
            // If there are no invitations, clear the table and show a message
            InvitedUsersTable.innerHTML = `<tr><td colspan="3">No invitations for now</td></tr>`;
        }
        
    } catch (error) {
        console.log(error);  
    }
}
//InvitedUsers




//DeleteInvitation
const DeleteInvitation = async function(invitation_id){
    try {
        const response = await fetch(`/api/groups/${group_id}/invitations/${invitation_id}`,{
            method : "DELETE",
        })

        if(response.ok){
            document.getElementById(invitation_id).closest(".tr").remove() //remove father from the dom
         }

        const data = await response.json()
        if(data.message){
            message.innerHTML = data.message
            message.style.display = "block"
        }

    } catch (error) {
        console.log(error);  
    }
}

//DeleteInvitation





//UpdateRole
const UpdateRole = async function(email){
    try {
        const selected_role = document.getElementById("selected_role").value
        const body = {
            email : email,
            role : selected_role
        }

        const response = await fetch(`/api/groups/${group_id}/UpdateRole`,{
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify(body)
        })
        GroupMembers()
        const data = await response.json()
        if(data.message){
            message.innerHTML = data.message
            message.style.display = "block"
        }
    } catch (error) {
        console.log(error);  
    }
}
//UpdateRole



//KickUser
const KickUser = async function(email){
    try {
        const body = {
            email : email
        }
        const response = await fetch(`/api/groups/${group_id}/kick`,{
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify(body)
        })
        const data = await response.json()
        if(data.message){
            message.innerHTML = data.message
            message.style.display = "block"
        }
        GroupMembers()
        InvitedUsers()
    } catch (error) {
        console.log(error);  
    }
}
//KickUser





//invite user
const inviteModal = document.getElementById("inviteModal")
inviteModal.addEventListener("submit",async (e) => {
    e.preventDefault()
    try {
        const role_form_select = document.getElementById("role_form_select").value;
        const invited_email = document.getElementById("invited_email").value;
        
        const body = {
            email: invited_email,
            role: role_form_select
        };

        const response = await fetch(`/api/groups/${group_id}`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if(response.ok){
            InvitedUsers()
        }

        const data = await response.json();
        if (data.message) {
            message.style.display = "block";
            message.innerText = data.message; 
        }

    } catch (error) {
        console.log(error);  
    }
})
//invite user




GroupMembers()
InvitedUsers()
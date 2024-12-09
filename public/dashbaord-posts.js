const group_id = window.location.pathname.split("/")[window.location.pathname.split("/").length - 2]
const message = document.getElementById("message")
const card_row = document.getElementById("card-row")


//list pended posts
const ListPendedPosts = async function(){
    try {
        const response = await fetch(`/api/groups/${group_id}/posts/pended`)
        const data = await response.json()
        
        if(data.successful){
            let posts_holder = ""
            for (let i = data.posts.length - 1; i >= 0; i--) {
                const id = data.posts[i]._id
                const author = data.posts[i].author	
                const title = data.posts[i].title	
                const content = data.posts[i].content	

                posts_holder += `<div class="col" id="${id}">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">By: ${author.username}</h6>
                        <p class="card-text">
                            ${content}.
                        </p>
                    </div>
                    <div class="card-footer bg-white d-flex justify-content-end">
                        <button class="btn btn-danger me-2" onclick="DeletePost('${id}')">Delete</button>
                        <button class="btn btn-success" onclick="PostsApproval('${id}')">Accept</button>
                    </div>
                </div>
            </div>
                `
            }
            card_row.innerHTML = posts_holder
        }else {
            message.style.display = "block";
            message.innerHTML = data.message;
        }
        
    } catch (error) {
        console.log(error);  
    }
}
//list pended posts



//approve posts
const PostsApproval = async function(post_id) {
    try {
        const response = await fetch(`/api/groups/${group_id}/posts/${post_id}`)
        const data = await response.json()

        if(data.successful){
            ListPendedPosts()
        }

        if(data.message){
            message.innerHTML = data.message
            message.style.display = "block"
        }  
    } catch (error) {
        console.log(error);  
    }
}
//approve posts




//delete posts
const DeletePost = async function(post_id) {
    try {
        const response = await fetch(`/api/groups/${group_id}/posts/${post_id}/delete`,{
            method : "DELETE"
        })
        const data = await response.json()

        if(data.successful){
            document.getElementById(post_id).remove()
        }

        if(data.message){
            message.innerHTML = data.message
            message.style.display = "block"
        }  
    } catch (error) {
        console.log(error);  
    }
}
//delete posts


ListPendedPosts()



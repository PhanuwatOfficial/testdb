const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');
const editForm = document.getElementById('edit-form');
const cancelEditBtn = document.getElementById('cancel-edit');

let currentUserId = null; // เก็บ id ผู้ใช้ที่กำลังแก้ไข

// ฟังก์ชันเพื่อเพิ่มผู้ใช้ใหม่
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age }),
    });
    loadUsers();
    userForm.reset();
});

// ฟังก์ชันเพื่อโหลดผู้ใช้
async function loadUsers() {
    const response = await fetch('http://localhost:4000/users');
    const users = await response.json();
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} - ${user.email} - ${user.age}`;
        
        // ปุ่มลบผู้ใช้
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = async () => {
            await fetch(`http://localhost:4000/users/${user.id}`, {
                method: 'DELETE',
            });
            loadUsers();
        };
        
        // ปุ่มแก้ไขผู้ใช้
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            currentUserId = user.id;
            document.getElementById('edit-name').value = user.name;
            document.getElementById('edit-email').value = user.email;
            document.getElementById('edit-age').value = user.age;
            editForm.style.display = 'block';
            userForm.style.display = 'none';
        };

        li.appendChild(deleteButton);
        li.appendChild(editButton);
        userList.appendChild(li);
    });
}

// ฟังก์ชันเพื่อแก้ไขข้อมูลผู้ใช้
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const age = document.getElementById('edit-age').value;

    await fetch(`http://localhost:4000/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, age }),
    });

    loadUsers();
    editForm.style.display = 'none';
    userForm.style.display = 'block';
});

// ยกเลิกการแก้ไข
cancelEditBtn.addEventListener('click', () => {
    editForm.style.display = 'none';
    userForm.style.display = 'block';
});

loadUsers();

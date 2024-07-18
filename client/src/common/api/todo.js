const originURL = 'http://localhost:8000/';

export const updateTodo = (changedFields) => {
    const url = new URL(`todo/${changedFields.id}/update/`, originURL);
    return fetch(url.href, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(changedFields)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => {throw err;});
        }
        return res.json();
    })
    .then(data => {
        console.log('recieved data',data);
    })
    .catch(error => {
        console.log('error handling',error);
    });
};


export const deleteTodo = (id) => {
    const url = new URL(`todo/${id}/delete/`, originURL);
    return fetch(url.href, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => {throw err;});
        }
        return res.json();
    })
    .then(data => {
        console.log('deleted data',data);
    })
    .catch(error => {
        console.log('error handling',error);
    });
};

export const getTodoList = () => {
    const url = new URL('todos/',originURL);
    return fetch(url, {
        method: 'GET',
        headers: {'Content-type' : 'application/json'}
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => {throw err;});
        }
        return res.json()
    });
};

export const createTodo = (changedfields) => {
    const url = new URL('todo/create/', originURL);
    return fetch(url,{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(changedfields)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => {throw err;});
        }
        return res.json();
    });
};






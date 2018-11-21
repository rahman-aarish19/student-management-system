function findUser(id) {
    $.ajax({
        type: 'GET',
        url: `/users/edit/${id}`,
        success: function (response) {
            document.getElementById('_id').value = response._id;
            document.getElementById('name').value = response.name;
            document.getElementById('email').value = response.email;
            $('select[name^="role"] option[value=' + response.role + ']').attr('selected', 'selected');
            $('select[name^="isAdmin"] option[value=' + response.isAdmin + ']').attr('selected', 'selected');
            $('select[name^="create"] option[value=' + response.privileges.create + ']').attr('selected', 'selected');
            $('select[name^="read"] option[value=' + response.privileges.read + ']').attr('selected', 'selected');
            $('select[name^="update"] option[value=' + response.privileges.update + ']').attr('selected', 'selected');
            $('select[name^="delete"] option[value=' + response.privileges.delete + ']').attr('selected', 'selected');

            $('#viewModal').modal('show');
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function updateUser() {
    $(document).ready(function () {
        const _id = $('#_id').val();
        const path = `/users/edit/${_id}`;

        $.ajax({
            type: 'PUT',
            url: path,
            data: {
                name: $('#name').val(),
                email: $('#email').val(),
                role: $('#role').val(),
                isAdmin: $('#isAdmin').val(),
                create: $('#create').val(),
                read: $('#read').val(),
                update: $('#update').val(),
                delete: $('#delete').val()
            },
            dataType: "json",
            success: function (response) {
                window.location.href = response;
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
}
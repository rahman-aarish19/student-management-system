// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function printPage(id) {
    const restorePage = document.body.innerHTML;
    const printContent = document.getElementById(id).innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = restorePage;
    window.location = "/students";
}

function msg() {
    bootbox.confirm("This is the default confirm!", function (result) {
        console.log('This was logged in the callback: ' + result);
    });
}

$(document).ready(function () {
    $('#btnGroup').hide();
    $('#btnDel').hide();

    $('#btnManage').click(function () {
        $('#btnGroup').toggle('slow');
        $('#btnDel').toggle('slow');
    });

    $('#checkall').change(function () {
        $('.checkbox-custom').prop('checked', $(this).prop('checked'));
    });

    $('#btnDel').click(function () {
        let obj = [];
        let id = $('.checkbox-custom:checked').map(function () {
            return $(this).val();
        });
        for (let i = 0; i < id.length; i++) {
            //console.log(id[i]);
            obj.push(id[i]);
        }

        $.ajax({
            type: 'DELETE',
            url: `/students/multiple/${obj}`,
            success: function (response) {
                //alert('Deleting Article');
                window.location.href = response;
                //console.log(response);
            },
            error: function (err) {
                console.log(err);
            }
        });


    });

    $('.delete-item').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');

        bootbox.confirm({
            message: "Are you sure you want to delete this item? This can't be undone.",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel',
                    className: 'btn-modal'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Delete',
                    className: 'btn-danger btn-modal'
                }
            },
            className: 'bootbox-class',
            callback: function (result) {
                if (result == true) {
                    const URL = id;
                    $.ajax({
                        type: 'DELETE',
                        url: URL,
                        success: function (response) {
                            //alert('Deleting Article');
                            window.location.href = response;
                            //console.log(response);
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
    });
});

// Date Picker
$('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
});

$('#datepicker2').datepicker({
    uiLibrary: 'bootstrap4'
});

$(function () {
    $("#btnPrint").printPreview({
        obj2print: '#printPreview',
        width: '1000'
    });
});
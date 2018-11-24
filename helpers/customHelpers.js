module.exports = {
    paginate: function (options) {
        let output = '';

        if (options.hash.current === 1) {
            output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
        } else {
            output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
        }

        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

        if (i !== 1) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }

        for (; i <= Number(options.hash.current) + 4 && i <= Number(options.hash.pages); i++) {
            if (i === options.hash.current) {
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
            } else {
                output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }

            if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
        }

        if (options.hash.current === options.hash.pages) {
            output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
        } else {
            output += `<li class="page-item"><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;
        }

        return output;
    },
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"').replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
    },
    if_eq: function (a, b, c, d, opts) {
        if (a == b || c == d) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    },
    select_course: function (dept, selected) {
        //let courseName = document.getElementById('chooseDept');
        let output = '';

        for (let i = 0; i < dept.length; i++) {
            if (dept[i].dname == selected) {
                output += `<option value="${dept[i].dname}" selected>${dept[i].dname}</option>`;
            } else {
                output += `<option value="${dept[i].dname}">${dept[i].dname}</option>`;
            }
        }
        return output;
    }
}
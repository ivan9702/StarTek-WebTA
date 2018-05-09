function post(path, params, newPage, method) {
  method = method || "post";

  const form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);
  if (newPage) form.setAttribute("target", "_blank");

  for(let key in params) {
    if(params.hasOwnProperty(key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

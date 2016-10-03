function takeShot() {
  const req = new Request('http://localhost:3000', {
    method: 'POST',
    body: JSON.stringify({
      html: document.documentElement.outerHTML,
      browserWidth: window.innerWidth,
      browserHeight: window.innerHeight,
      url: location.href
    })
  });

  fetch(req)
    .then((response) =>
      response.text()
    )
    .then((response) => {
      console.log(response);
      document.body.innerHTML += `<img src="data:image/png;base64,${response}"/>`;
    });
}

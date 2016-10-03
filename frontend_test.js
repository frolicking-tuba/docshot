function takeShot(x, y, w, h) {
  const shotData = {
    html: document.documentElement.outerHTML,
    browserWidth: window.innerWidth,
    browserHeight: window.innerHeight,
    url: location.href,
    clipX: x || window.scrollX,
    clipY: y || window.scrollY,
    clipWidth: w || window.innerWidth,
    clipHeight: h || window.innerHeight,
    userAgent: navigator.userAgent
  };

  const req = new Request('http://52.43.21.187:3000', {
    method: 'POST',
    body: JSON.stringify(shotData)
  });

  fetch(req)
    .then((response) =>
      response.text()
    )
    .then((response) => {
      const image = document.createElement('img');

      image.src = `data:image/png;base64,${response}`;
      image.style.position = 'absolute';
      image.style.top = `${shotData.clipY}px`;
      image.style.left = `${shotData.clipX}px`;
      image.style.width = 'auto';
      image.style.height = 'auto';
      image.style['z-index'] = 999999;
      image.style.background = '#ffffff';

      document.body.appendChild(image);
    });
}

document.addEventListener('mousedown', (event) => {
  let xPos = 0;
  let yPos = 0;
  let width = 0;
  let height = 0;

  event.preventDefault();

  const selection = document.createElement('div');

  selection.style.position = 'absolute';
  selection.style.border = 'solid rgba(30,136,229, .5) 1px';
  selection.style.background = 'rgba(30,136,229, .125)';

  document.body.appendChild(selection);

  document.addEventListener('mousemove', (moveEvent) => {
    const xdiff = moveEvent.pageX - event.pageX;
    const ydiff = moveEvent.pageY - event.pageY;

    xPos = (xdiff < 0) ? moveEvent.pageX : event.pageX;
    yPos = (ydiff < 0) ? moveEvent.pageY : event.pageY;

    width = Math.abs(xdiff);
    height = Math.abs(ydiff);

    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
    selection.style.left = `${xPos}px`;
    selection.style.top = `${yPos}px`;
  });

  document.addEventListener('mouseup', () => {
    document.body.removeChild(selection);
    takeShot(xPos, yPos, width, height);
  });
});


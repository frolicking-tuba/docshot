const props = {
  html: '',
  browserWidth: 600,
  browserHeight: 800,
  url: 'localhost',
  scrollX: 0,
  scrollY: 0,
  clipX: 0,
  clipY: 0,
  clipWidth: 600,
  clipHeight: 800,
  userAgent: 'docshot',
  image: null,
  id: 0
};

class Job {
  constructor(first, id) {
    if (id) {
      this.id = id;
    }

    this.deserialize(first);
  }

  serialize() {
    return JSON.stringify(this);
  }

  deserialize(json) {
    const parsed = JSON.parse(json);

    Object.keys(props).forEach((key) => {
      this[key] = parsed[key] || props[key];
    });
  }

  setImage(image) {
    this.image = image;
  }
}

module.exports = Job;

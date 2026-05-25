class Button {
    constructor(x, y, imageLink, active = false, id = "") {
        this.x = x;
        this.y = y;
        this.img = loadImage(imageLink);
        this.active = active;
        this.id = id;
    }

    setFunction(f) {
        this.clickedFunction = f;
    }

    clicked() {
        if (this.active) {
            let dx = abs(this.x - mouseX);
            let dy = abs(this.y - mouseY);
            if (dx <= this.img.width / 2 && dy <= this.img.height / 2) {
                this.clickedFunction(this);
                return true;
            }
        }

        return false;
    }

    show() {
        if (this.active) {
            image(this.img, this.x, this.y);
        }
    }

    activate() {
        this.active = !this.active;
    }

    setImage(image) {
        this.img = image;
    }
}
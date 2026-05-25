/**
 * @class Button
 * @brief This class serves as a custom representation of every button on the screen
 */
class Button {
    /**
     * @constructor
     * @param {*} x button's x coordinate
     * @param {*} y button's y coordinate
     * @param {*} imageLink button's image
     * @param {*} active button's ability to be clicked
     * @param {*} id button's ID, used by toggle buttons (SFX and Music)
     */
    constructor(x, y, imageLink, active = false, id = "") {
        this.x = x;
        this.y = y;
        this.img = loadImage(imageLink);
        this.active = active;
        this.id = id;
    }

    /**
     * @brief This method sets the function to be called on the button click
     * @param {*} f 
     */
    setFunction(f) {
        this.clickedFunction = f;
    }

    /**
     * @brief This method is a button click checker, checks if the button is active and
     * if the click ocurred inside the button bounds
     * @returns true on a valid click, false otherwise
     */
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

    /**
     * @brief This method draws the button's image onto the screen
     */
    show() {
        if (this.active) {
            image(this.img, this.x, this.y);
        }
    }

    /**
     * @brief This method switches the button's activity status
     */
    activate() {
        this.active = !this.active;
    }

    /**
     * @brief This method is a button's image setter
     * @param {*} image image to be set
     */
    setImage(image) {
        this.img = image;
    }
}
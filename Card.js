/**
 * @class Card
 * @brief This class represents each playing card in the game, holds the card's suit and value,
 * its position on the screen and its front and back image and visibility.
 */
class Card {
    /**
     * @constructor
     * @param {*} suit card's suit
     * @param {*} value card's value
     * @param {*} visible card's visibility
     */
    constructor(suit, value, visible = false) {
        this.suit = suit;
        this.value = value;
        if (suit !== 0) {
            this.image = loadImage("./images/" + suit + "/card_" + suit + "" + value + ".png");
        } else {
            this.image = loadImage("./images/O/card_" + suit + "" + value + ".png");
        }
        this.x = 0;
        this.y = 0;
        this.visible = visible;
    }

    /**
     * @brief This method draws the relevant card image based on the card's visibility
     */
    show() {
        if (this.visible) {
            image(this.image, this.x, this.y, floor(height / 4 * this.image.width / this.image.height), floor(height / 4));
        } else {
            image(cardback, this.x, this.y, floor(height / 4 * this.image.width / this.image.height), floor(height / 4));
        }
    }

    /**
     * @brief This method is a card's coordinates setter
     * @param {*} x card's new x coordinate
     * @param {*} y card's new y coordinate
     */
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @brief This method flips the card (changes its visibility)
     */
    flip() {
        this.visible = !this.visible;
    }

    /**
     * @brief This method is a mouse click checker, checks if the mouse is located on the card
     * @returns true if the card was clicked, false if not
     */
    clicked() {
        if (mouseX >= this.x - floor(height / 4 * this.image.width / this.image.height) / 2 
            && mouseX <= this.x + floor(height / 4 * this.image.width / this.image.height) / 2) {
            if (mouseY >= this.y - height / 4 / 2 && mouseY <= this.y + height / 4 / 2) {
                return true;
            }
        }

        return false;
    }

    /**
     * @brief This method calls the useCard method with the right arguments
     */
    use() {
        hand1 = useCard(hand1, getIndex(this, hand1));
    }
}
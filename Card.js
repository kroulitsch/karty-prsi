class Card {
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

    show() {
        if (this.visible) {
            image(this.image, this.x, this.y, floor(height / 4 * this.image.width / this.image.height), floor(height / 4));
        } else {
            image(cardback, this.x, this.y, floor(height / 4 * this.image.width / this.image.height), floor(height / 4));
        }
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    flip() {
        this.visible = !this.visible;
    }

    clicked() {
        if (mouseX >= this.x - floor(height / 4 * this.image.width / this.image.height) / 2 
            && mouseX <= this.x + floor(height / 4 * this.image.width / this.image.height) / 2) {
            if (mouseY >= this.y - height / 4 / 2 && mouseY <= this.y + height / 4 / 2) {
                return true;
            }
        }

        return false;
    }

    use() {
        hand1 = useCard(hand1, getIndex(this, hand1));
    }
}